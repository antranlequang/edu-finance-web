import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export function getAccountLevelName(level: number): string {
  const levels = {
    1: 'Basic',
    2: 'Bronze', 
    3: 'Silver',
    4: 'Gold',
    5: 'Platinum'
  };
  return levels[level as keyof typeof levels] || 'Basic';
}
