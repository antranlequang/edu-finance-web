'use client';

import Image from "next/image";
import { useState } from "react";

interface ProfileImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  fallbackIcon: React.ReactNode;
  gradient: string;
}

export default function ProfileImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = "", 
  fallbackIcon, 
  gradient 
}: ProfileImageProps) {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white rounded-full ${className}`}>
        {fallbackIcon}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`w-full h-full object-cover rounded-full ${className}`}
      onError={() => setImageError(true)}
    />
  );
}