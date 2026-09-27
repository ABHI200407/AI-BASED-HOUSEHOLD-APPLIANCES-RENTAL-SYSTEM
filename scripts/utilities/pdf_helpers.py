import os
import subprocess
import tempfile

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
if not os.path.exists(CHROME_PATH):
    CHROME_PATH = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

COMMON_CSS = """
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

@page {
  size: A4;
  margin: 18mm 16mm 18mm 16mm;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #1e293b;
  line-height: 1.6;
  font-size: 10pt;
  background: #ffffff;
}

.cover-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 92vh;
  page-break-after: always;
  padding: 20px 0;
}

.cover-badge {
  display: inline-block;
  background: #4f46e5;
  color: #ffffff;
  padding: 6px 14px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 9pt;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 24px;
}

.cover-title {
  font-size: 26pt;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.2;
  margin-bottom: 12px;
  letter-spacing: -0.02em;
}

.cover-subtitle {
  font-size: 14pt;
  font-weight: 500;
  color: #4f46e5;
  margin-bottom: 30px;
  line-height: 1.4;
}

.cover-meta {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-left: 5px solid #4f46e5;
  border-radius: 8px;
  padding: 16px 20px;
  margin-top: 30px;
}

.cover-meta table {
  margin: 0;
  border: none;
}

.cover-meta td {
  border: none;
  padding: 4px 8px;
  font-size: 9.5pt;
}

.cover-meta td.label {
  font-weight: 700;
  color: #475569;
  width: 140px;
}

.page-break {
  page-break-before: always;
}

h1 {
  font-size: 18pt;
  font-weight: 800;
  color: #0f172a;
  border-bottom: 2px solid #4f46e5;
  padding-bottom: 8px;
  margin-top: 32px;
  margin-bottom: 16px;
  page-break-after: avoid;
}

h2 {
  font-size: 14pt;
  font-weight: 700;
  color: #1e293b;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 6px;
  margin-top: 24px;
  margin-bottom: 12px;
  page-break-after: avoid;
}

h3 {
  font-size: 11.5pt;
  font-weight: 600;
  color: #4338ca;
  margin-top: 18px;
  margin-bottom: 8px;
  page-break-after: avoid;
}

p {
  margin: 8px 0;
  text-align: justify;
}

ul, ol {
  margin: 8px 0 12px 22px;
  padding: 0;
}

li {
  margin-bottom: 4px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 14px 0;
  font-size: 9pt;
  page-break-inside: avoid;
}

th, td {
  border: 1px solid #cbd5e1;
  padding: 7px 10px;
  text-align: left;
  vertical-align: top;
}

th {
  background-color: #f1f5f9;
  color: #0f172a;
  font-weight: 700;
}

tr:nth-child(even) {
  background-color: #f8fafc;
}

.callout {
  background: #f8fafc;
  border-left: 4px solid #4f46e5;
  padding: 12px 16px;
  border-radius: 0 8px 8px 0;
  margin: 14px 0;
  font-size: 9.5pt;
}

.callout.success {
  background: #f0fdf4;
  border-left-color: #16a34a;
  color: #14532d;
}

.callout.warning {
  background: #fffbeb;
  border-left-color: #f59e0b;
  color: #78350f;
}

.callout.info {
  background: #eff6ff;
  border-left-color: #3b82f6;
  color: #1e3a8a;
}

pre {
  background: #0f172a;
  color: #f8fafc;
  padding: 12px 16px;
  border-radius: 8px;
  font-family: 'JetBrains Mono', Consolas, monospace;
  font-size: 8.5pt;
  overflow-x: auto;
  page-break-inside: avoid;
  line-height: 1.45;
}

code {
  font-family: 'JetBrains Mono', Consolas, monospace;
  background: #f1f5f9;
  color: #4338ca;
  padding: 2px 5px;
  border-radius: 4px;
  font-size: 8.5pt;
}

.diagram-box {
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-left: 4px solid #6366f1;
  border-radius: 6px;
  padding: 12px 16px;
  margin: 14px 0;
  font-family: 'JetBrains Mono', Consolas, monospace;
  font-size: 8.5pt;
  white-space: pre;
  overflow-x: auto;
  page-break-inside: avoid;
  line-height: 1.4;
}

.badge {
  display: inline-block;
  padding: 2px 7px;
  border-radius: 12px;
  font-size: 8pt;
  font-weight: 600;
}
.badge-green { background: #dcfce7; color: #15803d; }
.badge-blue { background: #dbeafe; color: #1d4ed8; }
.badge-purple { background: #ede9fe; color: #6d28d9; }

.footer-note {
  margin-top: 40px;
  padding-top: 12px;
  border-top: 1px solid #e2e8f0;
  font-size: 8pt;
  color: #94a3b8;
  display: flex;
  justify-content: space-between;
}
"""

def generate_pdf_from_html(html_content: str, output_pdf_path: str):
    """
    Renders HTML string to a vector PDF using headless Chrome.
    """
    os.makedirs(os.path.dirname(os.path.abspath(output_pdf_path)), exist_ok=True)
    with tempfile.NamedTemporaryFile('w', suffix='.html', delete=False, encoding='utf-8') as f:
        temp_html = f.name
        full_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>RentAI Document</title>
<style>
{COMMON_CSS}
</style>
</head>
<body>
{html_content}
</body>
</html>"""
        f.write(full_html)

    try:
        cmd = [
            CHROME_PATH,
            '--headless',
            '--disable-gpu',
            '--run-all-compositor-stages-before-draw',
            '--no-pdf-header-footer',
            f'--print-to-pdf={os.path.abspath(output_pdf_path)}',
            os.path.abspath(temp_html)
        ]
        result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
        size_kb = round(os.path.getsize(output_pdf_path) / 1024, 1)
        print(f"  [OK] Generated: {os.path.basename(output_pdf_path)} ({size_kb} KB)")
        return True
    finally:
        if os.path.exists(temp_html):
            try:
                os.remove(temp_html)
            except Exception:
                pass
