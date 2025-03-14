const debounce = <T>(fn: (this: T, ...args: any[]) => void, ms: number) => {
  let timer: any;
  return ((...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(function (this: T) {
      timer = null;
      fn.apply(this, args);
    }, ms);
  }) as (...args: any[]) => void;
};

export default debounce;
