import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { Loading } from "@/components/shared";
import Card from "@/components/ui/Card";
import { Button, toast } from "@/components/ui";
import { HiEye, HiPencil, HiTrash } from "react-icons/hi";
import CustomerInfoField from "@/components/ui/CustomerInfoField";

import {
  useGetSettingByIdQuery,
  useSoftDeleteSettingByIdMutation,
  useUpdateSettingByIdMutation,
} from "@/services/RtkQueryService";
import Notification from "@/components/ui/Notification";

import { ToastType } from "@/@types/toast";
import { Setting, TableTextConst } from "@/@types";
import FormSettings from "../FormSettings";
import routePrefix from "@/configs/routes.config/routePrefix";
import methodInsert from "@/utils/methodInsertBread";
import { useAppSelector } from "@/store";

const CardSettings = () => {
  const permissions: any = useAppSelector(
    (state) => state.auth.user.role?.permissions,
  );
  const updateKey = `api.v1.crm.${TableTextConst.SETTINGS}.update`;
  const deleteSoftKey = `api.v1.crm.${TableTextConst.SETTINGS}.delete_soft`;
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const searchParams = new URLSearchParams(location.search);
  const isEditPage = searchParams.get("editPage");
  const isDuplicatePage = searchParams.get("duplicate");

  const { data, isLoading } = useGetSettingByIdQuery(id as string);
  const [UpdateData] = useUpdateSettingByIdMutation();
  const [SoftDeleteSetting] = useSoftDeleteSettingByIdMutation();

  const openNotification = (type: ToastType, text: string) => {
    toast.push(
      <Notification title={t(`toast.title.${type}`)} type={type}>
        {text}
      </Notification>,
    );
  };

  const handleUpdate = async (form: Partial<Setting>) => {
    try {
      await UpdateData({
        id,
        ...form,
      } as any).unwrap();
      openNotification(
        ToastType.SUCCESS,
        t(`toast.message.${TableTextConst.SETTINGS}.update`),
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
    const deletedItem: any = await SoftDeleteSetting(id);
    if (!deletedItem?.data.error) {
      openNotification(
        ToastType.SUCCESS,
        t(`toast.message.${TableTextConst.SETTINGS}.delete`),
      );
      navigate(`${routePrefix.settings}`);
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
            {t(`${TableTextConst.SETTINGS}Page.card.title`)} {data?.data.name}
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
          <FormSettings
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
                  title={t("formInput.settings.name")}
                  value={data?.data.name || t("global.noDataAvailable")}
                />
                <CustomerInfoField
                  title={t("formInput.settings.key")}
                  value={data?.data.key || t("global.noDataAvailable")}
                />
                <CustomerInfoField
                  title={t("formInput.settings.value")}
                  value={data?.data.value || t("global.noDataAvailable")}
                />
              </div>
            </div>
          </Card>
        )}
      </>
    </Loading>
  );
};

export default CardSettings;
