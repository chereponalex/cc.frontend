function timeFormatHHMM(date: Date): string {
  return [date.getHours(), date.getMinutes()]
    .map(function (x) {
      return x < 10 ? "0" + x : x;
    })
    .join(":");
}

export default timeFormatHHMM;
