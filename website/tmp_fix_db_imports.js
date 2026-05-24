const { promises: fs } = require('fs');
const { join } = require('path');
const root = join('c:', 'Users', 'lenovo', 'OneDrive', 'Desktop', 'yugen-supabase-ready', 'yugen-supabase', 'website');
const pattern = "const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };";
const replacement = "import db from '@/api/base44Client';";
(async () => {
  let count = 0;
  const walk = async dir => {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (['.js', '.jsx', '.ts', '.tsx'].includes(entry.name.slice(entry.name.lastIndexOf('.')))) {
        const text = await fs.readFile(fullPath, 'utf8');
        if (text.includes(pattern)) {
          await fs.writeFile(fullPath, text.replace(pattern, replacement), 'utf8');
          console.log('updated', fullPath.replace(root + '\\', ''));
          count += 1;
        }
      }
    }
  };
  await walk(join(root, 'src'));
  const base44 = join(root, 'src', 'api', 'base44Client.js');
  const base44Text = `const db = globalThis.__B44_DB__ || { auth: { isAuthenticated: async ()=>false, me: async ()=>null }, entities: new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

export const base44=db;
export default db;
`;
  await fs.writeFile(base44, base44Text, 'utf8');
  console.log('updated base44Client.js');
  console.log('replaced count', count);
})();