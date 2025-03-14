import hours_glass from "../assets/svg/hours-glass.svg";
import pieChartGenerate from "./pieChartGenerate";

const customMarkers = (point: MapPoint, yMap: any, clickArea?: any) => {
  const urlParams = new URLSearchParams(window.location.search);
  const pointId = urlParams.get("pointId");
  const { latitude, longitude, objects, is_region, name, deadline, id } = point;
  const hasAward = point?.operator_award && point?.operator_award > 0;
  const location = [latitude, longitude];

  const createLayout = (
    map: any,
    parts: number,
    colors: string,
    hasAward: boolean = false,
  ) => {
    const fillMarker =
      objects?.ready > 0
        ? `<div class="star">${""}</div>`
        : objects?.ready === 0
          ? deadline
            ? deadline
            : ""
          : `<div>${""}</div>`;

    return map.templateLayoutFactory.createClass(`
    <div id=marker-${id} data-award=${hasAward} data-active=${
      pointId === id
    } class="custom-container-marker ${hasAward && "has-award"}">
      <div class="pie-chart">
          ${pieChartGenerate(parts, colors, id)}    
          <span class="marker-fill">
            ${fillMarker}
          </span>
      </div>
      <span class="marker-name">${name}</span>
    </div>`);
  };

  const defaultStyleFunc = (
    partsCount: number,
    colorSign: any,
    hasAward: boolean = false,
  ) => {
    return {
      iconLayout: createLayout(yMap, partsCount, colorSign, hasAward),
      iconShape: {
        type: "Rectangle",
        coordinates: [
          [0, 0],
          [100, 24],
        ],
      },
    };
  };

  if (!is_region && objects?.is_apartments && !objects?.is_flats) {
    return [location, {}, defaultStyleFunc(1, ["red"], Boolean(hasAward))];
  }

  if (!is_region && objects.is_apartments) {
    return [
      location,
      {},
      defaultStyleFunc(2, ["red", "#068809"], Boolean(hasAward)),
    ];
  }
  if (is_region && objects.is_apartments && !objects.is_flats) {
    return [location, {}, defaultStyleFunc(1, ["red"], Boolean(hasAward))];
  }
  if (is_region && objects.is_apartments) {
    return [
      location,
      {},
      defaultStyleFunc(2, ["red", "#1E98FF"], Boolean(hasAward)),
    ];
  } else if (is_region) {
    return [location, {}, defaultStyleFunc(1, ["#1E98FF"], Boolean(hasAward))];
  } else if (!is_region) {
    return [location, {}, defaultStyleFunc(1, ["#068809"], Boolean(hasAward))];
  }

  return [];
};
export default customMarkers;
