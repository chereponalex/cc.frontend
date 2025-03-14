import React, { useEffect, useRef } from "react";

function usePrevious(value: any) {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
export default usePrevious;
