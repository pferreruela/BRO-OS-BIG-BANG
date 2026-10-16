"""Bundle local HTML, CSS and JS into a single offline game (stdlib only)."""
from pathlib import Path

root = Path(__file__).resolve().parents[1]
src = root / 'src'
required = ('index.html', 'styles.css', 'app.js')
for name in required:
    if not (src / name).is_file():
        raise SystemExit(f'Missing source file: {src / name}')
html = (src / 'index.html').read_text(encoding='utf-8')
css = (src / 'styles.css').read_text(encoding='utf-8')
js = (src / 'app.js').read_text(encoding='utf-8')
html = html.replace('<link rel="stylesheet" href="styles.css">', '<style>' + css + '</style>')
html = html.replace('<script src="app.js"></script>', '<script>' + js + '</script>')
output = root / 'BRO-OS-BIG-BANG.html'
output.write_text(html, encoding='utf-8')
print(f'Built {output.name}: {output.stat().st_size:,} bytes')
