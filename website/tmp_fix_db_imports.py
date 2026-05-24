from pathlib import Path

root = Path(r'c:\Users\lenovo\OneDrive\Desktop\yugen-supabase-ready\yugen-supabase\website')
pattern = "const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };"
replacement = "import db from '@/api/base44Client';"
count = 0
for p in root.rglob('src/**/*'):
    if p.suffix.lower() in {'.js', '.jsx', '.ts', '.tsx'}:
        text = p.read_text(encoding='utf-8')
        if pattern in text:
            text = text.replace(pattern, replacement)
            p.write_text(text, encoding='utf-8')
            print('updated', p.relative_to(root))
            count += 1
base44 = root / 'src' / 'api' / 'base44Client.js'
base44_text = '''const db = globalThis.__B44_DB__ || { auth: { isAuthenticated: async ()=>false, me: async ()=>null }, entities: new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

export const base44=db;
export default db;
'''
base44.write_text(base44_text, encoding='utf-8')
print('updated base44Client.js')
print('replaced count', count)
