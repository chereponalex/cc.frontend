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

const CreatNewQuestion = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useGetQuestionByIdQuery(id as string, {
    skip: !id,
  });
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
      navigate(`${routePrefix.question}`);
    } catch (error) {
      openNotification(
        ToastType.WARNING,
        (error as { message: string }).message,
      );
    }
  };

  return (
    <Loading loading={isLoading && isLoadingCreate} type="cover">
      {methodInsert(document.getElementById("breadcrumbs"), data?.data.text)}
      <FormObject
        data={data?.data as any}
        onNextChange={handleCreatNew}
        isLoadingEndpoint={isLoadingCreate}
      />
    </Loading>
  );
};

export default CreatNewQuestion;
