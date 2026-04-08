#!/bin/bash
set -e

# ============================================
# AWS Workshop - S3 靜態網站部署腳本
# ============================================
# 使用方式：
#   1. 修改下方 BUCKET_NAME 為你想要的名稱
#   2. chmod +x deploy.sh
#   3. ./deploy.sh setup    (首次部署，建立 S3 + CloudFront)
#   4. ./deploy.sh sync     (後續更新內容)
#   5. ./deploy.sh destroy  (清理所有資源)
# ============================================

BUCKET_NAME="my-aws-workshop-site"
REGION="ap-northeast-1"

# 顏色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log()  { echo -e "${GREEN}[✓]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
err()  { echo -e "${RED}[✗]${NC} $1"; exit 1; }

# ---- 首次建立 ----
setup() {
  echo ""
  echo "🚀 開始部署 Workshop 到 S3 + CloudFront"
  echo ""

  # 建立 S3 bucket
  log "建立 S3 Bucket: ${BUCKET_NAME}"
  if [ "$REGION" = "us-east-1" ]; then
    aws s3api create-bucket \
      --bucket "$BUCKET_NAME" \
      --region "$REGION" 2>/dev/null || warn "Bucket 可能已存在，繼續..."
  else
    aws s3api create-bucket \
      --bucket "$BUCKET_NAME" \
      --region "$REGION" \
      --create-bucket-configuration LocationConstraint="$REGION" 2>/dev/null || warn "Bucket 可能已存在，繼續..."
  fi

  # 封鎖公開存取（透過 CloudFront OAC 存取）
  log "設定 Bucket 封鎖公開存取"
  aws s3api put-public-access-block \
    --bucket "$BUCKET_NAME" \
    --public-access-block-configuration \
    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

  # 上傳檔案
  sync_files

  # 建立 CloudFront OAC
  log "建立 CloudFront Origin Access Control"
  OAC_ID=$(aws cloudfront create-origin-access-control \
    --origin-access-control-config \
    "Name=${BUCKET_NAME}-oac,Description=OAC for workshop,SigningProtocol=sigv4,SigningBehavior=always,OriginAccessControlOriginType=s3" \
    --query 'OriginAccessControl.Id' --output text 2>/dev/null) || true

  if [ -z "$OAC_ID" ]; then
    OAC_ID=$(aws cloudfront list-origin-access-controls \
      --query "OriginAccessControlList.Items[?Name=='${BUCKET_NAME}-oac'].Id | [0]" --output text)
  fi
  log "OAC ID: ${OAC_ID}"

  # 建立 CloudFront Distribution
  log "建立 CloudFront Distribution（約需 3-5 分鐘）"
  DIST_CONFIG=$(cat <<EOF
{
  "CallerReference": "workshop-$(date +%s)",
  "Comment": "AWS Workshop Site",
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-${BUCKET_NAME}",
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": { "Quantity": 2, "Items": ["GET", "HEAD"] },
    "CachedMethods": { "Quantity": 2, "Items": ["GET", "HEAD"] },
    "ForwardedValues": { "QueryString": false, "Cookies": { "Forward": "none" } },
    "Compress": true,
    "MinTTL": 0,
    "DefaultTTL": 86400,
    "MaxTTL": 31536000
  },
  "Origins": {
    "Quantity": 1,
    "Items": [{
      "Id": "S3-${BUCKET_NAME}",
      "DomainName": "${BUCKET_NAME}.s3.${REGION}.amazonaws.com",
      "OriginAccessControlId": "${OAC_ID}",
      "S3OriginConfig": { "OriginAccessIdentity": "" }
    }]
  },
  "Enabled": true,
  "DefaultRootObject": "index.html",
  "CustomErrorResponses": {
    "Quantity": 1,
    "Items": [{
      "ErrorCode": 403,
      "ResponsePagePath": "/index.html",
      "ResponseCode": "200",
      "ErrorCachingMinTTL": 10
    }]
  },
  "PriceClass": "PriceClass_100"
}
EOF
)

  DIST_RESULT=$(aws cloudfront create-distribution \
    --distribution-config "$DIST_CONFIG" \
    --query 'Distribution.{Id:Id,Domain:DomainName}' --output json)

  DIST_ID=$(echo "$DIST_RESULT" | python3 -c "import sys,json;print(json.load(sys.stdin)['Id'])")
  DIST_DOMAIN=$(echo "$DIST_RESULT" | python3 -c "import sys,json;print(json.load(sys.stdin)['Domain'])")

  log "Distribution ID: ${DIST_ID}"
  log "Distribution Domain: ${DIST_DOMAIN}"

  # 設定 S3 Bucket Policy 允許 CloudFront 存取
  log "設定 Bucket Policy"
  ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
  BUCKET_POLICY=$(cat <<EOF
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "AllowCloudFrontServicePrincipal",
    "Effect": "Allow",
    "Principal": { "Service": "cloudfront.amazonaws.com" },
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::${BUCKET_NAME}/*",
    "Condition": {
      "StringEquals": {
        "AWS:SourceArn": "arn:aws:cloudfront::${ACCOUNT_ID}:distribution/${DIST_ID}"
      }
    }
  }]
}
EOF
)
  aws s3api put-bucket-policy --bucket "$BUCKET_NAME" --policy "$BUCKET_POLICY"

  echo ""
  echo "============================================"
  log "部署完成！"
  echo ""
  echo "  CloudFront 網址: https://${DIST_DOMAIN}"
  echo "  Distribution ID: ${DIST_ID}"
  echo ""
  warn "CloudFront 需要幾分鐘才能完全生效"
  warn "後續更新內容只需執行: ./deploy.sh sync"
  echo "============================================"
}

# ---- 同步檔案 ----
sync_files() {
  log "同步檔案到 S3"
  aws s3 sync . "s3://${BUCKET_NAME}" \
    --exclude ".*" \
    --exclude "deploy.sh" \
    --exclude "*.png" \
    --exclude "*.yml" \
    --exclude ".playwright-mcp/*" \
    --delete

  # 設定正確的 Content-Type
  aws s3 cp "s3://${BUCKET_NAME}/index.html" "s3://${BUCKET_NAME}/index.html" \
    --content-type "text/html; charset=utf-8" --metadata-directive REPLACE

  aws s3 cp "s3://${BUCKET_NAME}/config.json" "s3://${BUCKET_NAME}/config.json" \
    --content-type "application/json; charset=utf-8" --metadata-directive REPLACE

  # Markdown 檔案與 manifest
  find content -name '*.md' -o -name '_manifest.json' | while read f; do
    KEY="$f"
    if [[ "$f" == *.md ]]; then
      CT="text/markdown; charset=utf-8"
    else
      CT="application/json; charset=utf-8"
    fi
    aws s3 cp "s3://${BUCKET_NAME}/${KEY}" "s3://${BUCKET_NAME}/${KEY}" \
      --content-type "$CT" --metadata-directive REPLACE 2>/dev/null || true
  done

  log "檔案同步完成"
}

# ---- 更新內容 ----
sync() {
  echo ""
  echo "📦 同步更新內容到 S3"
  sync_files

  # 嘗試清除 CloudFront 快取
  DIST_ID=$(aws cloudfront list-distributions \
    --query "DistributionList.Items[?Comment=='AWS Workshop Site'].Id | [0]" --output text 2>/dev/null)

  if [ -n "$DIST_ID" ] && [ "$DIST_ID" != "None" ]; then
    log "清除 CloudFront 快取"
    aws cloudfront create-invalidation \
      --distribution-id "$DIST_ID" \
      --paths "/*" > /dev/null
    log "快取清除請求已送出"
  fi

  echo ""
  log "更新完成！"
}

# ---- 清理資源 ----
destroy() {
  echo ""
  warn "即將刪除所有 Workshop 資源"
  read -p "確定要繼續嗎？(y/N) " confirm
  [ "$confirm" != "y" ] && exit 0

  # 找到 Distribution
  DIST_ID=$(aws cloudfront list-distributions \
    --query "DistributionList.Items[?Comment=='AWS Workshop Site'].Id | [0]" --output text 2>/dev/null)

  if [ -n "$DIST_ID" ] && [ "$DIST_ID" != "None" ]; then
    log "停用 CloudFront Distribution: ${DIST_ID}"
    ETAG=$(aws cloudfront get-distribution-config --id "$DIST_ID" --query 'ETag' --output text)
    CONFIG=$(aws cloudfront get-distribution-config --id "$DIST_ID" --query 'DistributionConfig')
    UPDATED=$(echo "$CONFIG" | python3 -c "import sys,json;c=json.load(sys.stdin);c['Enabled']=False;print(json.dumps(c))")
    aws cloudfront update-distribution --id "$DIST_ID" --if-match "$ETAG" --distribution-config "$UPDATED" > /dev/null
    warn "等待 Distribution 停用（這需要幾分鐘）..."
    aws cloudfront wait distribution-deployed --id "$DIST_ID" 2>/dev/null || true
    ETAG=$(aws cloudfront get-distribution-config --id "$DIST_ID" --query 'ETag' --output text)
    aws cloudfront delete-distribution --id "$DIST_ID" --if-match "$ETAG"
    log "CloudFront Distribution 已刪除"
  fi

  # 刪除 OAC
  OAC_ID=$(aws cloudfront list-origin-access-controls \
    --query "OriginAccessControlList.Items[?Name=='${BUCKET_NAME}-oac'].Id | [0]" --output text 2>/dev/null)
  if [ -n "$OAC_ID" ] && [ "$OAC_ID" != "None" ]; then
    ETAG=$(aws cloudfront get-origin-access-control --id "$OAC_ID" --query 'ETag' --output text)
    aws cloudfront delete-origin-access-control --id "$OAC_ID" --if-match "$ETAG"
    log "OAC 已刪除"
  fi

  # 清空並刪除 S3
  log "清空並刪除 S3 Bucket"
  aws s3 rm "s3://${BUCKET_NAME}" --recursive 2>/dev/null || true
  aws s3api delete-bucket --bucket "$BUCKET_NAME" 2>/dev/null || true
  log "S3 Bucket 已刪除"

  echo ""
  log "所有資源已清理完畢"
}

# ---- 主程式 ----
case "${1:-}" in
  setup)   setup ;;
  sync)    sync ;;
  destroy) destroy ;;
  *)
    echo "使用方式: ./deploy.sh [setup|sync|destroy]"
    echo ""
    echo "  setup   - 首次部署（建立 S3 + CloudFront）"
    echo "  sync    - 更新內容"
    echo "  destroy - 清理所有資源"
    ;;
esac
