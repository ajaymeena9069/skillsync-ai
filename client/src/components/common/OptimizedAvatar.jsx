import React, { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/Avatar';
import { User, Loader2 } from 'lucide-react';

export function OptimizedAvatar({ src, alt, fallbackText, className, size = 150 }) {
  const [isLoading, setIsLoading] = useState(true);

  // Cloudinary Optimization
  // Injects auto-quality, auto-format, and precise cropping for avatars
  const getOptimizedUrl = (url) => {
    if (!url) return null;
    if (url.includes('res.cloudinary.com') && !url.includes('q_auto')) {
      const parts = url.split('/upload/');
      if (parts.length === 2) {
        return `${parts[0]}/upload/q_auto,f_auto,w_${size},h_${size},c_fill/${parts[1]}`;
      }
    }
    return url;
  };

  const optimizedSrc = getOptimizedUrl(src);

  return (
    <Avatar className={className}>
      {optimizedSrc && (
        <AvatarImage
          src={optimizedSrc}
          alt={alt || "Avatar"}
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
          onLoadingStatusChange={(status) => {
            if (status === 'loaded' || status === 'error') {
              setIsLoading(false);
            }
          }}
          className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'} object-cover`}
        />
      )}

      <AvatarFallback className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md h-full w-full">
        {isLoading && optimizedSrc ? (
          <Loader2 className="w-1/2 h-1/2 animate-spin opacity-80" />
        ) : fallbackText ? (
          <span className="font-bold">{fallbackText}</span>
        ) : (
          <User className="w-1/2 h-1/2 opacity-80" />
        )}
      </AvatarFallback>
    </Avatar>
  );
}
