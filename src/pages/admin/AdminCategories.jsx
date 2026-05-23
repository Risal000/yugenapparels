import React, { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronRight, Pencil, Check, X } from "lucide-react";

const DEFAULT_CATEGORIES = [
  { slug: "tops", label: "Tops", subcategories: [{ slug: "all-tops", label: "All Tops" }, { slug: "t-shirts", label: "T-Shirts" }, { slug: "shirts", label: "Shirts" }, { slug: "sweatshirts", label: "Sweatshirts" }, { slug: "hoodies", label: "Hoodies" }, { slug: "jackets", label: "Jackets" }] },
  { slug: "bottoms", label: "Bottoms", subcategories: [{ slug: "all-bottoms", label: "All Bottoms" }, { slug: "jeans", label: "Jeans" }, { slug: "joggers", label: "Joggers" }, { slug: "cargo", label: "Cargo" }, { slug: "shorts", label: "Shorts" }] },
  { slug: "activewear", label: "Activewear", subcategories: [{ slug: "all-activewear", label: "All Activewear" }] },
  { slug: "footwear", label: "Footwear", subcategories: [{ slug: "all-footwear", label: "All Footwear" }] },
  { slug: "accessories", label: "Accessories", subcategories: [{ slug: "all-accessories", label: "All Accessories" }] },
  { slug: "essentials", label: "Essentials", subcategories: [{ slug: "all-essentials", label: "All Essentials" }] },
  { slug: "anime", label: "Anime", subcategories: [{ slug: "all-anime", label: "All Anime" }] },
  { slug: "thrift-surplus", label: "Thrift / Surplus", subcategories: [{ slug: "all-thrift", label: "All" }, { slug: "tops", label: "Tops" }, { slug: "bottoms", label: "Bottoms" }, { slug: "accessories", label: "Accessories" }] },
];

const STORAGE_KEY = "yugen_categories";

