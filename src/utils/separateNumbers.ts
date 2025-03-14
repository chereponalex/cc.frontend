export function separateNumbers(number: number) {
  let result = number?.toString().split("");

  for (let i = 1; i < result?.length; i++) {
    if (i % 3 === 0) {
      result[result.length - i] = " " + result[result.length - i];
    }
  }

  return result?.join("");
}
