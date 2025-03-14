const objectStep: { [key: string]: number } = {
  first: 24,
  second: 49,
  third: 74,
  fourth: 350,
};

const displayStep = (count: number) => {
  const calcPercent = (current: number, min: number, max: number) => {
    return ((current - min) / (max - min)) * 100;
  };

  if (count <= objectStep.first) {
    return {
      display: "24",
      color: "gray-500",
      percent: (count / objectStep.first) * 100,
    };
  } else if (count > objectStep.first && count <= objectStep.second) {
    return {
      display: "49",
      color: "rose-400",
      percent: calcPercent(count, objectStep.first + 1, objectStep.second),
    };
  } else if (count > objectStep.second && count <= objectStep.third) {
    return {
      display: "74",
      color: "green-400",
      percent: calcPercent(count, objectStep.second + 1, objectStep.third),
    };
  } else if (count > objectStep.third) {
    return {
      display: "75+",
      color: "fuchsia-400",
      unlimited: true,
      percent: calcPercent(count, objectStep.third + 1, objectStep.fourth),
    };
  }
  return { display: "0", color: "gray-500", percent: 0 };
};

export default displayStep;
