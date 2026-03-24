import { useState, useRef, useCallback, useEffect, useMemo } from 'react';

interface UseVirtualScrollOptions {
  itemCount: number;
  itemHeight: number;
  containerHeight: number;
  buffer?: number;
}

interface UseVirtualScrollResult {
  startIndex: number;
  endIndex: number;
  totalHeight: number;
  offsetY: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onScroll: () => void;
}

export function useVirtualScroll({
  itemCount,
  itemHeight,
  containerHeight,
  buffer = 5,
}: UseVirtualScrollOptions): UseVirtualScrollResult {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const totalHeight = itemCount * itemHeight;

  const { startIndex, endIndex, offsetY } = useMemo(() => {
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const rawStart = Math.floor(scrollTop / itemHeight);
    const start = Math.max(0, rawStart - buffer);
    const end = Math.min(itemCount - 1, rawStart + visibleCount + buffer);
    const offset = start * itemHeight;
    return { startIndex: start, endIndex: end, offsetY: offset };
  }, [scrollTop, itemCount, itemHeight, containerHeight, buffer]);

  const onScroll = useCallback(() => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // Reset scroll on item count change
    setScrollTop(el.scrollTop);
  }, [itemCount]);

  return { startIndex, endIndex, totalHeight, offsetY, containerRef, onScroll };
}
