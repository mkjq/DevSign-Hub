const fs = require('fs');
const path = require('path');

const files = [
  'src/components/tools/CodeConverterTool.tsx',
  'src/components/tools/JwtDecoderTool.tsx',
  'src/components/tools/RegexTesterTool.tsx',
  'src/components/tools/Base64ConverterTool.tsx',
  'src/components/tools/CrontabGeneratorTool.tsx'
];

files.forEach(file => {
  const p = path.join(__dirname, file);
  let content = fs.readFileSync(p, 'utf8');
  // Remove backslashes before backticks and dollar signs
  content = content.replace(/\\\`/g, '`');
  content = content.replace(/\\\$/g, '$');
  // In regex tester, I wrote '\\\\d' instead of '\\d', etc. Let's fix those
  content = content.replace(/\\\\\\\\/g, '\\\\'); // wait, that's too aggressive maybe?
  // Let's just fix the specific ones
  content = content.replace(/\\\\n/g, '\\n');
  content = content.replace(/\\\\\./g, '\\.');
  content = content.replace(/\\\\d/g, '\\d');
  content = content.replace(/\\\\w/g, '\\w');
  
  fs.writeFileSync(p, content, 'utf8');
});
console.log('Fixed files');
