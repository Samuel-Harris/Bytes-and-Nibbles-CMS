import React, { useEffect, useRef, useState } from "react";
import { FieldProps, FieldHelperText } from "@firecms/core";
import { TextField } from "@firecms/ui";

const ensureMathJaxLoaded = (): Promise<void> => {
  if ((window as any).MathJax) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load MathJax"));
    document.head.appendChild(script);
  });
};

const LatexContentField = ({
  property,
  value,
  setValue,
  includeDescription,
  showError,
  error,
  isSubmitting,
  disabled,
  autoFocus,
}: FieldProps<string>) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);

  // Load MathJax once
  useEffect(() => {
    ensureMathJaxLoaded()
      .then(() => setIsReady(true))
      .catch(() => setRenderError("Failed to load MathJax"));
  }, []);

  // Render LaTeX whenever content changes
  useEffect(() => {
    if (!isReady || !previewRef.current || !value) return;

    try {
      const MathJax = (window as any).MathJax;
      MathJax.texReset();
      MathJax.typesetClear();
      MathJax.typesetPromise([previewRef.current]).catch((err: any) => {
        console.warn("MathJax render error", err);
        setRenderError("LaTeX rendering failed");
      });
    } catch {
      setRenderError("LaTeX rendering error");
    }
  }, [value, isReady]);

  return (
    <div className="space-y-3">
      <TextField
        value={value ?? ""}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter LaTeX (e.g. \frac{a}{b} + c^2)"
        disabled={isSubmitting || disabled}
        error={!!error}
        autoFocus={autoFocus}
        multiline
      />

      {/* Preview */}
      {value?.trim() && (
        <div className="border rounded-md p-3 bg-gray-50 dark:bg-gray-800">
          <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
            LaTeX preview
          </div>

          {renderError ? (
            <div className="text-sm text-red-500 italic">{renderError}</div>
          ) : (
            <div
              ref={previewRef}
              className="prose prose-sm max-w-none dark:prose-invert"
            >
              {`$$${value}$$`}
            </div>
          )}
        </div>
      )}

      <FieldHelperText
        includeDescription={includeDescription}
        showError={showError}
        error={error}
        property={property}
      />
    </div>
  );
};

export default LatexContentField;
