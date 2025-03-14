import Card from "@/components/ui/Card";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetWorkTimeByIdQuery,
  useSoftDeleteWorkTimeByIdMutation,
  useUpdateWorkTimeByIdMutation,
} from "@/services/RtkQueryService";
import { Loading } from "@/components/shared";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import { ToastType } from "@/@types/toast";
import { Button, toast } from "@/components/ui";
import Notification from "@/components/ui/Notification";
import { HiEye, HiPencil, HiTrash } from "react-icons/hi";
import { FormEssence } from "@/@types/form";
import CustomerInfoField from "@/components/ui/CustomerInfoField";
import { omit } from "lodash";
import { TableTextConst, WorkTime } from "@/@types";
import FormWorkingHour from "@/views/WorkingHours/FormWorkingHour";
import methodInsert from "@/utils/methodInsertBread";
import { useAppSelector } from "@/store";
import routePrefix from "@/configs/routes.config/routePrefix";

const daysOfTheWeekOptions = [
  { label: "Все дни", value: 0 },
  { label: "Понедельник", value: 1 },
  { label: "Вторник", value: 2 },
  { label: "Среда", value: 3 },
  { label: "Четверг", value: 4 },
  { label: "Пятница", value: 5 },
  { label: "Суббота", value: 6 },
  { label: "Воскресенье", value: 7 },
];

const CardWorkingHour = () => {
  const permissions: any = useAppSelector(
    (state) => state.auth.user.role?.permissions,
  );
  const updateKey = `api.v1.crm.${TableTextConst.WORK_TIME}.update`;
  const deleteSoftKey = `api.v1.crm.${TableTextConst.WORK_TIME}.delete_soft`;
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [isEdit, setIsEdit] = useState(false);
  const searchParams = new URLSearchParams(location.search);
  const isEditPage = searchParams.get("editPage");

  const { data, isLoading } = useGetWorkTimeByIdQuery(id as string);
  const [UpdateData] = useUpdateWorkTimeByIdMutation();
  const [SoftDeleteWorkTime] = useSoftDeleteWorkTimeByIdMutation();
  const openNotification = (type: ToastType, text: string) => {
    toast.push(
      <Notification title={t(`toast.title.${type}`)} type={type}>
        {text}
      </Notification>,
    );
  };

  const formData = useMemo(() => {
    return data ? omit(data.data, ["id", "links"]) : data;
  }, [data]);

  const handleUpdate = async (form: FormEssence<WorkTime>) => {
    try {
      await UpdateData({ id: id, ...form }).unwrap();
      openNotification(
        ToastType.SUCCESS,
        t(`toast.message.${TableTextConst.WORK_TIME}.update`),
      );
      setIsEdit(false);
    } catch (error) {
      openNotification(
        ToastType.WARNING,
        (error as { message: string }).message,
      );
    }
  };

  const handleDelete = async (id: string) => {
    const deletedItem: any = await SoftDeleteWorkTime(id);
    if (!deletedItem?.data.error) {
      openNotification(
        ToastType.SUCCESS,
        t(`toast.message.${TableTextConst.WORK_TIME}.delete`),
      );
      navigate(`${routePrefix.work_time}`);
    }
  };

  useEffect(() => {
    if (isEditPage) {
      setIsEdit(true);
    }
  }, []);

  return (
    <Loading loading={!data && isLoading} type="cover">
      {methodInsert(
        document.getElementById("breadcrumbs"),
        data?.data.offer.name,
      )}
      <>
        <div className="mb-8">
          <h3 className="mb-2">
            {t(`${TableTextConst.WORK_TIME}Page.card.title`)}
          </h3>
        </div>
        <div className="my-4 flex justify-end flex-col xl:flex-row gap-2">
          {isEdit ? (
            <Button
              shape="circle"
              variant="plain"
              size="md"
              icon={<HiEye />}
              onClick={() => setIsEdit((prev) => !prev)}
            />
          ) : (
            permissions[updateKey] && (
              <Button
                shape="circle"
                variant="plain"
                size="md"
                icon={<HiPencil />}
                onClick={() => setIsEdit((prev) => !prev)}
              />
            )
          )}
          {permissions[deleteSoftKey] && (
            <Button
              shape="circle"
              variant="plain"
              size="md"
              icon={<HiTrash />}
              onClick={() => handleDelete(id as string)}
            />
          )}
        </div>
        {isEdit ? (
          <FormWorkingHour
            data={formData}
            onNextChange={handleUpdate}
            isLoadingEndpoint={isLoading}
            isEdit
          />
        ) : (
          <Card>
            <div className="flex flex-col xl:justify-between h-full 2xl:min-w-[360px] mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-y-4 gap-x-4">
                <CustomerInfoField
                  title={t("formInput.workingHours.offer")}
                  value={data?.data.offer.name || t("global.noDataAvailable")}
                />
                <CustomerInfoField
                  title={t("formInput.workingHours.daysOfTheWeek")}
                  value={
                    daysOfTheWeekOptions.find(
                      (el) => el.value === data?.data.day,
                    )?.label || t("global.noDataAvailable")
                  }
                />
                <CustomerInfoField
                  title={t("formInput.workingHours.timeStart")}
                  value={data?.data.start || t("global.noDataAvailable")}
                />
                <CustomerInfoField
                  title={t("formInput.workingHours.timeEnd")}
                  value={data?.data.end || t("global.noDataAvailable")}
                />
              </div>
            </div>
          </Card>
        )}
      </>
    </Loading>
  );
};

export default CardWorkingHour;
