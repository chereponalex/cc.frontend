import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { Loading } from "@/components/shared";
import { Button, toast } from "@/components/ui";
import { HiEye, HiPencil, HiTrash } from "react-icons/hi";

import {
  useGetRoleByIdQuery,
  useSoftDeleteRoleByIdMutation,
  useUpdateRoleByIdMutation,
} from "@/services/RtkQueryService";
import Notification from "@/components/ui/Notification";

import FormRole from "../FormRole";
import { useEffect, useState } from "react";
import { ToastType } from "@/@types/toast";
import { Country, TableTextConst } from "@/@types";
import routePrefix from "@/configs/routes.config/routePrefix";
import methodInsert from "@/utils/methodInsertBread";
import { useAppSelector } from "@/store";

const CardRole = () => {
  const permissions: any = useAppSelector(
    (state) => state.auth.user.role?.permissions,
  );
  const updateKey = `api.v1.crm.${TableTextConst.ROLE}.update`;
  const deleteSoftKey = `api.v1.crm.${TableTextConst.ROLE}.delete_soft`;
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const searchParams = new URLSearchParams(location.search);
  const isEditPage = searchParams.get("editPage");
  const isDuplicatePage = searchParams.get("duplicate");

  const { data, isLoading } = useGetRoleByIdQuery(id as string);
  const [UpdateData] = useUpdateRoleByIdMutation();
  const [SoftDeleteRole] = useSoftDeleteRoleByIdMutation();

  const openNotification = (type: ToastType, text: string) => {
    toast.push(
      <Notification title={t(`toast.title.${type}`)} type={type}>
        {text}
      </Notification>,
    );
  };

  const handleUpdate = async (form: Partial<Country>) => {
    try {
      await UpdateData({
        id,
        ...form,
      }).unwrap();
      openNotification(ToastType.SUCCESS, t(`toast.message.role.update`));
      setIsEdit(false);
    } catch (error) {
      openNotification(
        ToastType.WARNING,
        (error as { message: string }).message,
      );
    }
  };

  const handleDelete = async (id: string) => {
    const deletedItem: any = await SoftDeleteRole(id);
    if (!deletedItem?.data.error) {
      openNotification(
        ToastType.SUCCESS,
        t(`toast.message.${TableTextConst.ROLE}.delete`),
      );
      navigate(`${routePrefix.role}`);
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
        <div className="mb-8">
          <h3 className="mb-2">
            {t(`${TableTextConst.ROLE}Page.card.title`)} {data?.data.name}
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
        <FormRole
          duplicate={isDuplicatePage}
          data={data?.data}
          onNextChange={handleUpdate}
          isLoadingEndpoint={isLoading}
          isEdit={isEdit}
          isEditPage={isEditPage}
        />
        {/* {isEdit ? (
          
        ) : (
          <Card>
            <div className="flex flex-col xl:justify-between h-full 2xl:min-w-[360px] mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-y-4 gap-x-4">
                <CustomerInfoField
                  title={t("formInput.countries.id")}
                  value={data?.data.int_id || t("global.noDataAvailable")}
                />
                <CustomerInfoField
                  title={t("formInput.countries.name")}
                  value={data?.data.name || t("global.noDataAvailable")}
                />
              </div>
            </div>
          </Card>
        )} */}
      </>
    </Loading>
  );
};

export default CardRole;
