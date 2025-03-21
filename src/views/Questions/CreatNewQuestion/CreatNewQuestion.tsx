import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
  useCreatNewQuestionMutation,
  useGetQuestionByIdQuery,
} from "@/services/RtkQueryService";
import { Loading } from "@/components/shared";
import Notification from "@/components/ui/Notification";
import { toast } from "@/components/ui";
import { ToastType } from "@/@types/toast";
import FormObject from "../FormQuestion";
import routePrefix from "@/configs/routes.config/routePrefix";
import { TableTextConst } from "@/@types";
import methodInsert from "@/utils/methodInsertBread";
import { useAppDispatch } from "@/store";
import { setDrawerState } from "@/store/slices/actionState";

const CreatNewQuestion = ({ item }: any) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [creatNew, { isLoading: isLoadingCreate }] =
    useCreatNewQuestionMutation();

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
      openNotification(
        ToastType.SUCCESS,
        t(`toast.message.${TableTextConst.QUESTION}.create`),
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
    <Loading /* loading={isLoading && isLoadingCreate} type="cover" */>
      <FormObject
        data={item}
        onNextChange={handleCreatNew}
        // isLoadingEndpoint={isLoadingCreate}
      />
    </Loading>
  );
};

export default CreatNewQuestion;
