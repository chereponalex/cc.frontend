import { TypeTabMap } from "@/@types/tabs";
import "./yandex-map.css";
import customMarkers from "@/utils/customMarkers";
import setMarkerActive from "@/utils/setMarkerActive";

export default class Map {
  initialStateWindowYmaps: any;
  map: any;
  lastCircle: any;
  lastMarkers: any;
  constructor() {
    //@ts-ignore
    this.initialStateWindowYmaps = window.ymaps;
    this.map = null;
    this.lastCircle = null;
    this.lastMarkers = null;
    //@ts-ignore
    this.initialized = false;
  }
  // geolocation() {
  //     return new Promise<void>(() => {
  //         this.initialStateWindowYmaps.geolocation.get({
  //             provider: 'browser',
  //             mapStateAutoApply: true
  //         })
  //             .then(function (result: any) {
  //                 result.geoObjects.options.set('preset', 'islands#blueCircleIcon');
  //                 this.map.geoObjects.add(result.geoObjects);
  //             });
  //     })

  // };
  getDistance(firstCoordinates: any, secondCoordinates: any) {
    const distance = this.initialStateWindowYmaps.coordSystem?.geo.getDistance(
      firstCoordinates,
      secondCoordinates,
    );
    return distance.toFixed(0);
  }

  initMap(geoPosition: number[], zoom?: number) {
    return new Promise<void>((resolve, reject) => {
      this.initialStateWindowYmaps.ready(() => {
        try {
          this.map = new this.initialStateWindowYmaps.Map(
            "map",
            {
              center: [geoPosition[0], geoPosition[1]],
              zoom: zoom || 10,
            },
            {
              // provider: "yandex#search",
              searchControlProvider: "yandex#search",
              autoFitToViewport: "always",
            },
          );
          this.map.cursors.push("arrow");
          this.map.controls.remove("geolocationControl"); // удаляем геолокацию
          // this.map.controls.remove("searchControl"); // удаляем поиск
          this.map.controls.remove("trafficControl"); // удаляем контроль трафика
          this.map.controls.remove("typeSelector"); // удаляем тип
          this.map.controls.remove("fullscreenControl"); // удаляем кнопку перехода в полноэкранный режим
          // this.map.controls.remove("zoomControl"); // удаляем контрол зуммирования
          this.map.controls.remove("rulerControl"); // удаляем контрол правил
          // this.map.behaviors.disable(['scrollZoom']); // отключаем скролл карты (опционально)
          if (TypeTabMap.MAP) {
          }
          const inputYM = document.getElementsByClassName(
            "ymaps-2-1-79-controls__control_toolbar",
          );
          const place = document.getElementById("inject-input_ym");
          place?.append(inputYM[0]);
          // const searchControl =
          //   new this.map.controls.SearchControl({
          //     options: {
          //       searchControlProvider: "yandex#search",
          //     },
          //   });
          // this.map.controls?.add(searchControl);

          // searchControl.search("Шоколадница");
          resolve();
        } catch (error) {
          console.error(error);
          reject(error);
        }
      });
    });
  }

  changeZoom(coordinates: [number, number] | [string, string], zoom: number) {
    console.log(coordinates, zoom, "!!!");
    return new Promise<void>((resolve, reject) => {
      try {
        this.map?.setCenter(coordinates, zoom, {
          checkZoomRange: true,
        });
        resolve();
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  }

  circle(range: number, geoPosition: number[]) {
    return new Promise<void>((resolve, reject) => {
      try {
        const myCircle = new this.initialStateWindowYmaps.Circle(
          [
            [
              /* 56.105490, 40.336872 */ geoPosition && geoPosition[0],
              geoPosition && geoPosition[1],
            ],
            range * 1000,
          ],
          {
            // balloonContent: "Радиус круга - 10 км",
            // hintContent: "Подвинь меня"
          },
          {
            fillColor: "#00AAFF33",
            strokeColor: "#00AAFF33",
            strokeOpacity: 1,
            // strokeWidth: 5
          },
        );

        this.map?.geoObjects.remove(this.lastCircle);
        this.map?.geoObjects.add(myCircle);
        this.map?.setBounds(this.map?.geoObjects.getBounds(), {
          checkZoomRange: true,
        });
        this.lastCircle = myCircle;
        resolve();
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  }

  markers(points: any, callback: (point: any) => void) {
    return new Promise<void>((resolve, reject) => {
      try {
        this.lastMarkers?.forEach(
          (item: any) => this.map?.geoObjects.remove(item),
        );
        let placeMarks: any = [];
        let activePointId: string | null = null;

        points.length > 0 &&
          points.forEach((point: MapPoint, index: number) => {
            const currentMark = new this.initialStateWindowYmaps.Placemark(
              ...customMarkers(point, this.initialStateWindowYmaps),
            );
            currentMark.events.add("click", function (e: any) {
              const urlParams = new URLSearchParams(window.location.search);
              const pointId = urlParams.get("pointId");
              setMarkerActive(false, pointId);

              callback(point);
              setMarkerActive(true, point.id);
              if (activePointId) {
                const prevCheck = document.getElementById(
                  `marker-${activePointId}`,
                );
                if (prevCheck) {
                  const prevMarkerFill = prevCheck.querySelector(
                    ".marker-fill",
                  ) as HTMLElement;
                  if (prevMarkerFill) {
                    prevMarkerFill.style.color = "black";
                  }
                }
              }

              const currentCheck = document.getElementById(
                `marker-${point.id}`,
              );

              if (currentCheck) {
                const markerFillElement = currentCheck.querySelector(
                  ".marker-fill",
                ) as HTMLElement;
                if (markerFillElement) {
                  markerFillElement.style.color = "#FFFF";
                }
              }
              activePointId = point.id;
            });

            this.map?.geoObjects.add(currentMark);
            placeMarks.push(currentMark);
          });
        this.lastMarkers = placeMarks;
        resolve();
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  }

  async initialize(geoPosition: any) {
    try {
      await this.initMap(geoPosition);
    } catch (error) {
      console.error("Ошибка при инициализации карты:", error);
    }
  }

  clear() {
    this.map = null;
    this.lastCircle = null;
    this.lastMarkers = null;
    //@ts-ignore
    this.initialized = false;
  }
}

export const YAMap = new Map();

// if (
//   //@ts-ignore
//   e?.target?.id === "modal-hint" ||
//   //@ts-ignore
//   e?.target?.id === "modal-hint-img" ||
//   //@ts-ignore
//   e?.target?.id === "modal-hint-price" ||
//   //@ts-ignore
//   e?.target?.id === "modal-hint-info-modal" ||
//   //@ts-ignore
//   e?.target?.id === "modal-hint-rating-container" ||
//   //@ts-ignore
//   e?.target?.id === "modal-hint-rating" ||
//   //@ts-ignore
//   e?.target?.id === "modal-hint-rating-img"
// ) {
//   store.dispatch(actionModal(true));
//   store.dispatch(actionIDContent(point.id));
// }
