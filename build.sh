#!/bin/bash
# ============================================
# 自動掃描 content/ 產生索引
# 用法：chmod +x build.sh && ./build.sh
# ============================================
set -e

CONTENT="content"

# --- 1. 掃描所有 workshop 資料夾（_開頭的跳過）---
ws_list=()
for dir in "$CONTENT"/*/; do
  slug=$(basename "$dir")
  [[ "$slug" == _* ]] && continue
  [ -f "${dir}_index.md" ] || continue
  ws_list+=("$slug")
done

# 更新 config.json 的 workshops 陣列（保留其他欄位）
WS_JSON=$(printf '%s\n' "${ws_list[@]}" | python3 -c "
import sys, json
slugs = [l.strip() for l in sys.stdin if l.strip()]
with open('config.json') as f:
    cfg = json.load(f)
cfg['workshops'] = sorted(slugs)
with open('config.json', 'w') as f:
    json.dump(cfg, f, ensure_ascii=False, indent=2)
print('config.json: workshops =', sorted(slugs))
")
echo "$WS_JSON"

# --- 2. 每個 workshop 產生 _manifest.json ---
for slug in "${ws_list[@]}"; do
  ws_dir="$CONTENT/$slug"

  python3 -c "
import os, sys, json, re

ws_dir = '$ws_dir'
slug = '$slug'

# 收集所有 .md 檔（相對於 workshop 目錄）
pages = []
for root, dirs, files in os.walk(ws_dir):
    # 跳過 images 等非內容目錄
    dirs[:] = [d for d in dirs if not d.startswith('.') and d != 'images']
    for f in files:
        if not f.endswith('.md'):
            continue
        rel = os.path.relpath(os.path.join(root, f), ws_dir)
        pages.append(rel)

# 讀 front matter 取 order（支援點分隔，如 3.1 → (3, 1)）
def get_order(path):
    try:
        with open(os.path.join(ws_dir, path)) as f:
            text = f.read()
        m = re.match(r'^---\n(.*?)\n---', text, re.S)
        if m:
            for line in m.group(1).split('\n'):
                if line.strip().startswith('order:'):
                    val = line.split(':',1)[1].strip()
                    return tuple(int(x) for x in val.split('.'))
    except:
        pass
    return (999,)

pages = sorted(pages, key=get_order)

# 從 _index.md front matter 讀 metadata
meta = {}
idx_path = os.path.join(ws_dir, '_index.md')
if os.path.exists(idx_path):
    with open(idx_path) as f:
        text = f.read()
    m = re.match(r'^---\n(.*?)\n---', text, re.S)
    if m:
        for line in m.group(1).split('\n'):
            if ':' in line:
                k, v = line.split(':', 1)
                meta[k.strip()] = v.strip()

# 讀取現有 manifest 保留手動設定的欄位
manifest_path = os.path.join(ws_dir, '_manifest.json')
existing = {}
if os.path.exists(manifest_path):
    with open(manifest_path) as f:
        existing = json.load(f)

# 合併：手動欄位優先，pages 永遠覆蓋
manifest = {
    'order': existing.get('order', 999),
    'title': existing.get('title') or meta.get('title', slug),
    'description': existing.get('description', ''),
    'badge': existing.get('badge', ''),
    'level': existing.get('level', ''),
    'duration': existing.get('duration', ''),
    'icon': existing.get('icon', '📘'),
    'pages': pages
}

with open(manifest_path, 'w') as f:
    json.dump(manifest, f, ensure_ascii=False, indent=2)

print(f'{manifest_path}: {len(pages)} pages')
"
done

echo "Done."
