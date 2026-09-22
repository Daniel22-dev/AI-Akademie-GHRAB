import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const out = path.join(root, 'dist-pages');
const runtimeFiles = ['index.html','console.html','404.html','manifest.webmanifest','sw.js'];
const runtimeDirs = ['assets','courses','exports'];
fs.rmSync(out,{recursive:true,force:true});
fs.mkdirSync(out,{recursive:true});
for (const file of runtimeFiles) fs.copyFileSync(path.join(root,file),path.join(out,file));
for (const dir of runtimeDirs) fs.cpSync(path.join(root,dir),path.join(out,dir),{recursive:true});
fs.writeFileSync(path.join(out,'.nojekyll'),'');
const epoch = Number(process.env.SOURCE_DATE_EPOCH || 0);
if (Number.isFinite(epoch) && epoch > 0) {
  const d = new Date(epoch * 1000);
  const walk = dir => {
    for (const entry of fs.readdirSync(dir,{withFileTypes:true})) {
      const full=path.join(dir,entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile()) fs.utimesSync(full,d,d);
    }
  };
  walk(out);
}
const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
console.log(`${pkg.name} ${pkg.version}: dist-pages/ runtime-only build hotov.`);
