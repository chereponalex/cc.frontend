import { useTranslation } from "react-i18next";
import {
  useCreatNewWorkTimeMutation,
  useGetWorkTimeByIdQuery,
} from "@/services/RtkQueryService";
import { Loading } from "@/components/shared";
import { toast } from "@/components/ui";
import Notification from "@/components/ui/Notification";
import { ToastType } from "@/@types/toast";
import { FormEssence } from "@/@types/form";
import { useNavigate, useParams } from "react-router-dom";
import { useMemo } from "react";
import { omit } from "lodash";
import { TableTextConst, WorkTime } from "@/@types";
import FormWorkingHour from "@/views/WorkingHours/FormWorkingHour";
import routePrefix from "@/configs/routes.config/routePrefix";
import methodInsert from "@/utils/methodInsertBread";

const CreatNewWorkingHour = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const offerID = searchParams.get("offerID");

  const { data, isLoading } = useGetWorkTimeByIdQuery(id as string, {
    skip: !id,
  });
  const [creatNew, { isLoading: isLoadingCreate }] =
    useCreatNewWorkTimeMutation();

  const formData = useMemo(() => {
    return data ? omit(data.data, ["id", "links"]) : data;
  }, [data]);

  const openNotification = (type: ToastType, text: string) => {
    toast.push(
      <Notification title={t(`toast.title.${type}`)} type={type}>
        {text}
      </Notification>,
    );
  };

  const handleCreatNew = async (form: FormEssence<WorkTime>) => {
    try {
      await creatNew(form).unwrap();
      openNotification(
        ToastType.SUCCESS,
        t(`toast.message.${TableTextConst.WORK_TIME}.create`),
      );
      navigate(
        offerID
          ? `${routePrefix.offer}/${offerID}`
          : `${routePrefix.work_time}`,
      );
    } catch (error) {
      openNotification(
        ToastType.WARNING,
        (error as { message: string }).message,
      );
    }
  };

  return (
    <Loading loading={isLoadingCreate} type="cover">
      {methodInsert(
        document.getElementById("breadcrumbs"),
        data?.data.offer.name,
      )}
      <FormWorkingHour
        //@ts-ignore
        offer_id={offerID as any}
        data={formData}
        onNextChange={handleCreatNew}
        isLoadingEndpoint={isLoading}
      />
    </Loading>
  );
};

export default CreatNewWorkingHour;
