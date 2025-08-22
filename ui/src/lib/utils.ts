import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Se for mexer tome cuidado, isso usa o tailwind-merge para evitar conflitos e duplicidade de classes do Tailwind.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
