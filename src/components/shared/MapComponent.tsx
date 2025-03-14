import { useEffect, useRef } from "react";
import { YAMap } from "../../views/ManagerPage/map/map-class";
import "../../views/ManagerPage/index.css";
import { useSearchParams } from "react-router-dom";

export const MapComponent = ({ data, loading }: MapProps) => {
  const initialized = useRef(false);
  const [queryParams, setQueryParams] = useSearchParams();
  const pointId = queryParams.get("pointId");
  const geo = [59.9, 30.34];
  const renderMap = async (geo: number[], zoom?: number) => {
    await YAMap.initMap(geo, zoom);
    initialized.current = true;
  };

  const renderMarkers = (markers: any) => {
    YAMap.markers(markers, (marker) => {
      setQueryParams((prev) => {
        prev.set("pointId", marker.id);
        return prev;
      });
    });
  };

  const changeZoom = async (city: any) => {
    await YAMap.changeZoom([city.latitude, city.longitude], city.zoom);
  };

  useEffect(() => {
    if (data?.data) {
      if (!initialized.current) {
        renderMap([data?.city.latitude, data?.city.longitude]).then(() => {
          renderMarkers(data.data);
          data?.city && changeZoom(data.city);
        });
      } else {
        renderMarkers(data.data);
        data?.city && changeZoom(data.city);
      }
      initialized.current = true;
    }
  }, [data?.data]);

  return (
    <div
      id="map"
      className={`${loading ? "disabled" : ""}`}
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        zIndex: 2,
        background: "none",
      }}
    ></div>
  );
};
