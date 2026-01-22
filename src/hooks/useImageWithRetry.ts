import { useState, useCallback } from "react";

interface UseImageWithRetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
}

export const useImageWithRetry = (
  placeholderUrl: string,
  options: UseImageWithRetryOptions = {},
) => {
  const {
    maxRetries = 3, // Increased from 2 to 3 for HTTP/2 protocol errors
    initialDelay = 1000,
    maxDelay = 5000,
    backoffMultiplier = 2,
  } = options;

  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set());
  const [retryAttempts, setRetryAttempts] = useState<Map<string, number>>(
    new Map(),
  );

  const handleImageError = useCallback(
    (imageUrl: string, retryCount = 0) => {
      if (retryCount < maxRetries) {
        // Track retry attempts
        setRetryAttempts((prev) => new Map(prev).set(imageUrl, retryCount + 1));

        // Mark as loading to show we're retrying
        setLoadingImages((prev) => new Set([...prev, imageUrl]));

        // Calculate delay with exponential backoff
        const delay = Math.min(
          initialDelay * Math.pow(backoffMultiplier, retryCount),
          maxDelay,
        );

        console.debug(
          `Retrying image load (${retryCount + 1}/${maxRetries}) after ${delay}ms:`,
          imageUrl,
        );

        // Retry after delay
        const timeoutId = setTimeout(() => {
          const img = new Image();

          // Add cache-busting parameter for HTTP/2 protocol errors
          const cacheBustUrl =
            retryCount > 0
              ? `${imageUrl}${imageUrl.includes("?") ? "&" : "?"}_retry=${Date.now()}`
              : imageUrl;

          img.onload = () => {
            console.debug(
              `Image loaded successfully after ${retryCount + 1} attempt(s):`,
              imageUrl,
            );
            setLoadingImages((prev) => {
              const next = new Set(prev);
              next.delete(imageUrl);
              return next;
            });
            setRetryAttempts((prev) => {
              const next = new Map(prev);
              next.delete(imageUrl);
              return next;
            });
          };

          img.onerror = () => {
            handleImageError(imageUrl, retryCount + 1);
          };

          img.src = cacheBustUrl;
        }, delay);

        return () => clearTimeout(timeoutId);
      } else {
        // After all retries failed, mark as failed
        console.warn(
          `Image failed to load after ${maxRetries} retries:`,
          imageUrl,
        );
        setFailedImages((prev) => new Set([...prev, imageUrl]));
        setLoadingImages((prev) => {
          const next = new Set(prev);
          next.delete(imageUrl);
          return next;
        });
        setRetryAttempts((prev) => {
          const next = new Map(prev);
          next.delete(imageUrl);
          return next;
        });
      }
    },
    [maxRetries, initialDelay, maxDelay, backoffMultiplier],
  );

  const getImageUrl = useCallback(
    (imageUrl: string) => {
      if (failedImages.has(imageUrl)) {
        return placeholderUrl;
      }
      return imageUrl;
    },
    [failedImages, placeholderUrl],
  );

  const isLoading = (imageUrl: string) => loadingImages.has(imageUrl);

  const getRetryAttempt = (imageUrl: string) =>
    retryAttempts.get(imageUrl) || 0;

  return {
    handleImageError,
    getImageUrl,
    isLoading,
    failedImages,
    getRetryAttempt,
  };
};
