interface AvatarProps {
  src?: string;
  alt: string;
  fallback: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Avatar({ src, alt, fallback, size = "md", className = "" }: AvatarProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold overflow-hidden flex-shrink-0 ${className}`}
      style={{ backgroundColor: src ? "transparent" : "#6366f1" }}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-contain" />
      ) : (
        <span className="text-white">{fallback}</span>
      )}
    </div>
  );
}
