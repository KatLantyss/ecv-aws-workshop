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
  'aws-copy':     '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M15 5H5v10h10V5Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" fill="none"/><path d="M13 1H1v11" stroke="currentColor" stroke-width="2" stroke-linejoin="round" fill="none"/></svg>',
  'aws-arrow-right': '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
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
      return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
    }
  }
  return '';
}

/* ═══════════════════════════════════════════
   Markdown Custom Syntax Preprocessor
   ═══════════════════════════════════════════ */
const CARET_SVG = '<span class="ws-caret"><svg viewBox="2 3 12 10" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true"><path d="m8 11 4-6H4l4 6Z"></path></svg></span>';

function preprocessCustomSyntax(md) {
  // 保護 code block（含巢狀 backtick），避免裡面的自訂語法被轉換
  const codeBlocks = [];
  md = md.replace(/^(`{3,})([^\n]*)\n([\s\S]*?)^\1\s*$/gm, (match) => {
    codeBlocks.push(match);
    return `\x00CB${codeBlocks.length - 1}\x00`;
  });
  // ``text`` → 可複製的行內 code（在單 backtick 保護之前處理）
  md = md.replace(/``([^`]+)``/g, (_, text) => {
    const escaped = text.replace(/'/g, "\\'").replace(/"/g, '&quot;');
    return `<code class="copyable" onclick="copyInline(this,'${escaped}')">${text}</code>`;
  });
  // 保護行內 code
  md = md.replace(/`[^`\n]+`/g, (match) => {
    codeBlocks.push(match);
    return `\x00CB${codeBlocks.length - 1}\x00`;
  });

  md = md.replace(/:::button-row\n(.*?)\n:::/g, (_, inner) =>
    `<div class="ws-btn-row">${inner.trim()}</div>`);

  md = md.replace(/::button\[([^\]]*)\]\{([^}]*)\}/g, (_, text, attrs) => {
    const variant = (attrs.match(/variant="([^"]+)"/) || [])[1] || 'primary';
    const prefix  = (attrs.match(/prefix="([^"]+)"/)  || [])[1] || '';
    const postfix = (attrs.match(/postfix="([^"]+)"/) || [])[1] || '';
    const split   = (attrs.match(/split="([^"]+)"/)   || [])[1] || '';
    const dropdown = attrs.includes('dropdown');
    if (!text.trim() && prefix) return `<div class="ws-btn-icon">${getIcon(prefix)}</div>`;
    const pre  = prefix  ? `${getIcon(prefix)} `   : '';
    const post = postfix ? ` ${getIcon(postfix)}`   : '';
    const caret = dropdown ? ` ${CARET_SVG}` : '';
    if (split) {
      return `<span class="ws-btn-split"><div class="ws-btn ws-btn-${variant}">${pre}${text}${post}${caret}</div><span class="ws-btn-divider"></span><div class="ws-btn ws-btn-${variant}">${getIcon(split)}</div></span>`;
    }
    return `<div class="ws-btn ws-btn-${variant}">${pre}${text}${post}${caret}</div>`;
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
    return `<div class="ws-video"><iframe src="${url}" allowfullscreen loading="lazy"></iframe></div>`;
  });

  const alertIconMap = { info: 'aws-info', warning: 'aws-warning', success: 'aws-success', danger: 'aws-error' };
  md = md.replace(/:::alert\{type="(\w+)"\}\n([\s\S]*?):::/g, (_, type, body) =>
    `<div class="ws-alert ws-alert-${type}"><span class="ws-alert-icon">${getIcon(alertIconMap[type] || '')}</span><div class="ws-alert-body">\n\n${body.trim()}\n\n</div></div>`);

  md = md.replace(/:::expand\{title="([^"]+)"\}\n([\s\S]*?):::/g, (_, title, body) =>
    `<div class="ws-expand"><div class="ws-expand-header" onclick="toggleExpand(this)"><span class="ws-expand-arrow">${getIcon('aws-expand')}</span>${title}</div><div class="ws-expand-body">\n\n${body.trim()}\n\n</div></div>`);

  md = md.replace(/:::steps\n([\s\S]*?):::/g, (_, body) => {
    const html = body.trim().split('\n').filter(l => l.trim()).map(line =>
      `<div class="ws-step"><div class="ws-step-num"></div><div class="ws-step-body">\n\n${line.replace(/^\d+\.\s*/, '')}\n\n</div></div>`
    ).join('');
    return `<div class="ws-steps">${html}</div>`;
  });

  md = md.replace(/:::tabs\n([\s\S]*?):::/g, (_, body) => {
    const parts = body.split(/::tab\[([^\]]+)\]\n/).filter(s => s.trim());
    const tabs = [];
    for (let i = 0; i < parts.length; i += 2)
      tabs.push({ title: parts[i], content: (parts[i + 1] || '').trim() });
    const id = 'tabs-' + Math.random().toString(36).slice(2, 8);
    const hdr = tabs.map((t, i) =>
      `<button class="ws-tab-btn${i === 0 ? ' active' : ''}" onclick="switchTab('${id}',${i})">${t.title}</button>`).join('');
    const pnl = tabs.map((t, i) =>
      `<div class="ws-tab-panel${i === 0 ? ' active' : ''}">\n\n${t.content}\n\n</div>`).join('');
    return `<div class="ws-tabs" id="${id}"><div class="ws-tabs-header">${hdr}</div>${pnl}</div>`;
  });

  // 還原 code block
  md = md.replace(/\x00CB(\d+)\x00/g, (_, i) => codeBlocks[i]);

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
  const re = /(\/\/[^\n]*|#[^\n]*|"[^"]*"|'[^']*'|\b\d+\b|\b[a-zA-Z_]\w*\b|[^\s]|\s+)/g;
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
      const titleAttr = title ? ` title="${title}"` : '';
      return `<img src="${href}" alt="${text || ''}"${titleAttr}>`;
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
      logoEl.innerHTML = `<img src="${config.logo}" alt="logo">`;
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
        <h2 class="ws-card-title">${m.title || ws.slug}</h2>
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
  document.getElementById('landing').style.display = '';
  document.getElementById('main').style.display = 'none';
  document.getElementById('sidebar').classList.remove('visible');
  document.getElementById('breadcrumb').innerHTML = '';
  document.getElementById('prevBtn').style.display = 'none';
  document.getElementById('nextBtn').style.display = 'none';
  document.body.classList.remove('workshop-mode');
  document.title = config.title;
  updateThemeIcon();
}

function showReader() {
  document.getElementById('landing').style.display = 'none';
  document.getElementById('main').style.display = '';
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
  chapters.sort((a, b) => a.order - b.order);

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
    const num = String(i + 1).padStart(2, '0');
    const indent = ch.depth > 0 ? ` style="padding-left:${ch.depth * 1.2 + 0.75}rem"` : '';
    return `<li><a href="#${currentWorkshop}/${ch.id}" onclick="loadChapter(${i});closeMobile()"${indent}>
      <span class="nav-num">${num}</span>${ch.title}</a></li>`;
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
  const el = document.getElementById('content');
  el.style.animation = 'none';
  requestAnimationFrame(() => {
    el.style.animation = 'fadeIn .3s ease';
    el.addEventListener('animationend', () => { el.style.animation = ''; }, { once: true });
  });
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
function toggleExpand(header) { header.parentElement.classList.toggle('open'); }

function switchTab(id, index) {
  const c = document.getElementById(id);
  if (!c) return;
  c.querySelectorAll('.ws-tab-btn').forEach((b, i) => b.classList.toggle('active', i === index));
  c.querySelectorAll('.ws-tab-panel').forEach((p, i) => p.classList.toggle('active', i === index));
}

function copyCode(btn) {
  navigator.clipboard.writeText(btn.nextElementSibling.textContent);
  btn.innerHTML = getIcon('aws-success');
  btn.style.color = 'var(--success)';
  setTimeout(() => { btn.innerHTML = getIcon('aws-copy'); btn.style.color = ''; }, 1200);
}

function copyInline(el, text) {
  navigator.clipboard.writeText(text);
  el.classList.add('copied');
  setTimeout(() => el.classList.remove('copied'), 1200);
}

// Mobile menu
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
menuToggle.addEventListener('click', () => { sidebar.classList.toggle('open'); overlay.classList.toggle('active'); });
overlay.addEventListener('click', closeMobile);
function closeMobile() { sidebar.classList.remove('open'); overlay.classList.remove('active'); }

// Keyboard nav (only in reader mode)
document.addEventListener('keydown', (e) => {
  if (!currentWorkshop) return;
  if (e.key === 'ArrowLeft') navigatePrev();
  if (e.key === 'ArrowRight') navigateNext();
});

/* ═══════════════════════════════════════════
   Theme Toggle
   ═══════════════════════════════════════════ */
function toggleTheme() {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('ws-theme', next);
  updateThemeIcon();
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
