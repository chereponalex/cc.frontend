const pieChartGenerate = (parts: number, color: string, id: string): string => {
  if (parts === 1) {
    return `
      <svg id="svg-${id}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 50 50">
        <circle class="outer-circle" cx="25" cy="25" r="25" fill="${color[0]}" />
        <circle class="inner-circle" cx="25" cy="25" r="16" fill="${color[0]}" />
      </svg>
    `;
  } else if (parts === 2) {
    return `
    <svg viewBox="0 0 50 50" width="24" height="24">
  <circle cx="25" cy="25" r="25" fill="${color[1]}" />
  <circle cx="25" cy="25" r="25" fill="${color[0]}" clip-path="url(#half-circle)" />
  <circle class="inner-circle" cx="25" cy="25" r="16" fill="none" />
  <defs>
    <clipPath id="half-circle">
      <rect x="25" y="0" width="25" height="50" />
    </clipPath>
  </defs>
</svg>
    `;
  } else {
    return "Invalid parts value";
  }
};

export default pieChartGenerate;
