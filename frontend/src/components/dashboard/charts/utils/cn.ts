<<<<<<< HEAD

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
=======
export { cn } from '@/lib/utils';
>>>>>>> d9039229ee7b761f0a81db294b0be7d0ad02d048
