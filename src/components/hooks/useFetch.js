"use client";

import { useState, useEffect, useCallback, useRef } from "react";


/**
 * Custom hook to fetch data with automatic retry functionality.
 *
 * @param {string} url - URL to fetch from
 * @param {object} options - Fetch options and configuration
 * @param {number} [options.maxRetries=3] - Maximum retry attempts on failure
 * @param {number} [options.retryDelay=1000] - Delay between retries in milliseconds
 */
export function useFetch(url, options = {}) {
  const { maxRetries = 3, retryDelay = 1000, ...fetchOptions } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const isMountedRef = useRef(true);
  const abortControllerRef = useRef(null);

  const fetchData = useCallback(
    async (attempt = 1) => {
      // Abort any prior in-flight request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      setLoading(true);
      setError(null);
      setRetryCount(attempt - 1);

      try {
        const response = await fetch(url, {
          ...fetchOptions,
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();

        if (isMountedRef.current) {
          setData(json);
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        if (err.name === "AbortError") return;

        if (attempt < maxRetries) {
          // Retry after delay
          setTimeout(() => {
            if (isMountedRef.current) {
              fetchData(attempt + 1);
            }
          }, retryDelay);
        } else {
          // Reached maximum attempts
          if (isMountedRef.current) {
            setError(err.message || "Failed to load data after 3 attempts.");
            setLoading(false);
          }
        }
      }
    },
    [url, maxRetries, retryDelay],
  );

  useEffect(() => {
    isMountedRef.current = true;
    fetchData(1);

    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData(1);
  }, [fetchData]);

  return { data, loading, error, retryCount, refetch };
}
