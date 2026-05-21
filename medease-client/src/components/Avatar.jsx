import { useState } from "react";

const Avatar = ({ src, name = "", size = "md", className = "", rounded = "rounded-full" }) => {
  const [failed, setFailed] = useState(false);

  const sizeMap = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-lg",
    xl: "w-20 h-20 text-2xl",
    "2xl": "w-28 h-28 text-3xl",
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
        className={`${dimClass} ${rounded} ${className} flex items-center justify-center font-semibold bg-[var(--muted-bg)] text-[var(--primary)] shrink-0 select-none border border-[var(--border)]`}
      >
        {initials || (
          <svg className="w-1/2 h-1/2 text-[var(--primary)]/40" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
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
