import { City } from "@/@types";
import { ActionLink, Loading } from "@/components/shared";
import routePrefix from "@/configs/routes.config/routePrefix";
import { useGetCitiesQuery } from "@/services/RtkQueryService";
// import useCustomLink from "@/utils/hooks/useCustomLink";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();
  // const { data, isLoading } =
  //   //@ts-ignore
  //   useGetCitiesQuery();

  // const startCity = data?.data.find((city: City) => city.name === "Москва");
  return (
    // <Loading loading={isLoading}>
    <div>Главная страница</div>
    // {/* <ActionLink
    //   to={`${routePrefix.map}?city=${startCity?.id}`}
    //   target="_blank"
    // >
    //   Карта
    // </ActionLink> */}
    // </Loading>
  );
};

export default Home;
