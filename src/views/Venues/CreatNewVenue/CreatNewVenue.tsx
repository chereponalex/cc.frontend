import { useTranslation } from "react-i18next";
import { useCreatNewMarketplaceMutation } from "@/services/RtkQueryService";
import { Loading } from "@/components/shared";
import { toast } from "@/components/ui";
import Notification from "@/components/ui/Notification";
import { ToastType } from "@/@types/toast";
import { FormEssence } from "@/@types/form";
import { Marketplace, TableTextConst } from "@/@types";
import FormVenue from "@/views/Venues/FormVenue";

import { setDrawerState } from "@/store/slices/actionState";
import { useAppDispatch } from "@/store";

const CreatNewVenue = ({ item }: any) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [creatNew, { isLoading: isLoadingCreate }] =
    useCreatNewMarketplaceMutation();

  const openNotification = (type: ToastType, text: string) => {
    toast.push(
      <Notification title={t(`toast.title.${type}`)} type={type}>
        {text}
      </Notification>,
    );
  };

  const handleCreatNew = async (form: FormEssence<Marketplace>) => {
    try {
      await creatNew(form).unwrap();
      openNotification(
        ToastType.SUCCESS,
        t(`toast.message.${TableTextConst.VENUE}.create`),
      );
      dispatch(setDrawerState(false));
    } catch (error) {
      openNotification(
        ToastType.WARNING,
        (error as { message: string }).message,
      );
    }
  };

  return <FormVenue data={item} onNextChange={handleCreatNew} />;
};

export default CreatNewVenue;
