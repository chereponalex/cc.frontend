import { useTranslation } from "react-i18next";
import {
  useCreatNewTagMutation,
  useGetTagByIdQuery,
} from "@/services/RtkQueryService";
import { Loading } from "@/components/shared";
import { toast } from "@/components/ui";
import Notification from "@/components/ui/Notification";
import { ToastType } from "@/@types/toast";
import { FormEssence } from "@/@types/form";
import { useNavigate, useParams } from "react-router-dom";
import { useMemo } from "react";
import { omit } from "lodash";
import { TableTextConst, Tag } from "@/@types";
import FormTag from "@/views/Tags/FormTag";
import routePrefix from "@/configs/routes.config/routePrefix";
import methodInsert from "@/utils/methodInsertBread";
import { setDrawerState } from "@/store/slices/actionState";
import { useAppDispatch } from "@/store";

const CreatNewTag = ({ item }: any) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [creatNew, { isLoading: isLoadingCreate }] = useCreatNewTagMutation();

  const openNotification = (type: ToastType, text: string) => {
    toast.push(
      <Notification title={t(`toast.title.${type}`)} type={type}>
        {text}
      </Notification>,
    );
  };

  const handleCreatNew = async (form: FormEssence<Tag>) => {
    try {
      await creatNew(form).unwrap();
      openNotification(
        ToastType.SUCCESS,
        t(`toast.message.${TableTextConst.TAG}.create`),
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
    <Loading loading={isLoadingCreate} type="cover">
      <FormTag data={item} onNextChange={handleCreatNew} />
    </Loading>
  );
};

export default CreatNewTag;
