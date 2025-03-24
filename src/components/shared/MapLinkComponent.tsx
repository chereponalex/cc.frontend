import ActionLink from "./ActionLink";
import routePrefix from "@/configs/routes.config/routePrefix";
import { FaMapLocationDot } from "react-icons/fa6";
import useStorage from "@/utils/hooks/useStorage";

const MapLinkComponent = () => {
  const defaultCity = useStorage().getItem("defaultCity");

  const onMap = () => {
    console.log("enter");
    if (defaultCity) {
      window.open(`${routePrefix.map}?city=${defaultCity}`, "_blank");
    }
  };
  return (
    <div className="mr-3 cursor-pointer" onClick={onMap}>
      <FaMapLocationDot size={25} /* style={{ marginTop: "2px" }} */ />
    </div>
  );
};

export default MapLinkComponent;
