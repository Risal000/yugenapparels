const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useRef, useState, useCallback } from "react";
import { ImageIcon, X } from "lucide-react";

export default function ColorImageUploader({ imageUrl, onChange }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef();

  const upload = useCallback(async (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setUploading(true);
    const { file_url } = await db.integrations.Core.UploadFile({ file });
    onChange(file_url);
    setUploading(false);
  }, [onChange]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    upload(file);
  }, [upload]);

  const handleInput = (e) => {
    upload(e.target.files[0]);
    e.target.value = "";
  };

  if (imageUrl) {
    return (
      <div className="relative w-full aspect-square max-w-[72px] group">
        <img src={imageUrl} alt="" className="w-full h-full object-cover border border-border/30" />
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
        >
          <X className="w-3.5 h-3.5 text-white" />
        </button>
      </div>
    );
  }

  return (
    <>
      <div
        onDragEnter={() => setDragging(true)}
        onDragLeave={() => setDragging(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex flex-col items-center justify-center gap-1.5 py-3 border border-dashed cursor-pointer transition-all duration-200 text-center ${
          dragging
            ? "border-foreground/50 bg-foreground/5"
            : "border-border/30 hover:border-foreground/25 hover:bg-foreground/3"
        }`}
      >
        {uploading ? (
          <div className="w-4 h-4 border-2 border-foreground/20 border-t-foreground/50 rounded-full animate-spin" />
        ) : (
          <>
            <ImageIcon className="w-3.5 h-3.5 text-foreground/25" />
            <p className="text-[9px] tracking-[0.1em] uppercase text-foreground/30">Drop or tap</p>
          </>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleInput} />
    </>
  );
}