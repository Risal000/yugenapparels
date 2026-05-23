import { supabase } from '@/lib/supabase';

// ─── Products ─────────────────────────────────────────────────────────────────
export const Product = {
  list: async (orderBy = '-created_at', limit = 100) => {
    const col = orderBy.startsWith('-') ? orderBy.slice(1) : orderBy;
    const asc = !orderBy.startsWith('-');
    let q = supabase.from('products').select('*').order(col, { ascending: asc });
    if (limit) q = q.limit(limit);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },
  get: async (id) => {
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },
  create: async (payload) => {
    const { data, error } = await supabase.from('products').insert([payload]).select().single();
    if (error) throw error;
    return data;
  },
  update: async (id, payload) => {
    const { data, error } = await supabase.from('products').update(payload).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  delete: async (id) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
  },
};

// ─── Cart Items ───────────────────────────────────────────────────────────────
export const CartItem = {
  list: async () => {
    // Use localStorage for anonymous cart
    const items = JSON.parse(localStorage.getItem('yugen_cart') || '[]');
    return items;
  },
  create: async (payload) => {
    const items = JSON.parse(localStorage.getItem('yugen_cart') || '[]');
    const newItem = { ...payload, id: crypto.randomUUID(), created_at: new Date().toISOString() };
    items.push(newItem);
    localStorage.setItem('yugen_cart', JSON.stringify(items));
    return newItem;
  },
  update: async (id, payload) => {
    const items = JSON.parse(localStorage.getItem('yugen_cart') || '[]');
    const updated = items.map(i => i.id === id ? { ...i, ...payload } : i);
    localStorage.setItem('yugen_cart', JSON.stringify(updated));
    return updated.find(i => i.id === id);
  },
  delete: async (id) => {
    const items = JSON.parse(localStorage.getItem('yugen_cart') || '[]');
    const updated = items.filter(i => i.id !== id);
    localStorage.setItem('yugen_cart', JSON.stringify(updated));
  },
  clear: () => localStorage.removeItem('yugen_cart'),
};

// ─── Wishlist Items ───────────────────────────────────────────────────────────
export const WishlistItem = {
  list: async () => {
    const items = JSON.parse(localStorage.getItem('yugen_wishlist') || '[]');
    return items;
  },
  create: async (payload) => {
    const items = JSON.parse(localStorage.getItem('yugen_wishlist') || '[]');
    // Prevent duplicates
    if (items.find(i => i.product_id === payload.product_id)) return items[0];
    const newItem = { ...payload, id: crypto.randomUUID(), created_at: new Date().toISOString() };
    items.push(newItem);
    localStorage.setItem('yugen_wishlist', JSON.stringify(items));
    return newItem;
  },
  delete: async (id) => {
    const items = JSON.parse(localStorage.getItem('yugen_wishlist') || '[]');
    const updated = items.filter(i => i.id !== id);
    localStorage.setItem('yugen_wishlist', JSON.stringify(updated));
  },
};

// ─── Orders ───────────────────────────────────────────────────────────────────
export const Order = {
  list: async (orderBy = '-created_at', limit = 200) => {
    const col = orderBy.startsWith('-') ? orderBy.slice(1) : orderBy;
    const asc = !orderBy.startsWith('-');
    let q = supabase.from('orders').select('*').order(col, { ascending: asc });
    if (limit) q = q.limit(limit);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },
  create: async (payload) => {
    const { data, error } = await supabase.from('orders').insert([payload]).select().single();
    if (error) throw error;
    return data;
  },
  update: async (id, payload) => {
    const { data, error } = await supabase.from('orders').update(payload).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  delete: async (id) => {
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (error) throw error;
  },
};

// ─── File Upload ──────────────────────────────────────────────────────────────
export const UploadFile = async ({ file }) => {
  const ext = file.name.split('.').pop();
  const fileName = `${crypto.randomUUID()}.${ext}`;
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(fileName, file, { cacheControl: '3600', upsert: false });
  if (error) throw error;
  const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName);
  return { file_url: publicUrl };
};
