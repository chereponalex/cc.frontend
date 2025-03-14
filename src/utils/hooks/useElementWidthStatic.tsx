import { useRef, useState, useLayoutEffect } from "react";

const useElementWidthStatic = (dependency?: any) => {
  const [width, setWidth] = useState<number>(0);
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = ref.current;

    if (element) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setWidth(entry.contentRect.width);
        }
      });

      resizeObserver.observe(element);

      return () => {
        resizeObserver.unobserve(element);
      };
    }
  }, [dependency]);

  return { ref, width };
};

export default useElementWidthStatic;
