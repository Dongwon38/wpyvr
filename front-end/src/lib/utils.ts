import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Decode HTML entities from WordPress content
 * Handles common entities like &amp;, &lt;, &gt;, &quot;, &#8211;, etc.
 */
export function decodeHtmlEntities(text: string): string {
  if (typeof window === 'undefined') {
    // Server-side: Use a simple replacement map
    const entityMap: Record<string, string> = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#039;': "'",
      '&#8211;': '–', // en-dash
      '&#8212;': '—', // em-dash
      '&#8216;': ''', // left single quote
      '&#8217;': ''', // right single quote
      '&#8220;': '"', // left double quote
      '&#8221;': '"', // right double quote
      '&#8230;': '…', // ellipsis
    };

    let decoded = text;
    for (const [entity, char] of Object.entries(entityMap)) {
      decoded = decoded.replace(new RegExp(entity, 'g'), char);
    }

    // Handle numeric entities (e.g., &#8211;, &#x2013;)
    decoded = decoded.replace(/&#(\d+);/g, (match, dec) => {
      return String.fromCharCode(parseInt(dec, 10));
    });
    decoded = decoded.replace(/&#x([0-9A-Fa-f]+);/g, (match, hex) => {
      return String.fromCharCode(parseInt(hex, 16));
    });

    return decoded;
  } else {
    // Client-side: Use browser's DOMParser
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  }
}
