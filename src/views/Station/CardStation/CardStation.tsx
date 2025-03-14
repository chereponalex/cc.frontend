import Card from "@/components/ui/Card";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetMetroStationByIdQuery,
  useSoftDeleteMetroStationByIdMutation,
  useUpdateMetroStationByIdMutation,
} from "@/services/RtkQueryService";
import { Loading } from "@/components/shared";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { ToastType } from "@/@types/toast";
import { Button, toast } from "@/components/ui";
import Notification from "@/components/ui/Notification";
import { FormEssenceMetroStation } from "@/@types/form";
import { HiEye, HiPencil, HiTrash } from "react-icons/hi";
import CustomerInfoField from "@/components/ui/CustomerInfoField";
import FormStation from "@/views/Station/FormStation";
import { UpdateMetroStationResponse } from "@/@types/requestRtk";
import { TableTextConst } from "@/@types";
import routePrefix from "@/configs/routes.config/routePrefix";
import methodInsert from "@/utils/methodInsertBread";
import { useAppSelector } from "@/store";

const CardStation = () => {
  const permissions: any = useAppSelector(
    (state) => state.auth.user.role?.permissions,
  );
  const updateKey = `api.v1.crm.${TableTextConst.METRO_STATION}.update`;
  const deleteSoftKey = `api.v1.crm.${TableTextConst.METRO_STATION}.delete_soft`;
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [isEdit, setIsEdit] = useState(false);
  const searchParams = new URLSearchParams(location.search);
  const isEditPage = searchParams.get("editPage");
  const isDuplicatePage = searchParams.get("duplicate");

  const { data, isLoading } = useGetMetroStationByIdQuery(id as string);
  const [UpdateData] = useUpdateMetroStationByIdMutation();
  const [SoftDeleteMetroStation] = useSoftDeleteMetroStationByIdMutation();

  const openNotification = (type: ToastType, text: string) => {
    toast.push(
      <Notification title={t(`toast.title.${type}`)} type={type}>
        {text}
      </Notification>,
    );
  };

  const handleUpdate = async (form: FormEssenceMetroStation) => {
    try {
      await UpdateData({
        id: id,
        ...form,
      } as UpdateMetroStationResponse).unwrap();
      openNotification(
        ToastType.SUCCESS,
        t(`toast.message.${TableTextConst.METRO_STATION}.update`),
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
    const deletedItem: any = await SoftDeleteMetroStation(id);
    if (!deletedItem?.data.error) {
      openNotification(
        ToastType.SUCCESS,
        t(`toast.message.${TableTextConst.METRO_STATION}.delete`),
      );
      navigate(`${routePrefix.metro_station}`);
    }
  };

  useEffect(() => {
    if (isEditPage) {
      setIsEdit(true);
    }
  }, []);

  return (
    <Loading loading={!data && isLoading} type="cover">
      {methodInsert(document.getElementById("breadcrumbs"), data?.data.name)}
      <>
        <div className="mb-1 flex justify-between items-center w-full">
          <h3 className="mb-2 text-base">
            {t(`${TableTextConst.METRO_STATION}Page.card.title`)}{" "}
            {data?.data.name}
          </h3>
          <div className="mb-1 flex justify-end flex-row">
            {isEdit ? (
              <Button
                shape="circle"
                variant="plain"
                size="md"
                icon={<HiEye size={15} />}
                onClick={() => setIsEdit((prev) => !prev)}
              />
            ) : (
              permissions[updateKey] && (
                <Button
                  shape="circle"
                  variant="plain"
                  size="md"
                  icon={<HiPencil size={15} />}
                  onClick={() => setIsEdit((prev) => !prev)}
                />
              )
            )}
            {permissions[deleteSoftKey] && (
              <Button
                shape="circle"
                variant="plain"
                size="md"
                icon={<HiTrash size={15} />}
                onClick={() => handleDelete(id as string)}
              />
            )}
          </div>
        </div>
        {isEdit ? (
          <FormStation
            duplicate={isDuplicatePage}
            data={data?.data}
            onNextChange={handleUpdate}
            isLoadingEndpoint={isLoading}
            isEdit
          />
        ) : (
          <Card>
            <div className="flex flex-col xl:justify-between h-full 2xl:min-w-[360px] mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-y-4 gap-x-4">
                <CustomerInfoField
                  title={t("formInput.lineMeters.id")}
                  value={data?.data.int_id || t("global.noDataAvailable")}
                />
                <CustomerInfoField
                  title={t("formInput.lineMeters.name")}
                  value={data?.data.name || t("global.noDataAvailable")}
                />
                <CustomerInfoField
                  title={t("formInput.lineMeters.city")}
                  value={data?.data.city.name || t("global.noDataAvailable")}
                />
                <CustomerInfoField
                  title={t("formInput.lineMeters.metroLine")}
                  value={data?.data.line.name || t("global.noDataAvailable")}
                />
              </div>
            </div>
          </Card>
        )}
      </>
    </Loading>
  );
};

export default CardStation;
