import { useState } from "react";
import { ImageIcon, AlertCircle } from "lucide-react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  showError?: boolean;
}

export default function OptimizedImage({
  src,
  alt,
  className = "",
  fallbackClassName = "",
  showError = true,
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => {
    setIsLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setImageError(true);
  };

  // التحقق من صحة الرابط
  const isValidImageUrl = (url: string) => {
    if (!url) return false;
    return (
      url.startsWith("http") ||
      url.startsWith("data:image/") ||
      url.startsWith("/")
    );
  };

  if (!isValidImageUrl(src) || imageError) {
    return (
      <div
        className={`bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center ${
          fallbackClassName || className
        }`}
      >
        {showError ? (
          <>
            <AlertCircle className="h-6 w-6 text-red-500 mb-1" />
            <span className="text-xs text-red-500 text-center">
              Image error
            </span>
          </>
        ) : (
          <ImageIcon className="h-6 w-6 text-gray-400" />
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div
          className={`absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg ${className}`}
        />
      )}
      <img
        src={src || "/placeholder.svg"}
        alt={alt}
        className={`${className} ${
          isLoading ? "opacity-0" : "opacity-100"
        } transition-opacity duration-200`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
      />
    </div>
  );
}
