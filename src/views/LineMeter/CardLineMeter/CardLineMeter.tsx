import Card from "@/components/ui/Card";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetMetroLineByIdQuery,
  useSoftDeleteMetroLineByIdMutation,
  useUpdateMetroLineByIdMutation,
} from "@/services/RtkQueryService";
import { Loading } from "@/components/shared";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { ToastType } from "@/@types/toast";
import { Button, toast } from "@/components/ui";
import Notification from "@/components/ui/Notification";
import { FormEssenceLineMeter } from "@/@types/form";
import { HiEye, HiPencil, HiTrash } from "react-icons/hi";
import CustomerInfoField from "@/components/ui/CustomerInfoField";
import FormLineMeter from "@/views/LineMeter/FormLineMeter";
import { UpdateLineMeterResponse } from "@/@types/requestRtk";
import { TableTextConst, TypeField } from "@/@types";
import routePrefix from "@/configs/routes.config/routePrefix";
import methodInsert from "@/utils/methodInsertBread";
import { useAppSelector } from "@/store";

const CardMetroLine = () => {
  const permissions: any = useAppSelector(
    (state) => state.auth.user.role?.permissions,
  );
  const updateKey = `api.v1.crm.${TableTextConst.METRO_LINE}.update`;
  const deleteSoftKey = `api.v1.crm.${TableTextConst.METRO_LINE}.delete_soft`;
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [isEdit, setIsEdit] = useState(false);
  const searchParams = new URLSearchParams(location.search);
  const isEditPage = searchParams.get("editPage");
  const isDuplicatePage = searchParams.get("duplicate");

  const { data, isLoading } = useGetMetroLineByIdQuery(id as string);
  const [UpdateData] = useUpdateMetroLineByIdMutation();
  const [SoftDeleteMetroLine] = useSoftDeleteMetroLineByIdMutation();

  const openNotification = (type: ToastType, text: string) => {
    toast.push(
      <Notification title={t(`toast.title.${type}`)} type={type}>
        {text}
      </Notification>,
    );
  };

  const handleUpdate = async (form: FormEssenceLineMeter) => {
    try {
      await UpdateData({ id: id, ...form } as UpdateLineMeterResponse).unwrap();
      openNotification(
        ToastType.SUCCESS,
        t(`toast.message.${TableTextConst.METRO_LINE}.update`),
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
    const deletedItem: any = await SoftDeleteMetroLine(id);
    if (!deletedItem?.data.error) {
      openNotification(
        ToastType.SUCCESS,
        t(`toast.message.${TableTextConst.METRO_LINE}.delete`),
      );
      navigate(`${routePrefix.metro_line}`);
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
            {t(`${TableTextConst.METRO_LINE}Page.card.title`)} {data?.data.name}
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
          <FormLineMeter
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
                  title={t("formInput.lineMeters.city")}
                  value={data?.data?.city?.name || t("global.noDataAvailable")}
                />
                <CustomerInfoField
                  title={t("formInput.lineMeters.color")}
                  value={data?.data.color || t("global.noDataAvailable")}
                  type={TypeField.COLOR}
                />
                <CustomerInfoField
                  title={t("formInput.lineMeters.name")}
                  value={data?.data.name || t("global.noDataAvailable")}
                />
                <CustomerInfoField
                  title={t("formInput.lineMeters.type")}
                  value={
                    data?.data.line_type.value || t("global.noDataAvailable")
                  }
                />
              </div>
            </div>
          </Card>
        )}
      </>
    </Loading>
  );
};

export default CardMetroLine;
