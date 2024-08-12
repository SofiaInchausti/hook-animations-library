
import { useState, useCallback } from 'react';

export function useClipboard() {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = useCallback((text: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        setIsCopied(true);
      }).catch(() => {
        setIsCopied(false);
      });
    } else {
      // Fallback for browsers that don't support navigator.clipboard
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setIsCopied(true);

      } catch (err) {
        setIsCopied(false);
      } finally {
        document.body.removeChild(textArea);
      }
    }
  }, []);

  return { isCopied, copyToClipboard };
}
