import { useEffect, useRef } from 'react';

interface UseInfiniteScrollOptions {
  root?: Element | null; 
  rootMargin?: string;
  threshold?: number;
  hasMore: boolean; 
  loadMore: () => void; 
  loading: boolean;
}

function useInfiniteScroll({
  root = null,
  rootMargin = '0px',
  threshold = 0.1,
  hasMore,
  loadMore,
  loading,
}: UseInfiniteScrollOptions) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (loading) return;

    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      }, { root, rootMargin, threshold });
    }

    const observer = observerRef.current;
    const sentinel = sentinelRef.current;

    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
    };
  }, [loading, hasMore, loadMore, root, rootMargin, threshold]);

  return { sentinelRef };
}

export default useInfiniteScroll;
