import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { Loading } from "@/components/shared";
import Card from "@/components/ui/Card";
import { Button, toast } from "@/components/ui";
import { HiEye, HiPencil, HiTrash } from "react-icons/hi";
import CustomerInfoField from "@/components/ui/CustomerInfoField";

import {
  useGetRegionByIdQuery,
  useSoftDeleteRegionByIdMutation,
  useUpdateRegionByIdMutation,
} from "@/services/RtkQueryService";
import Notification from "@/components/ui/Notification";

import FormRegion from "../FormRegion";
import { useEffect, useState } from "react";
import { ToastType } from "@/@types/toast";
import { Region, TableTextConst } from "@/@types";
import routePrefix from "@/configs/routes.config/routePrefix";
import methodInsert from "@/utils/methodInsertBread";
import { useAppDispatch, useAppSelector } from "@/store";
import { setDrawerState } from "@/store/slices/actionState";

const CardRegion = ({ item }: any) => {
  const permissions: any = useAppSelector(
    (state) => state.auth.user.role?.permissions,
  );
  const updateKey = `api.v1.crm.${TableTextConst.REGION}.update`;
  const deleteSoftKey = `api.v1.crm.${TableTextConst.REGION}.delete_soft`;
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [isEdit, setIsEdit] = useState(false);
  const searchParams = new URLSearchParams(location.search);
  const isEditPage = searchParams.get("editPage");

  // const { data, isLoading } = useGetRegionByIdQuery(id as string);
  const [UpdateData] = useUpdateRegionByIdMutation();
  const [SoftDeleteRegion] = useSoftDeleteRegionByIdMutation();

  const openNotification = (type: ToastType, text: string) => {
    toast.push(
      <Notification title={t(`toast.title.${type}`)} type={type}>
        {text}
      </Notification>,
    );
  };

  const handleUpdate = async (form: Partial<Region>) => {
    try {
      await UpdateData({
        id: item?.id,
        ...form,
      }).unwrap();
      openNotification(
        ToastType.SUCCESS,
        t(`toast.message.${TableTextConst.REGION}.update`),
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
    const deletedItem: any = await SoftDeleteRegion(id);
    if (!deletedItem?.data.error) {
      openNotification(
        ToastType.SUCCESS,
        t(`toast.message.${TableTextConst.REGION}.delete`),
      );
      dispatch(setDrawerState(false));
      // navigate(`${routePrefix.region}`);
    }
  };

  useEffect(() => {
    if (isEditPage) {
      setIsEdit(true);
    }
  }, []);

  return (
    <Loading /* loading={!data && isLoading} type="cover" */>
      {/* {methodInsert(document.getElementById("breadcrumbs"), data?.data.name)} */}
      <>
        <div className="mb-1 flex justify-between items-center w-full">
          <h3 className="mb-2 text-base">
            {t(`${TableTextConst.REGION}Page.card.title`)} {item?.name}
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
          <FormRegion
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
                  title={t("formInput.regions.id")}
                  value={item?.int_id || t("global.noDataAvailable")}
                />
                <CustomerInfoField
                  title={t("formInput.regions.region")}
                  value={item?.name || t("global.noDataAvailable")}
                />
              </div>
            </div>
          </Card>
        )}
      </>
    </Loading>
  );
};

export default CardRegion;
