"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";

// Small "copy to clipboard" affordance for phone numbers and emails.
export default function CopyButton({ value, label = "Copy", className = "" }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id);
  }, [copied]);

  const copy = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      // Clipboard can be blocked; the value stays visible and selectable.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`${label}: ${value}`}
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] transition-colors ${className}`}
    >
      {copied ? <Check size={13} strokeWidth={3} /> : <Copy size={13} />}
      {copied ? "Copied" : label}
    </button>
  );
}
