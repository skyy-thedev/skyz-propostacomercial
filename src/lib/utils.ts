import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatShortDate(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function generateProposalNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `SKZ-${year}${month}${day}-${random}`;
}

export function getValidityDate(days: number = 15): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim();
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

// Salvar dados no localStorage
export function saveToLocalStorage(key: string, data: unknown): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(data));
  }
}

// Recuperar dados do localStorage
export function loadFromLocalStorage<T>(key: string): T | null {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(key);
    if (data) {
      try {
        return JSON.parse(data) as T;
      } catch {
        return null;
      }
    }
  }
  return null;
}

// Limpar dados do localStorage
export function clearLocalStorage(key: string): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key);
  }
}

// Debounce para auto-save
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Mapear valor de orçamento para range numérico
export function getBudgetRange(budgetValue: string): { min: number; max: number } {
  const ranges: Record<string, { min: number; max: number }> = {
    "up-to-5k": { min: 2000, max: 5000 },
    "5k-15k": { min: 5000, max: 15000 },
    "15k-30k": { min: 15000, max: 30000 },
    "30k-50k": { min: 30000, max: 50000 },
    "above-50k": { min: 50000, max: 150000 },
    "need-guidance": { min: 5000, max: 30000 },
  };
  return ranges[budgetValue] || { min: 5000, max: 15000 };
}

// Obter label de opção
export function getOptionLabel(
  options: { value: string; label: string }[],
  value: string
): string {
  const option = options.find((opt) => opt.value === value);
  return option?.label || value;
}
