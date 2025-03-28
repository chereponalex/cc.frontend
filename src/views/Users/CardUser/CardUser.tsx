import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { Loading } from "@/components/shared";
import Card from "@/components/ui/Card";
import { Button, toast } from "@/components/ui";
import { HiEye, HiPencil, HiTrash } from "react-icons/hi";
import CustomerInfoField from "@/components/ui/CustomerInfoField";

import {
  useGetEmployeesByIdQuery,
  useSoftDeleteEmployeeByIdMutation,
  useUpdateEmployeeIdMutation,
} from "@/services/RtkQueryService";
import Notification from "@/components/ui/Notification";

import { ToastType } from "@/@types/toast";
import { Employee, TableTextConst } from "@/@types";
import FormUser from "../FormUser";
import routePrefix from "@/configs/routes.config/routePrefix";
import methodInsert from "@/utils/methodInsertBread";
import { useAppDispatch, useAppSelector } from "@/store";
import formatDate from "@/utils/formatDate";
import { setDrawerState } from "@/store/slices/actionState";

const CardUser = ({ item }: any) => {
  const dispatch = useAppDispatch();
  const permissions: any = useAppSelector(
    (state) => state.auth.user.role?.permissions,
  );
  const updateKey = `api.v1.crm.${TableTextConst.EMPLOYEE}.update`;
  const deleteSoftKey = `api.v1.crm.${TableTextConst.EMPLOYEE}.delete_soft`;
  const { t } = useTranslation();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const searchParams = new URLSearchParams(location.search);
  const isEditPage = searchParams.get("editPage");
  const isDuplicatePage = searchParams.get("duplicate");

  // const { data, isLoading } = useGetEmployeesByIdQuery(id as string);
  const [UpdateData] = useUpdateEmployeeIdMutation();
  const [SoftDeleteEmployee] = useSoftDeleteEmployeeByIdMutation();

  const openNotification = (type: ToastType, text: string) => {
    toast.push(
      <Notification title={t(`toast.title.${type}`)} type={type}>
        {text}
      </Notification>,
    );
  };

  const handleUpdate = async (form: Partial<Employee>) => {
    try {
      await UpdateData({
        id: item?.id,
        ...form,
      }).unwrap();
      openNotification(ToastType.SUCCESS, t(`toast.message.employee.update`));
      setIsEdit(false);
      dispatch(setDrawerState(false));
    } catch (error) {
      openNotification(
        ToastType.WARNING,
        (error as { message: string }).message,
      );
    }
  };

  const handleDelete = async (id: string) => {
    const deletedItem: any = await SoftDeleteEmployee(id);
    if (!deletedItem?.data.error) {
      openNotification(ToastType.SUCCESS, t(`toast.message.employee.delete`));
      dispatch(setDrawerState(false));
    }
  };

  useEffect(() => {
    if (isEditPage) {
      setIsEdit(true);
    }
  }, []);

  return (
    <Loading /* loading={!data && isLoading} type="cover" */>
      <>
        <div className="mb-1 flex justify-between items-center w-full">
          <h3 className="mb-2 text-base">
            {t(`${TableTextConst.EMPLOYEE}Page.card.title`)} {item?.name}
          </h3>
          <div className="flex justify-end flex-row">
            {isEdit ? (
              <Button
                shape="circle"
                variant="plain"
                size="md"
                icon={<HiEye size={15} />}
                onClick={() => setIsEdit((prev) => !prev)}
              />
            ) : (
              // permissions[updateKey] && (
              <Button
                shape="circle"
                variant="plain"
                size="md"
                icon={<HiPencil size={15} />}
                onClick={() => setIsEdit((prev) => !prev)}
              />
              // )
            )}
            {/* {permissions[deleteSoftKey] && ( */}
            <Button
              shape="circle"
              variant="plain"
              size="md"
              icon={<HiTrash size={15} />}
              onClick={() => handleDelete(item?.id as string)}
            />
            {/* )} */}
          </div>
        </div>
        {isEdit ? (
          <FormUser
            duplicate={isDuplicatePage}
            data={item}
            onNextChange={handleUpdate}
            // isLoadingEndpoint={isLoading}
            isEdit
          />
        ) : (
          <Card>
            <div className="flex flex-col xl:justify-between h-full 2xl:min-w-[360px] mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-y-4 gap-x-4">
                <CustomerInfoField
                  title={t("formInput.employee.id")}
                  value={item?.int_id || t("global.noDataAvailable")}
                />
                <CustomerInfoField
                  title={t("formInput.employee.name")}
                  value={item?.first_name || t("global.noDataAvailable")}
                />
                <CustomerInfoField
                  title={t("formInput.employee.last_name")}
                  value={item?.last_name || t("global.noDataAvailable")}
                />
                <CustomerInfoField
                  title={t("formInput.employee.date_of_birth")}
                  value={
                    formatDate(item?.date_of_birth || "", true) ||
                    t("global.noDataAvailable")
                  }
                />
                <CustomerInfoField
                  title={t("formInput.employee.email")}
                  value={item?.email || t("global.noDataAvailable")}
                />
                <CustomerInfoField
                  title={t("formInput.employee.phone")}
                  value={item?.phone || t("global.noDataAvailable")}
                />
                <CustomerInfoField
                  title={t("formInput.employee.password")}
                  value={item?.password || t("global.noDataAvailable")}
                />
                <CustomerInfoField
                  title={t("formInput.employee.role")}
                  value={item?.role?.name || t("global.noDataAvailable")}
                />
                <CustomerInfoField
                  title={t("formInput.employee.status")}
                  value={item?.status?.name || t("global.noDataAvailable")}
                />
                <CustomerInfoField
                  title={t("formInput.employee.country")}
                  value={item?.country?.name || t("global.noDataAvailable")}
                />
                <CustomerInfoField
                  title={t("formInput.employee.region")}
                  value={item?.region?.name || t("global.noDataAvailable")}
                />
                <CustomerInfoField
                  title={t("formInput.employee.city")}
                  value={item?.city?.name || t("global.noDataAvailable")}
                />
              </div>
            </div>
          </Card>
        )}
      </>
    </Loading>
  );
};

export default CardUser;
