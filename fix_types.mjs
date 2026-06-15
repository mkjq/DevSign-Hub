import fs from 'fs';
import path from 'path';

const categories = ['core', 'design', 'security'];

categories.forEach(cat => {
  const file = path.join('/home/ethbaldo/Apps/Toraloma2/src/app/category', cat, 'page.tsx');
  let content = fs.readFileSync(file, 'utf8');
  
  // Add explicit type
  content = content.replace('const tools = [', 'type Tool = { id: string, title: string, desc: string, cat: string, premium?: boolean };\nconst tools: Tool[] = [');
  
  fs.writeFileSync(file, content);
});

console.log('Fixed types in category pages.');
