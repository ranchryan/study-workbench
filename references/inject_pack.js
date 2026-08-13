#!/usr/bin/env node
// 内容包注入脚本：把一份新的 content-pack JSON 注入引擎模板，产出定制学习台 HTML。
// 用法：node inject_pack.js <引擎模板.html> <内容包.json> <输出.html>
// 仅替换引擎顶部 `const CONTENT_PACK = {...};` 到 `const SUBJECTS = CONTENT_PACK.subjects;` 这段，
// 其后四行重导出（SUBJECTS/ACC/START_DEFAULT/SUBJ_IMG）保持不变。
const fs = require('fs');

const enginePath = process.argv[2];
const packPath = process.argv[3];
const outPath = process.argv[4] || '学习台.html';

if (!enginePath || !packPath) {
  console.error('用法：node inject_pack.js <引擎模板.html> <内容包.json> <输出.html>');
  process.exit(1);
}

let html = fs.readFileSync(enginePath, 'utf8');
const packJson = fs.readFileSync(packPath, 'utf8').trim();
// 校验内容包是合法 JSON
JSON.parse(packJson);

// 匹配从 `const CONTENT_PACK =` 到 `const SUBJECTS = CONTENT_PACK.subjects;` 的整段
const re = /const CONTENT_PACK = [\s\S]*?;\s*\nconst SUBJECTS = CONTENT_PACK\.subjects;/;
if (!re.test(html)) {
  console.error('未在引擎中找到 CONTENT_PACK 段，确认引擎模板未被改动。');
  process.exit(1);
}
const injected = `const CONTENT_PACK = ${packJson};\nconst SUBJECTS = CONTENT_PACK.subjects;`;
const out = html.replace(re, injected);

fs.writeFileSync(outPath, out, 'utf8');
console.log(`注入成功：${packPath} -> ${outPath} (${fs.statSync(outPath).size} bytes)`);
console.log('记得：校验 node verify_static.js <输出.html> 应 17/17，并保留同目录 assets/。');
