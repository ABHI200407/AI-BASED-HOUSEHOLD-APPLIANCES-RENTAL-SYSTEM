import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const BASE_URL = 'https://threeui.com';
const JSON_URL = `${BASE_URL}/source-code/kage-landing-page.json`;
const OUT_DIR = path.join(process.cwd(), 'src/threeui');

async function download() {
  console.log('Fetching JSON from', JSON_URL);
  const res = await fetch(JSON_URL);
  if (!res.ok) {
    console.error('Failed to fetch JSON:', res.statusText);
    process.exit(1);
  }
  const data = await res.json();
  
  for (const file of data.files) {
    const filePath = path.join(OUT_DIR, file.path);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    
    if (file.code !== undefined) {
      fs.writeFileSync(filePath, file.code);
      console.log('Wrote text file:', file.path);
    } else {
      console.log('Fetching binary file:', file.path);
      // Try to fetch from https://threeui.com/path
      // The file.path is like "public/landing-pages/...". 
      // It's likely hosted at https://threeui.com/landing-pages/...
      const urlPath = file.path.replace(/^public\//, '');
      const assetUrl = `${BASE_URL}/${urlPath}`;
      
      const assetRes = await fetch(assetUrl);
      if (!assetRes.ok) {
        console.error('Failed to fetch asset:', assetUrl);
        continue;
      }
      const buffer = Buffer.from(await assetRes.arrayBuffer());
      
      const hash = crypto.createHash('sha256').update(buffer).digest('hex');
      if (hash !== file.sha256) {
        console.error(`Hash mismatch for ${file.path}: expected ${file.sha256}, got ${hash}`);
      } else {
        fs.writeFileSync(filePath, buffer);
        console.log('Wrote binary file:', file.path);
      }
    }
  }
}

download().catch(console.error);
