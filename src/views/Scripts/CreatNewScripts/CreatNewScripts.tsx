import { useTranslation } from "react-i18next";
import {
  useCreatNewScriptMutation,
  useGetScriptByIdQuery,
} from "@/services/RtkQueryService";
import { Loading } from "@/components/shared";
import { toast } from "@/components/ui";
import Notification from "@/components/ui/Notification";
import { ToastType } from "@/@types/toast";
import { FormEssence } from "@/@types/form";
import { useNavigate, useParams } from "react-router-dom";
import { Script, TableTextConst } from "@/@types";
import FormScripts from "@/views/Scripts/FormScripts";
import routePrefix from "@/configs/routes.config/routePrefix";
import methodInsert from "@/utils/methodInsertBread";
import { useAppDispatch } from "@/store";
import { setDrawerState } from "@/store/slices/actionState";

const CreatNewScripts = ({ item }: any) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useAppDispatch();

  // const { data, isLoading } = useGetScriptByIdQuery(id as string, {
  //   skip: !id,
  // });
  const [creatNew, { isLoading: isLoadingCreate }] =
    useCreatNewScriptMutation();

  const openNotification = (type: ToastType, text: string) => {
    toast.push(
      <Notification title={t(`toast.title.${type}`)} type={type}>
        {text}
      </Notification>,
    );
  };

  const handleCreatNew = async (form: FormEssence<Script>) => {
    try {
      await creatNew(form).unwrap();
      openNotification(
        ToastType.SUCCESS,
        t(`toast.message.${TableTextConst.SCRIPT}.create`),
      );
      dispatch(setDrawerState(false));
    } catch (error) {
      openNotification(
        ToastType.WARNING,
        (error as { message: string }).message,
      );
    }
  };

  return (
    // <Loading loading={isLoading} type="cover">
    <FormScripts
      data={item}
      onNextChange={handleCreatNew}
      // isLoadingEndpoint={isLoadingCreate}
    />
    // </Loading>
  );
};

export default CreatNewScripts;
