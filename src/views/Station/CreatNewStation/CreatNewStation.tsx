import { useTranslation } from "react-i18next";
import {
  useCreatNewMetroStationMutation,
  useGetMetroStationByIdQuery,
} from "@/services/RtkQueryService";
import { Loading } from "@/components/shared";
import { toast } from "@/components/ui";
import Notification from "@/components/ui/Notification";
import { ToastType } from "@/@types/toast";
import { FormEssenceMetroStation } from "@/@types/form";
import { useNavigate, useParams } from "react-router-dom";
import FormStation from "@/views/Station/FormStation";
import { TableTextConst } from "@/@types";
import routePrefix from "@/configs/routes.config/routePrefix";
import methodInsert from "@/utils/methodInsertBread";

const CreatNewStation = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useGetMetroStationByIdQuery(id as string, {
    skip: !id,
  });
  const [creatNew, { isLoading: isLoadingCreate }] =
    useCreatNewMetroStationMutation();

  const openNotification = (type: ToastType, text: string) => {
    toast.push(
      <Notification title={t(`toast.title.${type}`)} type={type}>
        {text}
      </Notification>,
    );
  };

  const handleCreatNew = async (form: FormEssenceMetroStation) => {
    try {
      await creatNew(form).unwrap();
      openNotification(
        ToastType.SUCCESS,
        t(`toast.message.${TableTextConst.METRO_STATION}.create`),
      );
      navigate(`${routePrefix.metro_station}`);
    } catch (error) {
      openNotification(
        ToastType.WARNING,
        (error as { message: string }).message,
      );
    }
  };

  return (
    <Loading loading={isLoading} type="cover">
      {methodInsert(document.getElementById("breadcrumbs"), data?.data.name)}
      <FormStation
        data={data?.data}
        onNextChange={handleCreatNew}
        isLoadingEndpoint={isLoadingCreate}
      />
    </Loading>
  );
};

export default CreatNewStation;
