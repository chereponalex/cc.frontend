import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
  useCreatNewRegionMutation,
  useGetRegionByIdQuery,
} from "@/services/RtkQueryService";
import { Loading } from "@/components/shared";
import Notification from "@/components/ui/Notification";

import { toast } from "@/components/ui";
import { ToastType } from "@/@types/toast";

import FormRegion from "../FormRegion";
import { FormEssence } from "@/@types/form";
import { Region, TableTextConst } from "@/@types";
import routePrefix from "@/configs/routes.config/routePrefix";
import methodInsert from "@/utils/methodInsertBread";

const CreatNewRegion = ({ item }: any) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [creatNew, { isLoading: isLoadingCreate }] =
    useCreatNewRegionMutation();

  const openNotification = (type: ToastType, text: string) => {
    toast.push(
      <Notification title={t(`toast.title.${type}`)} type={type}>
        {text}
      </Notification>,
    );
  };

  const handleCreatNew = async (form: FormEssence<Region>) => {
    try {
      await creatNew(form).unwrap();
      openNotification(
        ToastType.SUCCESS,
        t(`toast.message.${TableTextConst.REGION}.create`),
      );
      navigate(`${routePrefix.region}`);
    } catch (error) {
      openNotification(
        ToastType.WARNING,
        (error as { message: string }).message,
      );
    }
  };

  return (
    <FormRegion
      data={item}
      onNextChange={handleCreatNew}
      isLoadingEndpoint={isLoadingCreate}
    />
  );
};

export default CreatNewRegion;
