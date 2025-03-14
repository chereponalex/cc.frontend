import { useTranslation } from "react-i18next";
import { useCreatNewBlackListMutation } from "@/services/RtkQueryService";
import { Loading } from "@/components/shared";
import { toast } from "@/components/ui";
import Notification from "@/components/ui/Notification";
import { ToastType } from "@/@types/toast";
import { FormEssenceBlackList } from "@/@types/form";
import { useNavigate } from "react-router-dom";
import FormBlackLists from "@/views/BlackLists/FormBlackLists";
import routePrefix from "@/configs/routes.config/routePrefix";
import methodInsert from "@/utils/methodInsertBread";
import { TableTextConst } from "@/@types";

const CreatNewBlackLists = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [creatNew, { isLoading: isLoadingCreate }] =
    useCreatNewBlackListMutation();

  const openNotification = (type: ToastType, text: string) => {
    toast.push(
      <Notification title={t(`toast.title.${type}`)} type={type}>
        {text}
      </Notification>,
    );
  };

  const handleCreatNew = async (form: FormEssenceBlackList) => {
    const phone = `${form.phoneNumber}`;
    try {
      await creatNew({ phone } as any).unwrap();
      openNotification(
        ToastType.SUCCESS,
        t(`toast.message.${TableTextConst.BLACK_LIST}.create`),
      );
      navigate(`${routePrefix.black_list}`);
    } catch (error) {
      openNotification(
        ToastType.WARNING,
        (error as { message: string }).message,
      );
    }
  };

  return (
    <Loading loading={isLoadingCreate} type="cover">
      {methodInsert(document.getElementById("breadcrumbs"))}
      <FormBlackLists
        onNextChange={handleCreatNew}
        isLoadingEndpoint={isLoadingCreate}
      />
    </Loading>
  );
};

export default CreatNewBlackLists;
