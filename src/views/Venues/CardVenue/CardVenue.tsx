import Card from "@/components/ui/Card";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetMarketplaceByIdQuery,
  useSoftDeleteMarketplaceByIdMutation,
  useUpdateMarketplaceByIdMutation,
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
import { Marketplace, TableTextConst, TypeField } from "@/@types";
import FormVenue from "@/views/Venues/FormVenue";
import methodInsert from "@/utils/methodInsertBread";
import { useAppDispatch, useAppSelector } from "@/store";
import routePrefix from "@/configs/routes.config/routePrefix";
import { setDrawerState } from "@/store/slices/actionState";

const CardVenue = ({ item }: any) => {
  const dispatch = useAppDispatch();
  const permissions: any = useAppSelector(
    (state) => state.auth.user.role?.permissions,
  );
  const updateKey = `api.v1.crm.${TableTextConst.VENUE}.update`;
  const deleteSoftKey = `api.v1.crm.${TableTextConst.VENUE}.delete_soft`;
  const { t } = useTranslation();
  const [isEdit, setIsEdit] = useState(false);
  const searchParams = new URLSearchParams(location.search);
  const isEditPage = searchParams.get("editPage");

  const [UpdateData] = useUpdateMarketplaceByIdMutation();
  const [SoftDeleteMarket] = useSoftDeleteMarketplaceByIdMutation();
  const openNotification = (type: ToastType, text: string) => {
    toast.push(
      <Notification title={t(`toast.title.${type}`)} type={type}>
        {text}
      </Notification>,
    );
  };

  const handleUpdate = async (form: FormEssence<Marketplace>) => {
    try {
      await UpdateData({ id: item?.id, ...form }).unwrap();
      openNotification(
        ToastType.SUCCESS,
        t(`toast.message.${TableTextConst.VENUE}.update`),
      );
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
    const deletedItem: any = await SoftDeleteMarket(id);
    if (!deletedItem?.data.error) {
      openNotification(
        ToastType.SUCCESS,
        t(`toast.message.${TableTextConst.VENUE}.delete`),
      );
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
            {t(`${TableTextConst.VENUE}Page.card.title`)} {item?.name}
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
          <FormVenue
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
                  title={t("formInput.venues.id")}
                  value={item?.int_id}
                />
                <CustomerInfoField
                  title={t("formInput.venues.name")}
                  value={item?.name || t("global.noDataAvailable")}
                />
                {/* <CustomerInfoField
                  title={t("formInput.venues.expertMode")}
                  value={data?.data.expert_mode}
                  type={TypeField.ICON}
                /> */}
              </div>
            </div>
          </Card>
        )}
      </>
    </Loading>
  );
};

export default CardVenue;
