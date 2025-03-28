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
import { useAppDispatch } from "@/store";
import { setDrawerState } from "@/store/slices/actionState";

const CreatNewUser = ({ item }: any) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
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
      dispatch(setDrawerState(false));
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      openNotification(
        ToastType.WARNING,
        (error as { message: string }).message,
      );
    }
  };

  return (
    // <Loading loading={isLoading} type="cover">
    <FormUser
      data={item}
      onNextChange={handleCreatNew}
      isLoadingEndpoint={isLoadingCreate}
    />
    // </Loading>
  );
};

export default CreatNewUser;
