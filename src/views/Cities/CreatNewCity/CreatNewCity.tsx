import { useTranslation } from "react-i18next";
import {
  useCreatNewCityMutation,
  useGetCityByIdQuery,
} from "@/services/RtkQueryService";
import { Loading } from "@/components/shared";
import { toast } from "@/components/ui";
import Notification from "@/components/ui/Notification";
import { ToastType } from "@/@types/toast";
import FormCity from "@/views/Cities/FormCity";
import { FormEssence } from "@/@types/form";
import { useNavigate, useParams } from "react-router-dom";
import { useMemo } from "react";
import { omit } from "lodash";
import { City, TableTextConst } from "@/@types";
import routePrefix from "@/configs/routes.config/routePrefix";
import methodInsert from "@/utils/methodInsertBread";

const CreatNewCity = ({ item }: any) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [creatNew, { isLoading: isLoadingCreate }] = useCreatNewCityMutation();

  const openNotification = (type: ToastType, text: string) => {
    toast.push(
      <Notification title={t(`toast.title.${type}`)} type={type}>
        {text}
      </Notification>
    );
  };

  const handleCreatNew = async (form: FormEssence<City>) => {
    try {
      await creatNew(form).unwrap();
      openNotification(
        ToastType.SUCCESS,
        t(`toast.message.${TableTextConst.CITY}.create`)
      );
      navigate(`${routePrefix.city}`);
    } catch (error) {
      openNotification(
        ToastType.WARNING,
        (error as { message: string }).message
      );
    }
  };

  return (
    <Loading loading={isLoadingCreate} type="cover">
      <FormCity data={item} onNextChange={handleCreatNew} />
    </Loading>
  );
};

export default CreatNewCity;
