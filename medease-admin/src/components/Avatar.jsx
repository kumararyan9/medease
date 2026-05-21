import { useState } from "react";

const Avatar = ({ src, name = "", size = "md", className = "", rounded = "rounded-full" }) => {
  const [failed, setFailed] = useState(false);

  const sizeMap = {
    sm: "w-8 h-8 text-[10px]",
    md: "w-10 h-10 text-xs",
    lg: "w-14 h-14 text-sm",
    xl: "w-20 h-20 text-lg",
    "2xl": "w-28 h-28 text-xl",
  };

  const dimClass = sizeMap[size] || sizeMap.md;

  const initials = (name || "")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (!src || failed) {
    return (
      <div
        className={`${dimClass} ${rounded} ${className} flex items-center justify-center font-semibold bg-gradient-to-br from-[var(--muted-bg)] to-[var(--muted-bg)]/80 text-[var(--primary)] shrink-0 select-none border border-[var(--border)]/50`}
      >
        {initials || (
          <svg className="w-3/5 h-3/5 text-[var(--primary)]/50" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="15" r="8" stroke="currentColor" strokeWidth="2.5" fill="none" />
            <path d="M6 36c0-7.732 6.268-14 14-14s14 6.268 14 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M20 10v10M15 15h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      onError={() => setFailed(true)}
      className={`${dimClass} ${rounded} ${className} object-cover border border-[var(--border)] shrink-0`}
    />
  );
};

export default Avatar;
