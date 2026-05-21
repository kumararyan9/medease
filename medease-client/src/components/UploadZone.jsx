import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";

const UploadZone = ({ value, onChange, error, accept = "image/*", label = "Upload image", existingImage }) => {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(
    (file) => {
      if (file && file.type.startsWith("image/")) {
        onChange(file);
      }
    },
    [onChange]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (file) handleFile(file);
      e.target.value = "";
    },
    [handleFile]
  );

  const handleRemove = useCallback(
    (e) => {
      e.stopPropagation();
      onChange(null);
    },
    [onChange]
  );

  const hasSelection = value instanceof File;
  const previewUrl = hasSelection ? URL.createObjectURL(value) : existingImage || null;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-[var(--foreground)]">{label}</p>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`
          relative flex flex-col items-center justify-center
          border-2 border-dashed rounded-xl p-6 cursor-pointer
          transition-all duration-200 min-h-[140px]
          ${dragOver
            ? "border-[var(--primary)] bg-[var(--primary)]/5 scale-[1.02]"
            : previewUrl
              ? "border-[var(--primary)]/50"
              : "border-[var(--border)] hover:border-[var(--primary)]/50 hover:bg-[var(--muted-bg)]/30"
          }
          ${error ? "border-red-500" : ""}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />

        {previewUrl ? (
          <div className="relative group w-full flex items-center justify-center">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-28 h-28 rounded-full object-cover border-2 border-[var(--border)] shadow-sm"
            />
            <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center">
              <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Click to change
              </span>
            </div>
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleRemove}
              type="button"
              className="absolute -top-1 -right-1 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md hover:bg-red-600 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-[var(--foreground)]">
            <div className="w-12 h-12 rounded-full bg-[var(--muted-bg)] flex items-center justify-center">
              <svg className="w-6 h-6 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">{dragOver ? "Drop image here" : "Drop image or click to browse"}</p>
              <p className="text-xs text-[var(--foreground)]/50 mt-0.5">JPG, PNG, WEBP up to 5MB</p>
            </div>
          </div>
        )}

        {dragOver && (
          <div className="absolute inset-0 rounded-xl bg-[var(--primary)]/5 border-2 border-[var(--primary)]" />
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
};

export default UploadZone;
