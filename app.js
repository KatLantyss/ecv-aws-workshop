/* ═══════════════════════════════════════════
   Icon Registry (SSOT)
   ═══════════════════════════════════════════ */
const ICONS = {
  'aws-sign-out': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"><path d="M9 0V2H3V14H9V16H3C1.89543 16 1 15.1046 1 14V2C1 0.895431 1.89543 0 3 0H9Z"/><path d="M12.5858 9L10 11.5858L11.4142 13L15.7071 8.70711C16.0976 8.31658 16.0976 7.68342 15.7071 7.29289L11.4142 3L10 4.41421L12.5858 7H6V9H12.5858Z"/></svg>',
  'aws-new-tab':  '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="none"><path d="M13 9.012v-6H7M13.02 3 7 9.01M3 5.012v8h8.01" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
  'aws-refresh':  '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="none" overflow="hidden"><path d="M15 0v5l-5-.04" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M15 8c0 3.87-3.13 7-7 7s-7-3.13-7-7 3.13-7 7-7c2.79 0 5.2 1.63 6.33 4" stroke="currentColor" stroke-width="2"/></svg>',
  'aws-expand':   '<svg viewBox="2 3 12 10" xmlns="http://www.w3.org/2000/svg"><path d="m8 11 4-6H4l4 6Z" fill="currentColor"/></svg>',
  'aws-info':     '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="2" fill="none"/><path d="M8 12V7M8 6V4" stroke="currentColor" stroke-width="2"/></svg>',
  'aws-success':  '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="2" fill="none"/><path d="M4.5 7.5 7 10l4-5" stroke="currentColor" stroke-width="2" stroke-linejoin="round" fill="none"/></svg>',
  'aws-warning':  '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M8 5v4M8 10v2" stroke="currentColor" stroke-width="2"/><path d="M6.52 1.88l-5.33 9.76c-.13.23-.19.5-.19.76 0 .88.71 1.59 1.59 1.59H13.4c.88 0 1.59-.71 1.59-1.59 0-.27-.07-.53-.19-.76L9.48 1.88C9.18 1.34 8.62 1 8 1s-1.18.34-1.48.88Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" fill="none"/></svg>',
  'aws-error':    '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="2" fill="none"/><path d="m5.5 5.5 5 5M10.5 5.5l-5 5" stroke="currentColor" stroke-width="2"/></svg>',
  'aws-copy':     '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M15 5H5v10h10V5Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" fill="none"/><path d="M13 1H1v11" stroke="currentColor" stroke-width="2" stroke-linejoin="round" fill="none"/></svg>'
};

function getIcon(name) {
  if (ICONS[name]) return ICONS[name];
  if (typeof lucide !== 'undefined') {
    // Lucide icon names are PascalCase internally, try both
    const key = name.replace(/-./g, m => m[1].toUpperCase()).replace(/^./, m => m.toUpperCase());
    const iconData = lucide.icons[key] || lucide.icons[name];
    if (iconData) {
      const inner = iconData.map(([tag, attrs]) => {
        const a = Object.entries(attrs).map(([k,v]) => `${k}="${v}"`).join(' ');
        return `<${tag} ${a}/>`;
      }).join('');
      return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
    }
  }
  return '';
}

/* ═══════════════════════════════════════════
   Markdown Custom Syntax Preprocessor
   ═══════════════════════════════════════════ */
