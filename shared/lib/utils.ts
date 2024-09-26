//создаётся автоматически при инициализации библиотеки shadcn-ui
// Вспомогательная функция «cn» в shadcn-ui/ui: Использует "clsx" и служит для слияния классов

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
