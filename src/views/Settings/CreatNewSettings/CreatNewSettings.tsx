import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
  useCreatNewSettingMutation,
  useGetSettingByIdQuery,
} from "@/services/RtkQueryService";
import { Loading } from "@/components/shared";
import Notification from "@/components/ui/Notification";

import { toast } from "@/components/ui";
import { ToastType } from "@/@types/toast";

import { FormEssence } from "@/@types/form";
import { Setting, TableTextConst } from "@/@types";
import routePrefix from "@/configs/routes.config/routePrefix";
import FormSettings from "../FormSettings";
import methodInsert from "@/utils/methodInsertBread";

const CreatNewSettings = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useGetSettingByIdQuery(id as string, {
    skip: !id,
  });
  const [creatNew, { isLoading: isLoadingCreate }] =
    useCreatNewSettingMutation();

  const openNotification = (type: ToastType, text: string) => {
    toast.push(
      <Notification title={t(`toast.title.${type}`)} type={type}>
        {text}
      </Notification>,
    );
  };

  const handleCreatNew = async (form: FormEssence<Setting>) => {
    try {
      await creatNew(form).unwrap();
      openNotification(
        ToastType.SUCCESS,
        t(`toast.message.${TableTextConst.SETTINGS}.create`),
      );
      navigate(`${routePrefix.settings}`);
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
      <FormSettings
        data={data?.data}
        onNextChange={handleCreatNew}
        isLoadingEndpoint={isLoadingCreate}
      />
    </Loading>
  );
};

export default CreatNewSettings;
