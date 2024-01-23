/**
 * Copyright 2024 Design Barn Inc.
 */

export function debounce<T extends (...args: any[]) => unknown>(func: T, wait = 20): T {
  let timeout: ReturnType<typeof setTimeout>;

  return ((...args: any[]) => {
    const later = (): void => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  }) as T;
}
