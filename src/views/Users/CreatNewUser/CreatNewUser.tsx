import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
  useCreatNewEmployeesMutation,
  useGetEmployeesByIdQuery,
} from "@/services/RtkQueryService";
import { Loading } from "@/components/shared";
import Notification from "@/components/ui/Notification";

import { toast } from "@/components/ui";
import { ToastType } from "@/@types/toast";

import FormUser from "../FormUser";
import { FormEssence } from "@/@types/form";
import { Employee } from "@/@types";
import routePrefix from "@/configs/routes.config/routePrefix";
import methodInsert from "@/utils/methodInsertBread";
import axios, { AxiosError, isAxiosError } from "axios";

const CreatNewUser = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useGetEmployeesByIdQuery(id as string, {
    skip: !id,
  });
  const [
    creatNew,
    {
      isLoading: isLoadingCreate,
      error: createUserError,
      isError: isCreateUserError,
    },
  ] = useCreatNewEmployeesMutation();

  const openNotification = (type: ToastType, text: string) => {
    toast.push(
      <Notification title={t(`toast.title.${type}`)} type={type}>
        {text}
      </Notification>,
    );
  };

  const handleCreatNew = async (form: FormEssence<Employee>) => {
    try {
      await creatNew(form).unwrap();
      openNotification(ToastType.SUCCESS, t(`toast.message.employee.create`));
      navigate(`${routePrefix.employee}`);
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      console.log("isCreateUserError ", axiosError);
      openNotification(
        ToastType.WARNING,
        (error as { message: string }).message,
      );
    }
  };

  return (
    <Loading loading={isLoading} type="cover">
      {methodInsert(document.getElementById("breadcrumbs"), data?.data.name)}
      <FormUser
        data={data?.data}
        onNextChange={handleCreatNew}
        isLoadingEndpoint={isLoadingCreate}
      />
    </Loading>
  );
};

export default CreatNewUser;
