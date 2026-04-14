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
  const codeBlocks = [];
  md = md.replace(/^([ \t]{0,3})(`{3,})([^\n]*)\n([\s\S]*?)^\1\2\s*$/gm, (match) => {
    codeBlocks.push(match);
    return `\x00CB${codeBlocks.length - 1}\x00`;
  });
  md = md.replace(/``([^`]+)``/g, (_, text) => {
    const escaped = text.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '&quot;');
    const html = `<code class="copyable" role="button" tabindex="0" onclick="copyInline(this,'${escaped}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();copyInline(this,'${escaped}')}">${text}</code>`;
    codeBlocks.push(html);
    return `\x00CB${codeBlocks.length - 1}\x00`;
  });
  md = md.replace(/`[^`\n]+`/g, (match) => {
    codeBlocks.push(match);
    return `\x00CB${codeBlocks.length - 1}\x00`;
  });

  md = md.replace(/:::button-row\n(.*?)\n:::/g, (_, inner) =>
    `<div class="ws-btn-row">${inner.trim()}</div>`);

  md = md.replace(/!\[([^\]]*)\]\(([^)]+)\)(?:\{([^}]+)\})?/g, (match, alt, urlPart, attrs) => {
    const urlMatch = urlPart.match(/^(\S+?)(?:\s+"([^"]*)")?$/);
    if (!urlMatch) return match;
    let [, href, title] = urlMatch;
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

  md = md.replace(/\x00CB(\d+)\x00/g, (_, i) => {
    const block = codeBlocks[i];
    if (block.startsWith('<')) return `\x00CB${i}\x00`;
    const lines = block.trimEnd().split('\n');
    const langMatch = lines[0].match(/^([ \t]{0,3})`{3,}(\S*)/);
    if (!langMatch) return block;
    const [, indent, lang] = langMatch;
    const codeLines = lines.slice(1, -1);
    const code = indent
      ? codeLines.map(l => l.startsWith(indent) ? l.slice(indent.length) : l).join('\n')
      : codeLines.join('\n');
    if (lang === 'mermaid') {
      return `\n\n<pre class="mermaid">${code}</pre>\n\n`;
    }
    const highlighted = simpleHighlight(code);
    const langClass = lang ? ` class="language-${lang}"` : '';
    return `\n\n<pre><button class="copy-btn" onclick="copyCode(this)" aria-label="複製">${getIcon('aws-copy')}</button><code${langClass}>${highlighted}</code></pre>\n\n`;
  });

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
let workshops = [];
let currentWorkshop = null;
let currentIndex = 0;
let chapters = [];
let currentUser = null;
let workshopCredentials = null;

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
  if (rel.endsWith('/_index.md')) rel = rel.replace(/\/[^/]+$/, '');
  return (rel.match(/\//g) || []).length;
}

function getUserPrefix() { return currentUser || ''; }

/* ═══════════════════════════════════════════
   Configure marked (once)
   ═══════════════════════════════════════════ */
marked.use({
  breaks: true,
  gfm: true,
  renderer: {
    code({ text, lang }) {
      if (lang === 'mermaid') return `<pre class="mermaid">${text}</pre>`;
      const highlighted = simpleHighlight(text);
      const langClass = lang ? ` class="language-${lang}"` : '';
      return `<pre><button class="copy-btn" onclick="copyCode(this)" aria-label="複製">${getIcon('aws-copy')}</button><code${langClass}>${highlighted}</code></pre>`;
    },
    image({ href, title, text }) {
      if (href && !href.startsWith('http') && !href.startsWith('/')) {
        const ch = chapters[currentIndex];
        if (ch && ch.file) href = ch.file.substring(0, ch.file.lastIndexOf('/')) + '/' + href;
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
          return `<a href="#${currentWorkshop}/${chapters[idx].id}" onclick="event.preventDefault();router.go('chapter',{index:${idx}})"${titleAttr}>${text}</a>`;
        }
        const ch = chapters[currentIndex];
        if (ch && ch.file) href = ch.file.substring(0, ch.file.lastIndexOf('/')) + '/' + href;
      }
      const titleAttr = title ? ` title="${title}"` : '';
      const external = href && href.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<a href="${href}"${titleAttr}${external}>${text}</a>`;
    }
  }
});

/* ═══════════════════════════════════════════
   Router — single source of truth for navigation
   
   Views: dashboard | join | login | reader
   Hash patterns:
     (empty)              → dashboard (instructor, password required)
     #join                → join (student, enter event code)
     #join/{eventCode}    → join (student, pre-filled event code)
     #login/{slug}        → login (student, enter username)
     #{slug}              → reader (first chapter)
     #{slug}/{chapterId}  → reader (specific chapter)
   ═══════════════════════════════════════════ */
const router = {
  _busy: false,

  _setHash(hash, replace) {
    router._silent = true;
    if (replace) {
      history.replaceState(null, '', hash ? '#' + hash : window.location.pathname);
    } else {
      window.location.hash = hash;
    }
    setTimeout(() => { router._silent = false; }, 0);
  },

  parseHash(hash) {
    if (!hash) return { view: 'join', eventCode: null };
    if (hash === 'join') return { view: 'join', eventCode: null };
    if (hash.startsWith('join/')) return { view: 'join', eventCode: hash.slice(5) };
    if (hash === 'admin') return { view: 'dashboard' };
    if (hash.startsWith('login/')) return { view: 'join', eventCode: null }; // legacy redirect
    const slash = hash.indexOf('/');
    if (slash === -1) return { view: 'reader', slug: hash, chapterId: null };
    return { view: 'reader', slug: hash.slice(0, slash), chapterId: hash.slice(slash + 1) };
  },

  async resolve() {
    if (router._silent || router._busy) return;
    const route = router.parseHash(window.location.hash.slice(1));
    switch (route.view) {
      case 'dashboard': router.showDashboard(); break;
      case 'join':      router.showJoin(route.eventCode); break;
      case 'reader':    await router.showWorkshop(route.slug, route.chapterId); break;
    }
  },

  // ─── Dashboard view (instructor) ───
  showDashboard() {
    currentWorkshop = null;
    chapters = [];
    currentUser = null;
    workshopCredentials = null;
    updateUserUI();

    const isAuthed = sessionStorage.getItem('ws-admin') === config?.adminPassword;
    if (!isAuthed) {
      router._setHash('', true);
      router.showJoin(null);
      return;
    }

    setView('home');
    renderLanding();
    document.getElementById('adminLogoutBtn').innerHTML = getIcon('aws-sign-out') + '登出';
    document.getElementById('adminLogoutBtn').removeAttribute('hidden');
    document.getElementById('breadcrumb').innerHTML = '';
    document.getElementById('progressText').textContent = '';
    document.getElementById('progressFill').style.width = '0';
    document.getElementById('prevBtn').style.display = 'none';
    document.getElementById('nextBtn').style.display = 'none';
    document.body.classList.remove('workshop-mode');
    document.title = config ? config.title + ' — Admin' : 'Workshop';
    closeMobile();
    updateThemeIcon();
  },

  // ─── Join view (student entry) ───
  showJoin(eventCode) {
    currentWorkshop = null;
    chapters = [];
    currentUser = null;
    workshopCredentials = null;
    _entrySlug = null;
    updateUserUI();
    document.getElementById('adminLogoutBtn').setAttribute('hidden', '');
    setView('join');
    // Reset entry form to step 1
    document.getElementById('entryStep1').querySelector('input').disabled = false;
    document.getElementById('entryStep1').querySelector('button').disabled = false;
    document.getElementById('entryStep2').classList.add('entry-step-hidden');
    document.getElementById('joinCode').value = eventCode || '';
    document.getElementById('joinError').textContent = '';
    document.getElementById('breadcrumb').innerHTML = '';
    document.getElementById('progressText').textContent = '';
    document.getElementById('progressFill').style.width = '0';
    document.getElementById('prevBtn').style.display = 'none';
    document.getElementById('nextBtn').style.display = 'none';
    document.body.classList.remove('workshop-mode');
    document.title = '加入 — ' + (config ? config.title : 'Workshop');
    closeMobile();
    updateThemeIcon();
    if (eventCode) {
      // Auto-submit if event code is in URL
      resolveEventCode(eventCode);
    } else {
      document.getElementById('joinCode').focus();
    }
  },

  // ─── Workshop/reader view ───
  async showWorkshop(slug, chapterId) {
    const ws = workshops.find(w => w.slug === slug);
    if (!ws) { router._setHash('', true); router.showJoin(null); return; }

    // Auth check — must be admin or authenticated user for this workshop
    const isAdmin = sessionStorage.getItem('ws-admin') === config?.adminPassword;
    if (!isAdmin) {
      const authed = await checkWorkshopAuth(slug, ws.dir);
      if (!authed) {
        router._setHash('', true);
        router.showJoin(null);
        return;
      }
    }

    // Already loaded — just switch chapter
    if (currentWorkshop === slug && chapters.length) {
      const idx = chapterId ? chapters.findIndex(c => c.id === chapterId) : 0;
      if (idx >= 0) displayChapter(idx);
      setView('reader');
      return;
    }

    // Load workshop
    router._busy = true;
    currentWorkshop = slug;
    chapters = [];
    const files = ws.manifest.pages || [];

    const results = await Promise.all(files.map(async f => {
      const path = ws.dir + '/' + f;
      try {
        const res = await fetch(path);
        if (!res.ok) return null;
        const md = await res.text();
        const { frontMatter, body } = parseFrontMatter(md);
        const id = frontMatter.id || buildChapterId(path, ws.dir);
        return { id, title: frontMatter.title || f.replace(/\/_index\.md$|\.md$/, ''), file: path, order: frontMatter.order ?? 999, depth: getDepth(path, ws.dir), isIndex: f.endsWith('_index.md'), body };
      } catch { return null; }
    }));

    chapters = results.filter(Boolean);
    router._busy = false;

    document.getElementById('sidebarLabel').textContent = ws.manifest.title || slug;
    buildSidebar();
    document.getElementById('adminLogoutBtn').setAttribute('hidden', '');
    setView('reader');

    const idx = chapterId ? chapters.findIndex(c => c.id === chapterId) : 0;
    displayChapter(idx >= 0 ? idx : 0);
  },

  // ─── Navigate (push history) ───
  go(action, params) {
    switch (action) {
      case 'home':
        router._setHash('admin', false);
        router.showDashboard();
        break;
      case 'join':
        router._setHash('', false);
        router.showJoin(null);
        break;
      case 'workshop':
        router._setHash(params.slug, false);
        router.showWorkshop(params.slug, null);
        break;
      case 'chapter':
        if (params.index >= 0 && params.index < chapters.length) {
          const ch = chapters[params.index];
          router._setHash(currentWorkshop + '/' + ch.id, false);
          displayChapter(params.index);
        }
        break;
    }
  }
};

// ─── View switcher (mutually exclusive) ───
function setView(name) {
  document.getElementById('landing')[name === 'home' ? 'removeAttribute' : 'setAttribute']('hidden', '');
  document.getElementById('main')[name === 'reader' ? 'removeAttribute' : 'setAttribute']('hidden', '');
  document.getElementById('joinScreen')[name === 'join' ? 'removeAttribute' : 'setAttribute']('hidden', '');
  document.getElementById('sidebar').classList[name === 'reader' ? 'add' : 'remove']('visible');
  if (name === 'reader') {
    document.getElementById('prevBtn').style.display = '';
    document.getElementById('nextBtn').style.display = '';
    document.body.classList.add('workshop-mode');
  } else {
    document.body.classList.remove('workshop-mode');
  }
  updateThemeIcon();
}

window.addEventListener('hashchange', () => router.resolve());

/* ═══════════════════════════════════════════
   Auth
   ═══════════════════════════════════════════ */
async function loadWorkshopCredentials(workshopDir) {
  try {
    const res = await fetch(workshopDir + '/credentials.json');
    if (res.ok) return await res.json();
  } catch {}
  return null;
}

function getStoredUser(slug) {
  try { return JSON.parse(localStorage.getItem('ws-user-' + slug)); } catch { return null; }
}

function setStoredUser(slug, session) {
  localStorage.setItem('ws-user-' + slug, JSON.stringify(session));
}

function clearStoredUser(slug) {
  localStorage.removeItem('ws-user-' + slug);
}

function updateUserUI() {
  const badge = document.getElementById('headerUser');
  const footer = document.getElementById('sidebarFooter');
  const logoutBtn = document.getElementById('logoutBtn');
  if (currentUser) {
    badge.textContent = currentUser;
    logoutBtn.innerHTML = getIcon('aws-sign-out') + '登出';
    footer.removeAttribute('hidden');
  } else {
    footer.setAttribute('hidden', '');
  }
}

async function checkWorkshopAuth(slug, workshopDir) {
  const creds = await loadWorkshopCredentials(workshopDir);
  workshopCredentials = creds;
  if (!creds || !creds.eventCode || !creds.users || !creds.users.length) {
    currentUser = null;
    updateUserUI();
    return true;
  }
  const session = getStoredUser(slug);
  if (session && session.eventCode === creds.eventCode && creds.users.includes(session.username)) {
    currentUser = session.username;
    updateUserUI();
    return true;
  }
  currentUser = null;
  clearStoredUser(slug);
  updateUserUI();
  return false;
}

function handleLogout() {
  if (currentWorkshop) clearStoredUser(currentWorkshop);
  currentUser = null;
  workshopCredentials = null;
  updateUserUI();
  router.go('join');
}

/* ═══════════════════════════════════════════
   Join (Event Code → find workshop)
   ═══════════════════════════════════════════ */
let _entrySlug = null;

function handleUnifiedEntry(e) {
  e.preventDefault();
  const code = document.getElementById('joinCode').value.trim();
  if (!code) return;
  resolveEventCode(code);
}

async function resolveEventCode(code) {
  const errorEl = document.getElementById('joinError');
  errorEl.textContent = '';

  // Check if it's the admin password
  if (config && config.adminPassword && code === config.adminPassword) {
    sessionStorage.setItem('ws-admin', code);
    router._setHash('admin', false);
    router.showDashboard();
    return;
  }

  for (const ws of workshops) {
    const creds = await loadWorkshopCredentials(ws.dir);
    if (creds && creds.eventCode === code) {
      workshopCredentials = creds;
      _entrySlug = ws.slug;
      // Reveal step 2
      document.getElementById('entryStep1').querySelector('input').disabled = true;
      document.getElementById('entryStep1').querySelector('button').disabled = true;
      document.getElementById('entryWorkshopName').textContent = ws.manifest.title || ws.slug;
      document.getElementById('entryStep2').classList.remove('entry-step-hidden');
      document.getElementById('loginUser').value = '';
      document.getElementById('loginError').textContent = '';
      document.getElementById('loginUser').focus();
      return;
    }
  }
  errorEl.textContent = '無效的代碼';
}

function handleUnifiedLogin(e) {
  e.preventDefault();
  const username = document.getElementById('loginUser').value.trim().toLowerCase();
  const errorEl = document.getElementById('loginError');

  if (!workshopCredentials || !_entrySlug) {
    errorEl.textContent = '系統錯誤';
    return;
  }
  if (!workshopCredentials.users.includes(username)) {
    errorEl.textContent = '此 Username 不在本次活動名單中';
    document.getElementById('loginUser').focus();
    return;
  }

  currentUser = username;
  setStoredUser(_entrySlug, { username, eventCode: workshopCredentials.eventCode });
  updateUserUI();
  router._setHash(_entrySlug, false);
  router.showWorkshop(_entrySlug, null);
}

function entryReset() {
  _entrySlug = null;
  workshopCredentials = null;
  document.getElementById('entryStep1').querySelector('input').disabled = false;
  document.getElementById('entryStep1').querySelector('button').disabled = false;
  document.getElementById('entryStep2').classList.add('entry-step-hidden');
  document.getElementById('joinCode').value = '';
  document.getElementById('joinError').textContent = '';
  document.getElementById('joinCode').focus();
}

/* ═══════════════════════════════════════════
   Dashboard (Admin)
   ═══════════════════════════════════════════ */
function handleAdminLogout() {
  sessionStorage.removeItem('ws-admin');
  router._setHash('', false);
  router.showJoin(null);
}

/* ═══════════════════════════════════════════
   Workshop Content — sidebar, chapters, markdown
   ═══════════════════════════════════════════ */
function buildSidebar() {
  document.getElementById('sidebarNav').innerHTML = chapters.map((ch, i) => {
    const indent = ch.depth > 0 ? ` style="padding-left:${ch.depth * 1.2 + 0.75}rem"` : '';
    return `<li><a href="#${currentWorkshop}/${ch.id}" onclick="event.preventDefault();router.go('chapter',{index:${i}});closeMobile()"${indent}>${ch.title}</a></li>`;
  }).join('');
}

async function displayChapter(index) {
  if (index < 0 || index >= chapters.length) return;
  currentIndex = index;
  const ch = chapters[index];

  // Update hash silently (no history push — caller decides push vs replace)
  router._setHash(currentWorkshop + '/' + ch.id, true);

  document.querySelectorAll('.sidebar-nav a').forEach((a, i) =>
    a.classList.toggle('active', i === index));

  const ws = workshops.find(w => w.slug === currentWorkshop);
  const wsTitle = ws ? (ws.manifest.title || currentWorkshop) : currentWorkshop;
  document.getElementById('breadcrumb').innerHTML =
    `<a href="#" onclick="event.preventDefault();router.go('home')" style="color:var(--text-dim);text-decoration:none">${config.title}</a>` +
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

function navigatePrev() { if (currentIndex > 0) router.go('chapter', { index: currentIndex - 1 }); }
function navigateNext() { if (currentIndex < chapters.length - 1) router.go('chapter', { index: currentIndex + 1 }); }

function goHome() {
  const isAdmin = sessionStorage.getItem('ws-admin') === config?.adminPassword;
  if (isAdmin) {
    router._setHash('admin', false);
    router.showDashboard();
  } else {
    router.go('join');
  }
}

/* ═══════════════════════════════════════════
   Markdown Renderer
   ═══════════════════════════════════════════ */
function renderMarkdown(md) {
  md = preprocessCustomSyntax(md);
  let html = marked.parse(md);

  const blocks = preprocessCustomSyntax._blocks;
  if (blocks) html = html.replace(/\x00CB(\d+)\x00/g, (_, i) => blocks[i] || '');

  const prefix = getUserPrefix();
  if (prefix) html = html.replace(/\{\{USERNAME\}\}/g, prefix);

  const prev = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const next = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

  let navHtml = '<div class="page-nav">';
  navHtml += prev
    ? `<a class="page-nav-btn prev" href="#${currentWorkshop}/${prev.id}" onclick="event.preventDefault();router.go('chapter',{index:${currentIndex - 1}})"><span class="label">← 上一頁</span><span class="title">${prev.title}</span></a>`
    : '<div class="page-nav-btn disabled"></div>';
  navHtml += next
    ? `<a class="page-nav-btn next" href="#${currentWorkshop}/${next.id}" onclick="event.preventDefault();router.go('chapter',{index:${currentIndex + 1}})"><span class="label">下一頁 →</span><span class="title">${next.title}</span></a>`
    : '<div class="page-nav-btn disabled"></div>';
  navHtml += '</div>';

  document.getElementById('content').innerHTML = html;
  document.getElementById('pageNav').innerHTML = navHtml;
  buildTOC();
  observeTOC();
  renderMermaid();
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
    b.setAttribute('aria-selected', i === index);
    b.setAttribute('tabindex', i === index ? '0' : '-1');
  });
  c.querySelectorAll('.ws-tab-panel').forEach((p, i) => {
    if (i === index) p.removeAttribute('hidden'); else p.setAttribute('hidden', '');
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
  if (next >= 0) { e.preventDefault(); switchTab(id, next); tabs[next].focus(); }
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
  if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
  const ta = document.createElement('textarea');
  ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta); ta.select(); document.execCommand('copy');
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

document.addEventListener('mousemove', (e) => {
  const el = e.target.closest('code.copyable');
  if (el) { el.style.setProperty('--tip-x', e.clientX + 'px'); el.style.setProperty('--tip-y', e.clientY + 'px'); }
});

// Mobile menu
const menuToggle = document.getElementById('menuToggle');
const sidebarEl = document.getElementById('sidebar');
const overlayEl = document.getElementById('overlay');
menuToggle.addEventListener('click', () => {
  const isOpen = sidebarEl.classList.toggle('open');
  overlayEl.classList.toggle('active', isOpen);
  menuToggle.setAttribute('aria-expanded', isOpen);
});
overlayEl.addEventListener('click', closeMobile);
function closeMobile() {
  sidebarEl.classList.remove('open');
  overlayEl.classList.remove('active');
  menuToggle.setAttribute('aria-expanded', 'false');
}

// Keyboard nav
document.addEventListener('keydown', (e) => {
  if (!currentWorkshop) return;
  const tag = e.target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.target.isContentEditable) return;
  if (e.key === 'ArrowLeft') navigatePrev();
  if (e.key === 'ArrowRight') navigateNext();
});

/* ═══════════════════════════════════════════
   Table of Contents
   ═══════════════════════════════════════════ */
function buildTOC() {
  const toc = document.getElementById('toc');
  const headings = document.querySelectorAll('#content h2, #content h3');
  if (headings.length < 2) { toc.innerHTML = ''; return; }
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
  mermaidReady = false;
  renderMermaid();
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
   Mermaid
   ═══════════════════════════════════════════ */
let mermaidReady = false;
function initMermaid() {
  if (mermaidReady || typeof mermaid === 'undefined') return;
  mermaid.initialize({
    startOnLoad: false,
    theme: document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'default',
    fontFamily: "'Amazon Ember', system-ui, sans-serif",
    securityLevel: 'loose'
  });
  mermaidReady = true;
}

async function renderMermaid() {
  const els = document.querySelectorAll('#content pre.mermaid');
  if (!els.length) return;
  els.forEach(el => { if (!el.dataset.source) el.dataset.source = el.textContent; });
  mermaidReady = false;
  initMermaid();
  els.forEach(el => { el.removeAttribute('data-processed'); el.innerHTML = el.dataset.source; });
  try { await mermaid.run({ nodes: els }); } catch (e) { console.warn('Mermaid render error:', e); }
}

/* ═══════════════════════════════════════════
   Init & Landing
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
    return `<a class="ws-card" href="#${ws.slug}" onclick="event.preventDefault();router.go('workshop',{slug:'${ws.slug}'})">
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

async function init() {
  try {
    config = await fetch('config.json').then(r => r.json());
    document.getElementById('headerTitle').textContent = config.title;
    document.title = config.title;

    const logoEl = document.getElementById('headerLogo');
    const joinLogoEl = document.getElementById('joinLogo');
    if (config.logo && /\.(png|svg|jpg|webp)$/.test(config.logo)) {
      logoEl.innerHTML = `<img src="${config.logo}" alt="logo" width="36" height="36">`;
      joinLogoEl.innerHTML = `<img src="${config.logo}" alt="logo">`;
    } else {
      const logoText = config.logo || '☁';
      logoEl.textContent = logoText;
      joinLogoEl.textContent = logoText;
    }
    document.getElementById('entryTitle').textContent = config.title;
    document.getElementById('entrySubtitle').textContent = config.subtitle || '';
    document.getElementById('entryFooter').innerHTML = config.footer || '';
    document.getElementById('landingTitle').textContent = config.title;
    document.getElementById('landingSubtitle').textContent = config.subtitle || '';
    document.getElementById('landingFooter').innerHTML = `<p>${config.footer || ''}</p>`;
    document.getElementById('footer').innerHTML = `<p>${config.footer || ''}</p>`;

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
    router.resolve();
  } catch (e) {
    console.error('init error:', e);
    document.getElementById('landing').innerHTML =
      '<p style="color:var(--danger);text-align:center;padding:4rem">無法載入 config.json</p>';
  }
}

init();
