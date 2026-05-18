import { Copy, Check } from "lucide-react";
import { useState } from "react";

export function CodeBlock({ code, language = "javascript", title, className = "" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`rounded-xl border border-border overflow-hidden ${className}`}>
      <div className="flex items-center justify-between px-4 py-2 bg-elevated border-b border-border">
        <span className="text-xs font-medium text-muted">
          {title || language}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="p-1.5 rounded-md text-muted hover:text-foreground hover:bg-surface transition-colors"
          aria-label="Copy code"
        >
          {copied ? <Check size={14} className="text-accent" /> : <Copy size={14} />}
        </button>
      </div>
      <pre className="p-4 bg-canvas overflow-x-auto custom-scrollbar">
        <code className="text-sm font-mono text-foreground leading-relaxed">{code}</code>
      </pre>
    </div>
  );
}

export default CodeBlock;
