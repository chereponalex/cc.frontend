import { ToastType } from "@/@types/toast";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

import Notification from "@/components/ui/Notification";
import { toast } from "@/components/ui";

import {
  useCreatNewRoleMutation,
  useGetRoleByIdQuery,
} from "@/services/RtkQueryService";
import routePrefix from "@/configs/routes.config/routePrefix";
import { Loading } from "@/components/shared";
import FormRole from "../FormRole/FormRole";
import methodInsert from "@/utils/methodInsertBread";

const CreatNewRole = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useGetRoleByIdQuery(id as string, {
    skip: !id,
  });

  const [creatNew, { isLoading: isLoadingCreate }] = useCreatNewRoleMutation();

  const openNotification = (type: ToastType, text: string) => {
    toast.push(
      <Notification title={t(`toast.title.${type}`)} type={type}>
        {text}
      </Notification>,
    );
  };

  const handleCreatNew = async (form: any) => {
    try {
      await creatNew(form).unwrap();
      openNotification(ToastType.SUCCESS, t(`toast.message.role.create`));
      navigate(`${routePrefix.role}`);
    } catch (error) {
      openNotification(
        ToastType.WARNING,
        (error as { message: string }).message,
      );
    }
  };

  return (
    <Loading /* loading={isLoading}  */ type="cover">
      {methodInsert(document.getElementById("breadcrumbs"), data?.data.name)}
      <FormRole
        data={data?.data}
        onNextChange={handleCreatNew}
        isLoadingEndpoint={isLoadingCreate}
      />
    </Loading>
  );
};

export default CreatNewRole;