function preprocessCustomSyntax(md) {
  // 保護 code block（含巢狀 backtick），避免裡面的自訂語法被轉換
  const codeBlocks = [];
  md = md.replace(/^([ \t]{0,3})(`{3,})([^\n]*)\n([\s\S]*?)^\1\2\s*$/gm, (match) => {
    codeBlocks.push(match);
    return `\x00CB${codeBlocks.length - 1}\x00`;
  });
  // ``text`` → 可複製的行內 code（在單 backtick 保護之前處理）
  md = md.replace(/``([^`]+)``/g, (_, text) => {
    const escaped = text.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '&quot;');
    const html = `<code class="copyable" role="button" tabindex="0" onclick="copyInline(this,'${escaped}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();copyInline(this,'${escaped}')}">${text}</code>`;
    codeBlocks.push(html);
    return `\x00CB${codeBlocks.length - 1}\x00`;
  });
  // 保護行內 code
  md = md.replace(/`[^`\n]+`/g, (match) => {
    codeBlocks.push(match);
    return `\x00CB${codeBlocks.length - 1}\x00`;
  });

  md = md.replace(/:::button-row\n(.*?)\n:::/g, (_, inner) =>
    `<div class="ws-btn-row">${inner.trim()}</div>`);

  // Images with custom attrs: ![alt](url){width="60%"} or ![alt](url "caption"){width="400px"}
  md = md.replace(/!\[([^\]]*)\]\(([^)]+)\)(?:\{([^}]+)\})?/g, (match, alt, urlPart, attrs) => {
    // Parse url and optional title: url "title"
    const urlMatch = urlPart.match(/^(\S+?)(?:\s+"([^"]*)")?$/);
    if (!urlMatch) return match;
    let [, href, title] = urlMatch;
    // Resolve relative paths
    if (href && !href.startsWith('http') && !href.startsWith('/')) {
      const ch = chapters[currentIndex];
      if (ch && ch.file) {
        const dir = ch.file.substring(0, ch.file.lastIndexOf('/'));
        href = dir + '/' + href;
      }
    }
    const width = attrs ? (attrs.match(/width="([^"]+)"/) || [])[1] : '';
    const style = width ? ` style="max-width:${width}"` : '';
    const caption = title ? `<figcaption>${title}</figcaption>` : '';
    return `<figure class="ws-figure"${style}><button class="ws-figure-btn" type="button" aria-label="放大圖片" onclick="openLightbox(this.querySelector('img'))"><img src="${href}" alt="${alt || ''}" loading="lazy"></button>${caption}</figure>`;
  });

  md = md.replace(/::button\[([^\]]*)\]\{([^}]*)\}/g, (_, text, attrs) => {
    const variant = (attrs.match(/variant="([^"]+)"/) || [])[1] || 'action';
    const prefix  = (attrs.match(/prefix="([^"]+)"/)  || [])[1] || '';
    const postfix = (attrs.match(/postfix="([^"]+)"/) || [])[1] || '';
    const split   = (attrs.match(/split="([^"]+)"/)   || [])[1] || '';
    if (!text.trim() && prefix) return `<span class="ws-btn-icon">${getIcon(prefix)}</span>`;
    const pre  = prefix  ? `${getIcon(prefix)} `   : '';
    const post = postfix ? ` ${getIcon(postfix)}`   : '';
    if (split) {
      return `<span class="ws-btn-split"><span class="ws-btn ws-btn-${variant}">${pre}${text}${post}</span><span class="ws-btn-divider"></span><span class="ws-btn ws-btn-${variant}">${getIcon(split)}</span></span>`;
    }
    return `<span class="ws-btn ws-btn-${variant}">${pre}${text}${post}</span>`;
  });

  md = md.replace(/::badge\[([^\]]+)\]\{([^}]+)\}/g, (_, text, attrs) => {
    const type = (attrs.match(/type="([^"]+)"/) || [])[1] || 'default';
    return `<span class="ws-badge ws-badge-${type}">${text}</span>`;
  });

  // Status text: ::status[text]{type="success" icon="circle-check"}
  md = md.replace(/::status\[([^\]]+)\]\{([^}]*)\}/g, (_, text, attrs) => {
    const type = (attrs.match(/type="([^"]+)"/) || [])[1] || 'info';
    const icon = (attrs.match(/icon="([^"]+)"/) || [])[1] || '';
    const iconHtml = icon ? `<span class="ws-status-icon">${getIcon(icon)}</span>` : '';
    return `<span class="ws-status ws-status-${type}">${iconHtml}${text}</span>`;
  });

  md = md.replace(/::video\{src="([^"]+)"\}/g, (_, src) => {
    const url = src.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/');
    return `<div class="ws-video"><iframe src="${url}" title="影片播放器" allowfullscreen loading="lazy"></iframe></div>`;
  });

  const alertIconMap = { info: 'aws-info', warning: 'aws-warning', success: 'aws-success', danger: 'aws-error' };
  md = md.replace(/:::alert\{type="(\w+)"\}\n([\s\S]*?):::/g, (_, type, body) =>
    `<div class="ws-alert ws-alert-${type}"><span class="ws-alert-icon">${getIcon(alertIconMap[type] || '')}</span><div class="ws-alert-body">\n\n${body.trim()}\n\n</div></div>`);

  md = md.replace(/:::banner\{type="(\w+)"\}\n([\s\S]*?):::/g, (_, type, body) =>
    `<div class="ws-banner ws-banner-${type}"><span class="ws-banner-icon">${getIcon(alertIconMap[type] || '')}</span><div class="ws-banner-body">\n\n${body.trim()}\n\n</div></div>`);

  md = md.replace(/:::expand\{title="([^"]+)"\}\n([\s\S]*?):::/g, (_, title, body) =>
    `<div class="ws-expand"><button class="ws-expand-header" onclick="toggleExpand(this)" aria-expanded="false"><span class="ws-expand-arrow">${getIcon('aws-expand')}</span>${title}</button><div class="ws-expand-body">\n\n${body.trim()}\n\n</div></div>`);

  md = md.replace(/:::steps\n([\s\S]*?):::/g, (_, body) => {
    // 按 "數字." 開頭分割成 steps，子列表和續行歸入上一個 step
    const lines = body.trim().split('\n');
    const steps = [];
    for (const line of lines) {
      if (/^\d+\.\s/.test(line.trim())) {
        steps.push(line.replace(/^\s*\d+\.\s*/, ''));
      } else if (steps.length > 0) {
        steps[steps.length - 1] += '\n' + line;
      }
    }
    const html = steps.map(s =>
      `<div class="ws-step"><div class="ws-step-body">\n\n${s.trim()}\n\n</div></div>`
    ).join('');
    return `<div class="ws-steps">${html}</div>`;
  });

  md = md.replace(/:::tabs\n([\s\S]*?):::/g, (_, body) => {
    const parts = body.split(/::tab\[([^\]]+)\]\n/).filter(s => s.trim());
    const tabs = [];
    for (let i = 0; i < parts.length; i += 2)
      tabs.push({ title: parts[i], content: (parts[i + 1] || '').trim() });
    const id = 'tabs-' + Math.random().toString(36).slice(2, 8);
    const hdr = tabs.map((t, i) => {
      const panelId = `${id}-panel-${i}`;
      const tabId = `${id}-tab-${i}`;
      return `<button class="ws-tab-btn" role="tab" id="${tabId}" aria-selected="${i === 0}" aria-controls="${panelId}" tabindex="${i === 0 ? 0 : -1}" onclick="switchTab('${id}',${i})">${t.title}</button>`;
    }).join('');
    const pnl = tabs.map((t, i) => {
      const panelId = `${id}-panel-${i}`;
      const tabId = `${id}-tab-${i}`;
      return `<div class="ws-tab-panel" role="tabpanel" id="${panelId}" aria-labelledby="${tabId}"${i === 0 ? '' : ' hidden'}>\n\n${t.content}\n\n</div>`;
    }).join('');
    return `<div class="ws-tabs" id="${id}"><div class="ws-tabs-header" role="tablist" onkeydown="handleTabKeydown(event,'${id}')">${hdr}</div>${pnl}</div>`;
  });

  // 還原 code block：fenced block 直接轉 HTML，避免 marked.js CommonMark 規則
  // 誤判不同 indent 的 closing fence
  // 注意：copyable HTML（以 < 開頭）保留 placeholder，在 marked.parse 之後才還原
  md = md.replace(/\x00CB(\d+)\x00/g, (_, i) => {
    const block = codeBlocks[i];
    // 已經是 HTML（copyable code）— 保留 placeholder，讓 marked 不干擾
    if (block.startsWith('<')) return `\x00CB${i}\x00`;
    const lines = block.trimEnd().split('\n');
    const langMatch = lines[0].match(/^([ \t]{0,3})`{3,}(\S*)/);
    if (!langMatch) return block; // inline code — 交給 marked.js 處理
    const [, indent, lang] = langMatch;
    const codeLines = lines.slice(1, -1);
    const code = indent
      ? codeLines.map(l => l.startsWith(indent) ? l.slice(indent.length) : l).join('\n')
      : codeLines.join('\n');
    const highlighted = simpleHighlight(code);
    const langClass = lang ? ` class="language-${lang}"` : '';
    return `\n\n<pre><button class="copy-btn" onclick="copyCode(this)" aria-label="複製">${getIcon('aws-copy')}</button><code${langClass}>${highlighted}</code></pre>\n\n`;
  });

  // 儲存 codeBlocks 供 marked.parse 之後還原
  preprocessCustomSyntax._blocks = codeBlocks;
  return md;
}

