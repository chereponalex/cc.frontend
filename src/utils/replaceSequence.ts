const replaceSequence = <T>(
  arr: T[],
  targetSequence: T[],
  replacement: T,
): T[] => {
  if (arr.length < targetSequence.length) {
    return arr;
  }

  if (
    arr.slice(0, targetSequence.length).join("") === targetSequence.join("")
  ) {
    return [replacement, ...arr.slice(targetSequence.length)];
  } else {
    return [
      arr[0],
      ...replaceSequence(arr.slice(1), targetSequence, replacement),
    ];
  }
};

export default replaceSequence;
