import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateExcerpt(html: string, maxLength = 250): string {
  const tempDiv = document.createElement("div");
  // Add spaces between adjacent HTML tags to prevent text concatenation
  const htmlWithSpaces = html.replace(/></g, "> <");
  tempDiv.innerHTML = htmlWithSpaces;
  const text = tempDiv.innerText || tempDiv.textContent || "";
  // Normalize multiple spaces to single spaces
  const normalized = text.replace(/\s+/g, " ").trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  const truncated = normalized.substring(0, maxLength);
  return truncated;
}
