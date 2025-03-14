import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
  useCreatNewGroupMutation,
  useGetGroupByIdQuery,
} from "@/services/RtkQueryService";
import { Loading } from "@/components/shared";
import Notification from "@/components/ui/Notification";

import { toast } from "@/components/ui";
import { ToastType } from "@/@types/toast";

import { FormEssence } from "@/@types/form";
import { Setting, TableTextConst } from "@/@types";
import routePrefix from "@/configs/routes.config/routePrefix";
import FormGroup from "../FormGroup";
import TableGroup from "@/components/shared/TableGroup";
import methodInsert from "@/utils/methodInsertBread";

const CreatNewGroup = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useGetGroupByIdQuery(id as string, {
    skip: !id,
  });
  const [creatNew, { isLoading: isLoadingCreate }] = useCreatNewGroupMutation();

  const openNotification = (type: ToastType, text: string) => {
    toast.push(
      <Notification title={t(`toast.title.${type}`)} type={type}>
        {text}
      </Notification>,
    );
  };

  const handleCreatNew = async (form: FormEssence<any>) => {
    try {
      await creatNew(form).unwrap();
      openNotification(
        ToastType.SUCCESS,
        t(`toast.message.${TableTextConst.GROUPS}.create`),
      );
      navigate(`${routePrefix.groups}`);
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
      <FormGroup
        isEdit
        data={data?.data}
        onNextChange={handleCreatNew}
        isLoadingEndpoint={isLoadingCreate}
      />
    </Loading>
  );
};

export default CreatNewGroup;
