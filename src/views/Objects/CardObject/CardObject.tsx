import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { Loading } from "@/components/shared";
import Card from "@/components/ui/Card";
import { Button, toast } from "@/components/ui";
import { HiEye, HiPencil, HiTrash } from "react-icons/hi";
import CustomerInfoField from "@/components/ui/CustomerInfoField";

import {
  useGetRealEstateObjectByIdQuery,
  useSoftDeleteRealEstateObjectByIdMutation,
  useUpdateRealEstateObjectByIdMutation,
} from "@/services/RtkQueryService";
import Notification from "@/components/ui/Notification";

import { useEffect, useState } from "react";
import { ToastType } from "@/@types/toast";
import { RealEstateObject, TableTextConst } from "@/@types";
import routePrefix from "@/configs/routes.config/routePrefix";
import FormObject from "../FormObject";
import methodInsert from "@/utils/methodInsertBread";
import { useAppSelector } from "@/store";

const CardObject = () => {
  const permissions: any = useAppSelector(
    (state) => state.auth.user.role?.permissions,
  );
  const updateKey = `api.v1.crm.${TableTextConst.REAL_ESTATE_OBJECT}.update`;
  const deleteSoftKey = `api.v1.crm.${TableTextConst.REAL_ESTATE_OBJECT}.delete_soft`;
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const searchParams = new URLSearchParams(location.search);
  const isEditPage = searchParams.get("editPage");
  const isDuplicatePage = searchParams.get("duplicate");

  const { data, isLoading } = useGetRealEstateObjectByIdQuery(id as string);
  const [UpdateData] = useUpdateRealEstateObjectByIdMutation();
  const [SoftDeleteRealEstateObject] =
    useSoftDeleteRealEstateObjectByIdMutation();
  const openNotification = (type: ToastType, text: string) => {
    toast.push(
      <Notification title={t(`toast.title.${type}`)} type={type}>
        {text}
      </Notification>,
    );
  };

  const handleUpdate = async (form: Partial<RealEstateObject>) => {
    try {
      await UpdateData({
        id,
        ...form,
      }).unwrap();
      openNotification(
        ToastType.SUCCESS,
        t(`toast.message.${TableTextConst.REAL_ESTATE_OBJECT}.update`),
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
    const deletedItem: any = await SoftDeleteRealEstateObject(id);
    if (!deletedItem?.data.error) {
      openNotification(
        ToastType.SUCCESS,
        t(`toast.message.${TableTextConst.REAL_ESTATE_OBJECT}.delete`),
      );
      navigate(`${routePrefix.real_estate_object}`);
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
        data?.data?.real_estate_building.name,
      )}
      <>
        <div className="mb-1 flex justify-between items-center w-full">
          <h3 className="mb-2 text-base">
            {t(`${TableTextConst.REAL_ESTATE_OBJECT}Page.card.title`)}{" "}
            {data?.data?.real_estate_building.name}
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
          <FormObject
            duplicate={isDuplicatePage}
            data={data?.data as any}
            onNextChange={handleUpdate}
            isLoadingEndpoint={isLoading}
            isEdit
          />
        ) : (
          <Card>
            <div className="flex flex-col xl:justify-between h-full 2xl:min-w-[360px] mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-y-4 gap-x-4">
                <CustomerInfoField
                  title={t("formInput.realEstateObject.id")}
                  value={data?.data.id || t("global.noDataAvailable")}
                />
                <CustomerInfoField
                  title={t("formInput.realEstateObject.name")}
                  value={
                    data?.data.real_estate_building.name ||
                    t("global.noDataAvailable")
                  }
                />
                <CustomerInfoField
                  title={t("formInput.realEstateObject.roominess")}
                  value={
                    data?.data.roominess.value || t("global.noDataAvailable")
                  }
                />
                <CustomerInfoField
                  title={t("formInput.realEstateObject.type")}
                  value={data?.data.type.value || t("global.noDataAvailable")}
                />
                <CustomerInfoField
                  title={t("formInput.realEstateObject.finishing")}
                  value={
                    data?.data.finishing.value || t("global.noDataAvailable")
                  }
                />
                <CustomerInfoField
                  title={t("formInput.realEstateObject.square")}
                  value={data?.data.square || t("global.noDataAvailable")}
                />
                <CustomerInfoField
                  title={t("formInput.realEstateObject.price")}
                  value={data?.data.price || t("global.noDataAvailable")}
                />
                {/* <CustomerInfoField
                  title={t("formInput.realEstateObject.priceForMeters")}
                  value={
                    data?.data.priceForMeters || t("global.noDataAvailable")
                  }
                /> */}
                <CustomerInfoField
                  title={t("formInput.realEstateObject.deadline")}
                  value={
                    data?.data.deadline.value
                    // `${extractYearAndQuarter(data?.data.deadline)
                    //   ?.quarter} квартал${"  "}${extractYearAndQuarter(
                    //   data?.data.deadline,
                    // )?.year} г.` || t("global.noDataAvailable")
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

export default CardObject;
