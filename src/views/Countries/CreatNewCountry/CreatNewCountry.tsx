import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
  useCreatNewCountryMutation,
  useGetCountryByIdQuery,
} from "@/services/RtkQueryService";
import { Loading } from "@/components/shared";
import Notification from "@/components/ui/Notification";
import { toast } from "@/components/ui";
import { ToastType } from "@/@types/toast";
import FormCountry from "../FormCountry";
import { TableTextConst } from "@/@types";
import routePrefix from "@/configs/routes.config/routePrefix";
import methodInsert from "@/utils/methodInsertBread";

const CreatNewCountry = ({ item }: any) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [creatNew, { isLoading: isLoadingCreate }] =
    useCreatNewCountryMutation();

  const openNotification = (type: ToastType, text: string) => {
    toast.push(
      <Notification title={t(`toast.title.${type}`)} type={type}>
        {text}
      </Notification>
    );
  };

  const handleCreatNew = async (form: any) => {
    try {
      await creatNew(form).unwrap();
      openNotification(
        ToastType.SUCCESS,
        t(`toast.message.${TableTextConst.COUNTRY}.create`)
      );
      navigate(`${routePrefix.country}`);
    } catch (error) {
      openNotification(
        ToastType.WARNING,
        (error as { message: string }).message
      );
    }
  };

  return (
    <FormCountry
      data={item}
      onNextChange={handleCreatNew}
      isLoadingEndpoint={isLoadingCreate}
    />
  );
};

export default CreatNewCountry;
