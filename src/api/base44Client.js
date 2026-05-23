// Compatibility shim — all db calls now go through Supabase
import { Product, CartItem, WishlistItem, Order, UploadFile } from './supabaseClient';

export const db = {
  entities: {
    Product,
    CartItem,
    WishlistItem,
    Order,
  },
  integrations: {
    Core: { UploadFile },
  },
};

export const base44 = db;
export default db;