function load() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export default function AdminCategories() {
  const [categories, setCategories] = useState(load);
  const [expanded, setExpanded] = useState(null);
  const [editingCat, setEditingCat] = useState(null);
  const [editingCatVal, setEditingCatVal] = useState("");
  const [editingSub, setEditingSub] = useState(null); // {catIdx, subIdx}
  const [editingSubVal, setEditingSubVal] = useState("");
  const [newCatLabel, setNewCatLabel] = useState("");
  const [newSubLabel, setNewSubLabel] = useState({});
  const [saved, setSaved] = useState(false);

  const persist = (updated) => {
    setCategories(updated);
    save(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  // Category actions
  const addCategory = () => {
    if (!newCatLabel.trim()) return;
    const slug = newCatLabel.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    persist([...categories, { slug, label: newCatLabel.trim(), subcategories: [] }]);
    setNewCatLabel("");
  };

  const deleteCategory = (idx) => {
    const updated = categories.filter((_, i) => i !== idx);
    persist(updated);
  };

  const saveEditCat = (idx) => {
    const updated = categories.map((c, i) => i === idx ? { ...c, label: editingCatVal } : c);
    persist(updated);
    setEditingCat(null);
  };

  // Subcategory actions
  const addSub = (catIdx) => {
    const label = newSubLabel[catIdx] || "";
    if (!label.trim()) return;
    const slug = label.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const updated = categories.map((c, i) =>
      i === catIdx ? { ...c, subcategories: [...c.subcategories, { slug, label: label.trim() }] } : c
    );
    persist(updated);
    setNewSubLabel({ ...newSubLabel, [catIdx]: "" });
  };

  const deleteSub = (catIdx, subIdx) => {
    const updated = categories.map((c, i) =>
      i === catIdx ? { ...c, subcategories: c.subcategories.filter((_, si) => si !== subIdx) } : c
    );
    persist(updated);
  };

  const saveEditSub = (catIdx, subIdx) => {
    const updated = categories.map((c, i) =>
      i === catIdx
        ? { ...c, subcategories: c.subcategories.map((s, si) => si === subIdx ? { ...s, label: editingSubVal } : s) }
        : c
    );
    persist(updated);
    setEditingSub(null);
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light tracking-[-0.01em] text-foreground/85">Categories</h1>
          <p className="text-xs text-foreground/30 mt-1 font-light">Manage navigation categories and subcategories</p>
        </div>
        {saved && (
          <span className="text-[10px] tracking-[0.15em] uppercase text-green-400/70 flex items-center gap-1.5">
            <Check className="w-3 h-3" /> Saved
          </span>
        )}
      </div>

      {/* Add new category */}
      <div className="bg-card border border-border/25 p-5 mb-6">
        <p className="text-[9px] tracking-[0.2em] uppercase text-foreground/30 mb-3">Add New Category</p>
        <div className="flex gap-2">
          <input
            value={newCatLabel}
            onChange={(e) => setNewCatLabel(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCategory()}
            placeholder="Category name"
            className="flex-1 bg-background border border-border/30 px-3 py-2 text-xs text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-foreground/40 transition-colors"
          />
          <button
            onClick={addCategory}
            className="px-4 py-2 bg-foreground text-background text-[10px] tracking-[0.1em] uppercase hover:bg-foreground/85 transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>
      </div>

      {/* Category list */}
      <div className="space-y-2">
        {categories.map((cat, catIdx) => (
          <div key={catIdx} className="bg-card border border-border/25">
            {/* Category row */}
            <div className="flex items-center gap-3 px-4 py-3">
              <button onClick={() => setExpanded(expanded === catIdx ? null : catIdx)} className="text-foreground/30 hover:text-foreground/60 transition-colors">
                {expanded === catIdx ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>

              {editingCat === catIdx ? (
                <div className="flex-1 flex items-center gap-2">
                  <input
                    value={editingCatVal}
                    onChange={(e) => setEditingCatVal(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && saveEditCat(catIdx)}
                    className="flex-1 bg-background border border-border/40 px-2 py-1 text-xs text-foreground focus:outline-none focus:border-foreground/50"
                    autoFocus
                  />
                  <button onClick={() => saveEditCat(catIdx)} className="text-green-400/70 hover:text-green-400"><Check className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setEditingCat(null)} className="text-foreground/30 hover:text-foreground/60"><X className="w-3.5 h-3.5" /></button>
                </div>
              ) : (
                <span className="flex-1 text-sm font-medium text-foreground/75">{cat.label}</span>
              )}

              <span className="text-[9px] text-foreground/25 tracking-wider mr-2">{cat.subcategories.length} subs</span>

              {editingCat !== catIdx && (
                <button onClick={() => { setEditingCat(catIdx); setEditingCatVal(cat.label); }} className="text-foreground/25 hover:text-foreground/60 transition-colors">
                  <Pencil className="w-3 h-3" />
                </button>
              )}
              <button onClick={() => deleteCategory(catIdx)} className="text-foreground/20 hover:text-destructive/70 transition-colors">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>

            {/* Subcategories */}
            {expanded === catIdx && (
              <div className="border-t border-border/15 px-4 pb-4">
                <div className="mt-3 space-y-1.5">
                  {cat.subcategories.map((sub, subIdx) => (
                    <div key={subIdx} className="flex items-center gap-3 pl-5">
                      <span className="w-1.5 h-1.5 rounded-full bg-foreground/15 flex-shrink-0" />
                      {editingSub?.catIdx === catIdx && editingSub?.subIdx === subIdx ? (
                        <div className="flex-1 flex items-center gap-2">
                          <input
                            value={editingSubVal}
                            onChange={(e) => setEditingSubVal(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && saveEditSub(catIdx, subIdx)}
                            className="flex-1 bg-background border border-border/40 px-2 py-1 text-[11px] text-foreground focus:outline-none focus:border-foreground/50"
                            autoFocus
                          />
                          <button onClick={() => saveEditSub(catIdx, subIdx)} className="text-green-400/70 hover:text-green-400"><Check className="w-3 h-3" /></button>
                          <button onClick={() => setEditingSub(null)} className="text-foreground/30 hover:text-foreground/60"><X className="w-3 h-3" /></button>
                        </div>
                      ) : (
                        <>
                          <span className="flex-1 text-xs text-foreground/45">{sub.label}</span>
                          <button onClick={() => { setEditingSub({ catIdx, subIdx }); setEditingSubVal(sub.label); }} className="text-foreground/20 hover:text-foreground/50 transition-colors">
                            <Pencil className="w-3 h-3" />
                          </button>
                          <button onClick={() => deleteSub(catIdx, subIdx)} className="text-foreground/15 hover:text-destructive/60 transition-colors">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add subcategory */}
                <div className="flex gap-2 mt-3 pl-5">
                  <input
                    value={newSubLabel[catIdx] || ""}
                    onChange={(e) => setNewSubLabel({ ...newSubLabel, [catIdx]: e.target.value })}
                    onKeyDown={(e) => e.key === "Enter" && addSub(catIdx)}
                    placeholder="New subcategory"
                    className="flex-1 bg-background border border-border/25 px-2 py-1.5 text-[11px] text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-foreground/35 transition-colors"
                  />
                  <button
                    onClick={() => addSub(catIdx)}
                    className="px-3 py-1.5 border border-foreground/20 text-foreground/40 text-[10px] hover:border-foreground/40 hover:text-foreground/70 transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}