/* ═══════════════════════════════════════════
   Syntax Highlighting (basic)
   ═══════════════════════════════════════════ */
function simpleHighlight(code) {
  const KW = new Set(['import','from','def','return','class','function','const','let','var',
    'if','else','for','while','async','await','export','default','new','try','catch','throw']);
  const out = [];
  // 逐 token 處理，避免 regex 互相干擾
  const re = /((?<![:\w])\/\/[^\n]*|(?<=^|\s)#[^\n]*|"[^"]*"|'[^']*'|\b\d+\b|\b[a-zA-Z_]\w*\b|[^\s]|\s+)/g;
  let m;
  const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  while ((m = re.exec(code)) !== null) {
    const t = m[0];
    if (t.startsWith('//') || t.startsWith('#')) {
      out.push('<span class="token-comment">' + esc(t) + '</span>');
    } else if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
      out.push('<span class="token-string">' + esc(t).replace(/"/g,'&quot;').replace(/'/g,'&#39;') + '</span>');
    } else if (/^\d+$/.test(t)) {
      out.push('<span class="token-number">' + t + '</span>');
    } else if (KW.has(t)) {
      out.push('<span class="token-keyword">' + t + '</span>');
    } else {
      out.push(esc(t));
    }
  }
  return out.join('');
}

/* ═══════════════════════════════════════════
   State
   ═══════════════════════════════════════════ */
let config = null;
let workshops = [];       // [{slug, manifest, dir}]
let currentWorkshop = null;
let currentIndex = 0;
let chapters = [];

/* ═══════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════ */
function parseFrontMatter(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return { frontMatter: {}, body: md };
  const fm = {};
  m[1].split('\n').forEach(line => {
    const i = line.indexOf(':');
    if (i === -1) return;
    const k = line.slice(0, i).trim();
    let v = line.slice(i + 1).trim();
    if (/^\d+$/.test(v)) v = parseInt(v, 10);
    fm[k] = v;
  });
  return { frontMatter: fm, body: m[2] };
}

function buildChapterId(filePath, workshopDir) {
  let rel = filePath.replace(workshopDir + '/', '');
  rel = rel.replace(/\/_index\.md$/, '').replace(/\.md$/, '');
  if (rel === '_index') rel = 'index';
  return rel.replace(/\//g, '-');
}

function getDepth(filePath, workshopDir) {
  let rel = filePath.replace(workshopDir + '/', '');
  // _index.md 代表資料夾本身，不算子層
  if (rel.endsWith('/_index.md')) {
    rel = rel.replace(/\/[^/]+$/, '');
  }
  return (rel.match(/\//g) || []).length;
}

/* ═══════════════════════════════════════════
   Configure marked (once)
   ═══════════════════════════════════════════ */
marked.use({
  breaks: true,
  gfm: true,
  renderer: {
    code({ text, lang }) {
      const highlighted = simpleHighlight(text);
      const langClass = lang ? ` class="language-${lang}"` : '';
      return `<pre><button class="copy-btn" onclick="copyCode(this)" aria-label="複製">${getIcon('aws-copy')}</button><code${langClass}>${highlighted}</code></pre>`;
    },
    image({ href, title, text }) {
      if (href && !href.startsWith('http') && !href.startsWith('/')) {
        const ch = chapters[currentIndex];
        if (ch && ch.file) {
          const dir = ch.file.substring(0, ch.file.lastIndexOf('/'));
          href = dir + '/' + href;
        }
      }
      const alt = text || '';
      const caption = title ? `<figcaption>${title}</figcaption>` : '';
      return `<figure class="ws-figure"><button class="ws-figure-btn" type="button" aria-label="放大圖片" onclick="openLightbox(this.querySelector('img'))"><img src="${href}" alt="${alt}" loading="lazy"></button>${caption}</figure>`;
    },
    link({ href, title, tokens }) {
      const text = this.parser.parseInline(tokens);
      if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto:')) {
        const mdMatch = href.replace(/\.md$/, '').replace(/\/_index$/, '').replace(/^\.\//, '');
        const idx = chapters.findIndex(c => c.id === mdMatch || c.file.includes(href));
        if (idx >= 0) {
          const titleAttr = title ? ` title="${title}"` : '';
          return `<a href="#${currentWorkshop}/${chapters[idx].id}" onclick="loadChapter(${idx})"${titleAttr}>${text}</a>`;
        }
        const ch = chapters[currentIndex];
        if (ch && ch.file) {
          const dir = ch.file.substring(0, ch.file.lastIndexOf('/'));
          href = dir + '/' + href;
        }
      }
      const titleAttr = title ? ` title="${title}"` : '';
      const external = href && href.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<a href="${href}"${titleAttr}${external}>${text}</a>`;
    }
  }
});

/* ═══════════════════════════════════════════
   Init — load config & build landing
   ═══════════════════════════════════════════ */
async function init() {
  try {
    config = await fetch('config.json').then(r => r.json());
    document.getElementById('headerTitle').textContent = config.title;
    document.title = config.title;

    // logo: 圖片路徑或 emoji 文字
    const logoEl = document.getElementById('headerLogo');
    if (config.logo && (config.logo.endsWith('.png') || config.logo.endsWith('.svg') || config.logo.endsWith('.jpg') || config.logo.endsWith('.webp'))) {
      logoEl.innerHTML = `<img src="${config.logo}" alt="logo" width="36" height="36">`;
    } else {
      logoEl.textContent = config.logo || '☁';
    }
    document.getElementById('landingTitle').textContent = config.title;
    document.getElementById('landingSubtitle').textContent = config.subtitle || '';
    document.getElementById('landingFooter').innerHTML = `<p>${config.footer || ''}</p>`;
    document.getElementById('footer').innerHTML = `<p>${config.footer || ''}</p>`;

    // config.workshops: ["folder-name", ...]
    const slugs = config.workshops || [];
    const fetches = slugs.map(async (slug) => {
      const dir = 'content/' + slug;
      try {
        const res = await fetch(dir + '/_manifest.json');
        if (!res.ok) return null;
        return { slug, manifest: await res.json(), dir };
      } catch { return null; }
    });

    workshops = (await Promise.all(fetches)).filter(Boolean);
    workshops.sort((a, b) => (a.manifest.order ?? 999) - (b.manifest.order ?? 999));

    renderLanding();
    handleRoute();
  } catch (e) {
    console.error('init error:', e);
    document.getElementById('landing').innerHTML =
      '<p style="color:var(--danger);text-align:center;padding:4rem">無法載入 config.json</p>';
  }
}

/* ═══════════════════════════════════════════
   Landing — Card Grid
   ═══════════════════════════════════════════ */
function renderLanding() {
  const grid = document.getElementById('cardGrid');
  if (!workshops.length) {
    grid.innerHTML = '<p style="color:var(--text-dim);text-align:center;padding:2rem;grid-column:1/-1">尚未找到任何 Workshop。</p>';
    return;
  }
  grid.innerHTML = workshops.map(ws => {
    const m = ws.manifest;
    const pageCount = (m.pages || []).length;
    return `<a class="ws-card" href="#${ws.slug}" onclick="enterWorkshop('${ws.slug}');return false">
      <div class="ws-card-icon">${getIcon(m.icon) || m.icon || '📘'}</div>
      <div class="ws-card-body">
        <div class="ws-card-badges">
          ${m.badge ? `<span class="ws-badge ws-badge-info">${m.badge}</span>` : ''}
          ${m.level ? `<span class="ws-badge ws-badge-success">${m.level}</span>` : ''}
          ${m.duration ? `<span class="ws-badge ws-badge-default">${m.duration}</span>` : ''}
        </div>
        <span class="ws-card-title">${m.title || ws.slug}</span>
        <p class="ws-card-desc">${m.description || ''}</p>
        <div class="ws-card-meta">
          <span>${pageCount} 個章節</span>
          <span class="ws-card-arrow">${getIcon('aws-arrow-right')}</span>
        </div>
      </div>
    </a>`;
  }).join('');
}

/* ═══════════════════════════════════════════
   View Switching
   ═══════════════════════════════════════════ */
function showLanding() {
  document.getElementById('landing').removeAttribute('hidden');
  document.getElementById('main').setAttribute('hidden', '');
  document.getElementById('sidebar').classList.remove('visible');
  closeMobile();
  document.getElementById('breadcrumb').innerHTML = '';
  document.getElementById('progressText').textContent = '';
  document.getElementById('progressFill').style.width = '0';
  document.getElementById('prevBtn').style.display = 'none';
  document.getElementById('nextBtn').style.display = 'none';
  document.body.classList.remove('workshop-mode');
  document.title = config.title;
  updateThemeIcon();
}

function showReader() {
  document.getElementById('landing').setAttribute('hidden', '');
  document.getElementById('main').removeAttribute('hidden');
  document.getElementById('sidebar').classList.add('visible');
  document.getElementById('prevBtn').style.display = '';
  document.getElementById('nextBtn').style.display = '';
  document.body.classList.add('workshop-mode');
  updateThemeIcon();
}

function goHome() {
  currentWorkshop = null;
  chapters = [];
  window.location.hash = '';
  showLanding();
}

/* ═══════════════════════════════════════════
   Workshop Loader
   ═══════════════════════════════════════════ */
async function enterWorkshop(slug, chapterId) {
  if (currentWorkshop === slug && chapters.length) {
    const idx = chapterId ? chapters.findIndex(c => c.id === chapterId) : 0;
    if (idx >= 0) loadChapter(idx);
    return;
  }

  const ws = workshops.find(w => w.slug === slug);
  if (!ws) return;

  currentWorkshop = slug;
  chapters = [];
  const dir = ws.dir;
  const files = ws.manifest.pages || [];

  // 並行載入所有 md
  const results = await Promise.all(files.map(async f => {
    const path = dir + '/' + f;
    try {
      const res = await fetch(path);
      if (!res.ok) return null;
      const md = await res.text();
      const { frontMatter, body } = parseFrontMatter(md);
      const id = frontMatter.id || buildChapterId(path, dir);
      return {
        id,
        title: frontMatter.title || f.replace(/\/_index\.md$|\.md$/, ''),
        file: path,
        order: frontMatter.order ?? 999,
        depth: getDepth(path, dir),
        isIndex: f.endsWith('_index.md'),
        body
      };
    } catch { return null; }
  }));

  chapters = results.filter(Boolean);

  document.getElementById('sidebarLabel').textContent = ws.manifest.title || slug;
  buildSidebar();
  showReader();

  const idx = chapterId ? chapters.findIndex(c => c.id === chapterId) : -1;
  loadChapter(idx >= 0 ? idx : 0);
}

/* ═══════════════════════════════════════════
   Sidebar & Navigation
   ═══════════════════════════════════════════ */
function buildSidebar() {
  document.getElementById('sidebarNav').innerHTML = chapters.map((ch, i) => {
    const indent = ch.depth > 0 ? ` style="padding-left:${ch.depth * 1.2 + 0.75}rem"` : '';
    return `<li><a href="#${currentWorkshop}/${ch.id}" onclick="loadChapter(${i});closeMobile()"${indent}>${ch.title}</a></li>`;
  }).join('');
}

async function loadChapter(index) {
  if (index < 0 || index >= chapters.length) return;
  currentIndex = index;
  const ch = chapters[index];
  window.location.hash = currentWorkshop + '/' + ch.id;

  document.querySelectorAll('.sidebar-nav a').forEach((a, i) =>
    a.classList.toggle('active', i === index));

  const ws = workshops.find(w => w.slug === currentWorkshop);
  const wsTitle = ws ? (ws.manifest.title || currentWorkshop) : currentWorkshop;
  document.getElementById('breadcrumb').innerHTML =
    `<a href="#" onclick="goHome();return false" style="color:var(--text-dim);text-decoration:none">${config.title}</a>` +
    ` <span>/</span> <span>${wsTitle}</span>` +
    ` <span>/</span> <span class="current">${ch.title}</span>`;
  document.title = ch.title + ' — ' + wsTitle;

  const pct = ((index + 1) / chapters.length * 100).toFixed(0);
  document.getElementById('progressText').textContent = `${index + 1} / ${chapters.length}`;
  document.getElementById('progressFill').style.width = pct + '%';

  let md = ch.body;
  if (!md) {
    try {
      const raw = await fetch(ch.file).then(r => { if (!r.ok) throw 0; return r.text(); });
      md = parseFrontMatter(raw).body;
    } catch { return; }
  }
  renderMarkdown(md);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function navigatePrev() { loadChapter(currentIndex - 1); }
function navigateNext() { loadChapter(currentIndex + 1); }

/* ═══════════════════════════════════════════
   Markdown Renderer
   ═══════════════════════════════════════════ */
function renderMarkdown(md) {
  md = preprocessCustomSyntax(md);
  let html = marked.parse(md);

  // 還原 copyable HTML placeholder（在 marked 解析 table 等結構之後）
  const blocks = preprocessCustomSyntax._blocks;
  if (blocks) {
    html = html.replace(/\x00CB(\d+)\x00/g, (_, i) => blocks[i] || '');
  }

  const prev = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const next = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

  let navHtml = '<div class="page-nav">';
  navHtml += prev
    ? `<a class="page-nav-btn prev" href="#${currentWorkshop}/${prev.id}" onclick="loadChapter(${currentIndex - 1})"><span class="label">← 上一頁</span><span class="title">${prev.title}</span></a>`
    : '<div class="page-nav-btn disabled"></div>';
  navHtml += next
    ? `<a class="page-nav-btn next" href="#${currentWorkshop}/${next.id}" onclick="loadChapter(${currentIndex + 1})"><span class="label">下一頁 →</span><span class="title">${next.title}</span></a>`
    : '<div class="page-nav-btn disabled"></div>';
  navHtml += '</div>';

  document.getElementById('content').innerHTML = html;
  document.getElementById('pageNav').innerHTML = navHtml;
  buildTOC();
  observeTOC();
  const el = document.getElementById('content');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced) {
    el.style.animation = 'none';
    requestAnimationFrame(() => {
      el.style.animation = 'fadeIn .3s ease';
      el.addEventListener('animationend', () => { el.style.animation = ''; }, { once: true });
    });
  }
}

/* ═══════════════════════════════════════════
   Routing — hash-based: #workshop-slug/chapter-id
   ═══════════════════════════════════════════ */
function handleRoute() {
  const hash = window.location.hash.slice(1);
  if (!hash) { showLanding(); return; }

  const slashIdx = hash.indexOf('/');
  if (slashIdx === -1) {
    // Just a workshop slug — enter it
    enterWorkshop(hash);
  } else {
    const slug = hash.slice(0, slashIdx);
    const chapterId = hash.slice(slashIdx + 1);
    if (slug === currentWorkshop && chapters.length) {
      // Already loaded, just switch chapter
      const idx = chapters.findIndex(c => c.id === chapterId);
      if (idx >= 0 && idx !== currentIndex) loadChapter(idx);
    } else {
      enterWorkshop(slug, chapterId);
    }
  }
}

window.addEventListener('hashchange', handleRoute);

/* ═══════════════════════════════════════════
   UI Interactions
   ═══════════════════════════════════════════ */
function toggleExpand(header) {
  const isOpen = header.parentElement.classList.toggle('open');
  header.setAttribute('aria-expanded', isOpen);
}

function switchTab(id, index) {
  const c = document.getElementById(id);
  if (!c) return;
  c.querySelectorAll('.ws-tab-btn').forEach((b, i) => {
    const selected = i === index;
    b.setAttribute('aria-selected', selected);
    b.setAttribute('tabindex', selected ? '0' : '-1');
  });
  c.querySelectorAll('.ws-tab-panel').forEach((p, i) => {
    if (i === index) { p.removeAttribute('hidden'); }
    else { p.setAttribute('hidden', ''); }
  });
}

function handleTabKeydown(e, id) {
  const c = document.getElementById(id);
  if (!c) return;
  const tabs = Array.from(c.querySelectorAll('.ws-tab-btn'));
  const current = tabs.findIndex(t => t.getAttribute('aria-selected') === 'true');
  let next = -1;
  if (e.key === 'ArrowRight') next = (current + 1) % tabs.length;
  else if (e.key === 'ArrowLeft') next = (current - 1 + tabs.length) % tabs.length;
  else if (e.key === 'Home') next = 0;
  else if (e.key === 'End') next = tabs.length - 1;
  if (next >= 0) {
    e.preventDefault();
    switchTab(id, next);
    tabs[next].focus();
  }
}

function openLightbox(img) {
  const lb = document.createElement('div');
  lb.className = 'ws-lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-label', '圖片預覽');
  lb.setAttribute('aria-modal', 'true');
  const lbImg = document.createElement('img');
  lbImg.src = img.src;
  lbImg.alt = img.alt || '放大預覽';
  const closeBtn = document.createElement('button');
  closeBtn.className = 'ws-lightbox-close';
  closeBtn.setAttribute('aria-label', '關閉');
  closeBtn.textContent = '✕';
  closeBtn.addEventListener('click', () => closeLightbox(lb));
  lb.appendChild(lbImg);
  lb.appendChild(closeBtn);
  lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(lb); });
  document.addEventListener('keydown', lb._escHandler = function(e) {
    if (e.key === 'Escape') closeLightbox(lb);
  });
  // Inert background
  document.querySelectorAll('body > :not(.ws-lightbox)').forEach(el => el.setAttribute('inert', ''));
  document.body.appendChild(lb);
  closeBtn.focus();
}

function closeLightbox(lb) {
  document.querySelectorAll('[inert]').forEach(el => el.removeAttribute('inert'));
  if (lb._escHandler) document.removeEventListener('keydown', lb._escHandler);
  lb.remove();
}

function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
  return Promise.resolve();
}

function copyCode(btn) {
  copyToClipboard(btn.nextElementSibling.textContent);
  btn.innerHTML = getIcon('aws-success');
  btn.style.color = 'var(--success)';
  setTimeout(() => { btn.innerHTML = getIcon('aws-copy'); btn.style.color = ''; }, 1200);
}

function copyInline(el, text) {
  copyToClipboard(text);
  el.classList.add('copied');
  setTimeout(() => el.classList.remove('copied'), 1200);
}

// Copyable tooltip follows cursor
document.addEventListener('mousemove', (e) => {
  const el = e.target.closest('code.copyable');
  if (el) {
    el.style.setProperty('--tip-x', e.clientX + 'px');
    el.style.setProperty('--tip-y', e.clientY + 'px');
  }
});

// Mobile menu
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
menuToggle.addEventListener('click', () => {
  const isOpen = sidebar.classList.toggle('open');
  overlay.classList.toggle('active', isOpen);
  menuToggle.setAttribute('aria-expanded', isOpen);
});
overlay.addEventListener('click', closeMobile);
function closeMobile() {
  sidebar.classList.remove('open');
  overlay.classList.remove('active');
  menuToggle.setAttribute('aria-expanded', 'false');
}

// Keyboard nav (only in reader mode, skip when inside inputs)
document.addEventListener('keydown', (e) => {
  if (!currentWorkshop) return;
  const tag = e.target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.target.isContentEditable) return;
  if (e.key === 'ArrowLeft') navigatePrev();
  if (e.key === 'ArrowRight') navigateNext();
});

/* ═══════════════════════════════════════════
   Table of Contents (right side)
   ═══════════════════════════════════════════ */
function buildTOC() {
  const toc = document.getElementById('toc');
  const headings = document.querySelectorAll('#content h2, #content h3');
  if (headings.length < 2) { toc.innerHTML = ''; return; }

  // Ensure headings have IDs
  headings.forEach(h => {
    if (!h.id) h.id = h.textContent.trim().replace(/\s+/g, '-').replace(/[^\w\u4e00-\u9fff-]/g, '').toLowerCase();
  });

  let html = '<div class="toc-title">目錄</div>';
  headings.forEach(h => {
    const cls = h.tagName === 'H3' ? ' class="toc-h3"' : '';
    html += `<a href="#${h.id}"${cls} data-target="${h.id}">${h.textContent}</a>`;
  });
  toc.innerHTML = html;
}

let tocObserver = null;
function observeTOC() {
  if (tocObserver) tocObserver.disconnect();
  const headings = document.querySelectorAll('#content h2[id], #content h3[id]');
  if (!headings.length) return;

  tocObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.toc a').forEach(a => a.classList.remove('active'));
        const link = document.querySelector(`.toc a[data-target="${entry.target.id}"]`);
        if (link) link.classList.add('active');
      }
    });
  }, { rootMargin: '-80px 0px -60% 0px', threshold: 0 });

  headings.forEach(h => tocObserver.observe(h));
}

/* ═══════════════════════════════════════════
   Theme Toggle
   ═══════════════════════════════════════════ */
function toggleTheme() {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('ws-theme', next);
  updateThemeIcon();
  updateThemeColor(next);
}

function updateThemeColor(theme) {
  const meta = document.getElementById('metaThemeColor');
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#07090f' : '#f8f9fa');
}

function updateThemeIcon() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  btn.innerHTML = getIcon(document.documentElement.getAttribute('data-theme') === 'dark' ? 'moon' : 'sun');
}

/* ═══════════════════════════════════════════
   Boot
   ═══════════════════════════════════════════ */
init();
