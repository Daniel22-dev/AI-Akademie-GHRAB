function academyRoot(pathname = location.pathname, hostname = location.hostname) {
  const path = String(pathname || '/');
  if (String(hostname || '').endsWith('.github.io')) {
    const first = path.split('/').filter(Boolean)[0];
    return first ? `/${first}/` : '/';
  }
  for (const marker of ['/apps/ai-akademie/', '/ai-akademie/']) {
    const at = path.indexOf(marker);
    if (at >= 0) return path.slice(0, at) + marker;
  }
  return '/';
}

const target = academyRoot();
const link = document.querySelector('#academy-home');
if (link) link.href = target;
if (location.pathname !== target) location.replace(target);

export { academyRoot };
