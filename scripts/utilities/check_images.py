import os
import re

base = r'C:\Users\coding\Desktop\PROJECT\SDC2'
src_dir = r'C:\Users\coding\Desktop\PROJECT\SDC2\frontend\src'

missing_map = {}
for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith(('.jsx', '.js', '.tsx', '.ts')):
            fp = os.path.join(root, file)
            try:
                with open(fp, 'r', encoding='utf-8', errors='ignore') as f:
                    c = f.read()
                found = re.findall(r'[\'\"](/downloaded_images/[^\'\"]+)[\'\"]', c)
                for p in found:
                    full = os.path.normpath(os.path.join(base, p.lstrip('/')))
                    if not os.path.exists(full):
                        if p not in missing_map:
                            missing_map[p] = []
                        missing_map[p].append(file)
            except Exception as e:
                print('Error reading', file, e)

print(f'Total unique missing paths: {len(missing_map)}')
for p, flist in missing_map.items():
    print(f'MISSING: {p} in {flist}')
