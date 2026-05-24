import db from '@/api/base44Client';

import React, { useRef, useState, useCallback } from "react";
import { Upload, X, ImageIcon, Video, GripVertical } from "lucide-react";

function MediaThumb({ file, onRemove, index }) {
  const isVideo = file.type?.startsWith("video") || file.url?.match(/\.(mp4|mov|webm|ogg)(\?|$)/i);
  return (
    <div className="relative group aspect-square bg-card border border-border/30 overflow-hidden">
      {isVideo ? (
        <video src={file.url} className="w-full h-full object-cover" muted playsInline />
      ) : (
        <img src={file.url} alt="" className="w-full h-full object-cover" />
      )}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <button
          onClick={() => onRemove(index)}
          className="w-7 h-7 bg-black/70 text-white flex items-center justify-center hover:bg-destructive/80 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      {index === 0 && (
        <span className="absolute top-1 left-1 text-[8px] tracking-[0.1em] uppercase bg-white/90 text-black px-1.5 py-0.5">
          Primary
        </span>
      )}
      {index === 1 && (
        <span className="absolute top-1 left-1 text-[8px] tracking-[0.1em] uppercase bg-white/20 text-white px-1.5 py-0.5">
          Hover
        </span>
      )}
      {isVideo && (
        <Video className="absolute bottom-1.5 right-1.5 w-3 h-3 text-white/70" />
      )}
    </div>
  );
}

export default function MediaUploader({ mediaFiles, onChange }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef();

  const uploadFiles = useCallback(async (files) => {
    if (!files.length) return;
    setUploading(true);
    const uploaded = [];
    for (const file of files) {
      const { file_url } = await db.integrations.Core.UploadFile({ file });
      uploaded.push({ url: file_url, type: file.type });
    }
    onChange([...mediaFiles, ...uploaded]);
    setUploading(false);
  }, [mediaFiles, onChange]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(
      (f) => f.type.startsWith("image/") || f.type.startsWith("video/")
    );
    uploadFiles(files);
  }, [uploadFiles]);

  const handleInput = (e) => {
    const files = Array.from(e.target.files);
    uploadFiles(files);
    e.target.value = "";
  };

  const removeMedia = (index) => {
    onChange(mediaFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {/* Thumbnails */}
      {mediaFiles.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {mediaFiles.map((file, i) => (
            <MediaThumb key={i} file={file} index={i} onRemove={removeMedia} />
          ))}
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragEnter={() => setDragging(true)}
        onDragLeave={() => setDragging(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex flex-col items-center justify-center gap-2.5 py-8 border-2 border-dashed cursor-pointer transition-all duration-200 ${
          dragging
            ? "border-foreground/50 bg-foreground/5"
            : "border-border/30 hover:border-foreground/25 hover:bg-foreground/3"
        }`}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-5 h-5 border-2 border-foreground/20 border-t-foreground/50 rounded-full animate-spin" />
            <span className="text-[10px] tracking-[0.1em] uppercase text-foreground/30">Uploading...</span>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 text-foreground/25">
              <ImageIcon className="w-4 h-4" />
              <Video className="w-4 h-4" />
            </div>
            <div className="text-center">
              <p className="text-[10px] tracking-[0.15em] uppercase text-foreground/40">
                Drop images & videos here
              </p>
              <p className="text-[9px] text-foreground/20 mt-1">or tap to browse from device</p>
            </div>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        className="hidden"
        onChange={handleInput}
      />

      {mediaFiles.length > 0 && (
        <p className="text-[9px] text-foreground/20 tracking-wide">
          First image = primary · Second = hover · Drag to reorder coming soon
        </p>
      )}
    </div>
  );
}