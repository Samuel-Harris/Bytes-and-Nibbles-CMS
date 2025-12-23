import React, { useEffect, useRef, useState } from "react";
import { FieldProps, FieldHelperText } from "@firecms/core";
import { TextField, Markdown } from "@firecms/ui";
import { useMathJax } from "../hooks/useMathJax";

interface ParagraphMapData {
  type: "string" | "latex";
  paragraph: string;
}

interface ParagraphData {
  type: "text" | "latex";
  content: string;
}

export function ParagraphField({
  property,
  value,
  setValue,
  includeDescription,
  showError,
  error,
  isSubmitting,
  disabled,
  autoFocus,
}: FieldProps<Record<string, any>>) {
  // Parse the map object from the schema
  let parsedValue: ParagraphData;
  try {
    if (
      value &&
      typeof value === "object" &&
      "type" in value &&
      "paragraph" in value
    ) {
      const mapData = value as ParagraphMapData;
      parsedValue = {
        type: mapData.type === "string" ? "text" : "latex",
        content: mapData.paragraph || "",
      };
    } else {
      parsedValue = { type: "text", content: "" };
    }
  } catch (error) {
    console.warn("Failed to parse paragraph data:", value, error);
    parsedValue = { type: "text", content: "" };
  }

  const previewRef = useRef<HTMLDivElement>(null);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [lastRenderedContent, setLastRenderedContent] = useState<string>("");
  const [previewContent, setPreviewContent] = useState<string>("");
  const { loaded: isMathJaxReady, error: mathJaxError } = useMathJax();

  // Handle MathJax loading errors
  useEffect(() => {
    if (mathJaxError) {
      setRenderError(`Failed to load MathJax: ${mathJaxError}`);
    }
  }, [mathJaxError]);

  // Update preview content when LaTeX content changes
  useEffect(() => {
    if (parsedValue.type === "latex" && parsedValue.content?.trim()) {
      setPreviewContent(`$$${parsedValue.content}$$`);
    } else {
      setPreviewContent("");
    }
  }, [parsedValue.content, parsedValue.type]);

  // Render LaTeX whenever preview content changes
  useEffect(() => {
    if (
      !isMathJaxReady ||
      !previewRef.current ||
      !previewContent ||
      parsedValue.type !== "latex"
    ) {
      setRenderError(null);
      return;
    }

    // Skip if content hasn't changed since last successful render
    if (parsedValue.content === lastRenderedContent) {
      return;
    }

    // Clear any previous timeout
    const timeoutId = setTimeout(() => {
      try {
        const MathJax = (window as any).MathJax;
        if (!MathJax) {
          setRenderError("MathJax not loaded");
          return;
        }

        // Try to typeset with MathJax - use typesetPromise since it returns a Promise
        try {
          if (MathJax.typesetPromise && typeof MathJax.typesetPromise === 'function') {
            // Clear any previous MathJax processing for this element (before updating content)
            if (MathJax.typesetClear) {
              MathJax.typesetClear([previewRef.current!]);
            }

            // Reset TeX state (labels, equation numbers, macros)
            if (MathJax.texReset) {
              MathJax.texReset();
            }

            // Typeset the content (previewContent is already set by React state)
            MathJax.typesetPromise([previewRef.current!])
              .then(() => {
                setRenderError(null);
                setLastRenderedContent(parsedValue.content);
              })
              .catch((err: any) => {
                console.warn("MathJax render error", err);
                setRenderError(
                  `LaTeX rendering failed: ${err.message || "Unknown error"}`
                );
              });
          } else {
            setRenderError("MathJax typesetPromise not available");
          }
        } catch (err) {
          console.warn("MathJax rendering error", err);
          setRenderError("LaTeX rendering failed");
        }
      } catch (err) {
        console.warn("LaTeX rendering error", err);
        setRenderError("LaTeX rendering error");
      }
    }, 300); // Debounce for 300ms to avoid too many renders

    return () => clearTimeout(timeoutId);
  }, [previewContent, parsedValue.type, isMathJaxReady, lastRenderedContent]);

  const handleTypeChange = (type: "text" | "latex") => {
    const newValue = { ...parsedValue, type };
    setValue({
      type: type === "text" ? "string" : "latex",
      paragraph: newValue.content,
    });
  };

  const handleContentChange = (content: string) => {
    const newValue = { ...parsedValue, content };
    setValue({
      type: parsedValue.type === "text" ? "string" : "latex",
      paragraph: content,
    });
  };

  return (
    <div className="space-y-3">
      {/* Type Selector */}
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
          Paragraph type *
        </label>
        <select
          value={parsedValue.type}
          onChange={(e) => handleTypeChange(e.target.value as "text" | "latex")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600"
          disabled={isSubmitting || disabled}
        >
          <option value="text">Text</option>
          <option value="latex">LaTeX</option>
        </select>
      </div>

      {/* Content Input */}
      {parsedValue.type === "latex" ? (
        <div className="space-y-3">
          <TextField
            value={parsedValue.content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="Enter LaTeX (e.g. \int_0^\infty x^2 \, dx or \frac{a}{b})"
            disabled={isSubmitting || disabled}
            error={!!error}
            autoFocus={autoFocus}
            multiline
          />

          {/* Preview */}
          {parsedValue.content?.trim() && (
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
                {previewContent}
              </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <TextField
            value={parsedValue.content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="Enter text content (supports Markdown)"
            disabled={isSubmitting || disabled}
            error={!!error}
            autoFocus={autoFocus}
            multiline
          />

          {/* Markdown Preview */}
          {parsedValue.content?.trim() && (
            <div className="border rounded-md p-3 bg-gray-50 dark:bg-gray-800">
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                Markdown preview
              </div>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <Markdown source={parsedValue.content} />
              </div>
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
}
