import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { Loading } from "@/components/shared";
import Card from "@/components/ui/Card";
import { Button, Checkbox, FormItem, Switcher, toast } from "@/components/ui";
import { HiEye, HiPencil, HiTrash } from "react-icons/hi";
import CustomerInfoField from "@/components/ui/CustomerInfoField";

import {
  useGetOfferByIdQuery,
  useSoftDeleteOfferByIdMutation,
  useUpdateOfferByIdMutation,
} from "@/services/RtkQueryService";
import Notification from "@/components/ui/Notification";

import { useEffect, useState } from "react";
import { ToastType } from "@/@types/toast";
import { Offer, TableTextConst } from "@/@types";
import routePrefix from "@/configs/routes.config/routePrefix";
import FormOffer from "../FormOffer";
import TableWorkHoursBindOffer from "@/components/shared/TableWorkHoursBindOffer";
import methodInsert from "@/utils/methodInsertBread";
import { useAppSelector } from "@/store";

const CardOffer = () => {
  const permissions: any = useAppSelector(
    (state) => state.auth.user.role?.permissions,
  );
  const updateKey = `api.v1.crm.${TableTextConst.OFFER}.update`;
  const deleteSoftKey = `api.v1.crm.${TableTextConst.OFFER}.delete_soft`;

  const createKey = `api.v1.crm.${TableTextConst.WORK_TIME}.create`;
  const viewKey = `api.v1.crm.${TableTextConst.WORK_TIME}.view`;
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const searchParams = new URLSearchParams(location.search);
  const isEditPage = searchParams.get("editPage");
  const isDuplicatePage = searchParams.get("duplicate");

  const { data, isLoading, refetch } = useGetOfferByIdQuery(id as string);
  const [UpdateData, { isLoading: updateLoading }] =
    useUpdateOfferByIdMutation();
  const [SoftDelete] = useSoftDeleteOfferByIdMutation();
  const openNotification = (
    type: ToastType,
    text: string,
    duration?: number,
  ) => {
    toast.push(
      <Notification
        duration={duration || 3000}
        title={t(`toast.title.${type}`)}
        type={type}
      >
        {text}
      </Notification>,
    );
  };

  const handleUpdate = async (form: Partial<Offer>) => {
    try {
      const updated = await UpdateData({
        id,
        ...form,
      }).unwrap();
      if (updated?.error && updated?.error.hasOwnProperty("uis")) {
        openNotification(
          ToastType.WARNING,
          t(`toast.message.${TableTextConst.OFFER}.uisErrorUpdate`),
          12000,
        );
      } else {
        openNotification(
          ToastType.SUCCESS,
          t(`toast.message.${TableTextConst.OFFER}.update`),
        );
      }
      setIsEdit(false);
    } catch (error) {
      openNotification(
        ToastType.WARNING,
        (error as { message: string }).message,
      );
    }
  };

  const handleDelete = async (id: string) => {
    const deletedItem: any = await SoftDelete(id);
    if (!deletedItem?.data.error) {
      openNotification(
        ToastType.SUCCESS,
        t(`toast.message.${TableTextConst.OFFER}.delete`),
      );
      navigate(`${routePrefix.offer}`);
    }
  };

  useEffect(() => {
    if (isEditPage) {
      setIsEdit(true);
    }
  }, []);

  return (
    <Loading loading={(!data && isLoading) || updateLoading} type="cover">
      {methodInsert(document.getElementById("breadcrumbs"), data?.data.name)}
      <>
        <div className="mb-1 flex justify-between items-center w-full">
          <h3 className="mb-2 text-base">
            {t(`${TableTextConst.OFFER}Page.card.title`)} {data?.data.name}
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
          <FormOffer
            duplicate={isDuplicatePage}
            data={data?.data as any}
            onNextChange={handleUpdate}
            isLoadingEndpoint={isLoading || updateLoading}
            isEdit
          />
        ) : (
          <>
            <Card>
              <div className="flex flex-col xl:justify-between h-full 2xl:min-w-[360px] mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-y-4 gap-x-4">
                  <CustomerInfoField
                    title={t("formInput.offer.external_id")}
                    value={
                      data?.data.external_id || t("global.noDataAvailable")
                    }
                  />
                  {/* <FormItem
                    label={t("formInput.offer.is_active")}
                    layout="vertical"
                  > */}
                  <CustomerInfoField
                    title={t("formInput.offer.is_active")}
                    value={
                      <Switcher
                        color="green-500"
                        disabled
                        checked={data?.data.is_active}
                      />
                    }
                  />
                  {/* </FormItem> */}
                  <CustomerInfoField
                    title={t("formInput.offer.priority")}
                    value={
                      data?.data.priority?.toString() ||
                      t("global.noDataAvailable")
                    }
                  />
                  <CustomerInfoField
                    title={t("formInput.offer.name")}
                    value={data?.data.name || t("global.noDataAvailable")}
                  />
                  <CustomerInfoField
                    title={t("formInput.offer.expert_mode")}
                    value={
                      <Checkbox
                        disabled
                        checked={data?.data.expert_mode || false}
                      />
                    }
                  />
                  <CustomerInfoField
                    title={t("formInput.offer.marketplace")}
                    value={
                      data?.data.marketplace?.name ||
                      t("global.noDataAvailable")
                    }
                  />
                  <CustomerInfoField
                    title={t("formInput.offer.city")}
                    value={data?.data.city?.name || t("global.noDataAvailable")}
                  />
                  <CustomerInfoField
                    title={t("formInput.offer.real_estate_buildings")}
                    value={
                      data?.data.real_estate_building?.name ||
                      t("global.noDataAvailable")
                    }
                  />
                  <CustomerInfoField
                    title={t("formInput.offer.developer")}
                    value={
                      data?.data.developer?.name || t("global.noDataAvailable")
                    }
                  />
                  <CustomerInfoField
                    title={t("formInput.offer.scripts")}
                    value={
                      (
                        <ul>
                          {Object.entries(data?.data?.scripts || {}).map(
                            ([key, script]: any) => (
                              <li key={script.id} className="mb-2">
                                <h6>Название: {script.name}</h6>
                                <p>
                                  Относится к:{" "}
                                  {script.script_location?.value ||
                                    "Не указано"}
                                </p>
                              </li>
                            ),
                          )}
                        </ul>
                      ) || t("global.noDataAvailable")
                    }
                  />
                  <CustomerInfoField
                    title={t("formInput.offer.price")}
                    value={
                      data?.data.price?.toString() ||
                      t("global.noDataAvailable")
                    }
                  />
                  <CustomerInfoField
                    title={t("formInput.offer.operator_award")}
                    value={
                      data?.data.operator_award.toString() ||
                      t("global.noDataAvailable")
                    }
                  />
                  <CustomerInfoField
                    title={t("formInput.offer.sip_uri")}
                    value={data?.data.sip_uri || t("global.noDataAvailable")}
                  />
                  <CustomerInfoField
                    title={t("formInput.offer.uniqueness_period")}
                    value={
                      data?.data.uniqueness_period?.toString() ||
                      t("global.noDataAvailable")
                    }
                  />
                  <CustomerInfoField
                    title={t("formInput.offer.limit")}
                    value={
                      data?.data.limit?.toString() ||
                      t("global.noDataAvailable")
                    }
                  />
                  <FormItem
                    label={t("formInput.offer.not_looking_for_himself")}
                    layout="vertical"
                  >
                    <Checkbox
                      disabled
                      checked={data?.data.not_looking_for_himself || false}
                    />
                  </FormItem>
                  <FormItem
                    label={t("formInput.offer.client_is_out_of_town")}
                    layout="vertical"
                  >
                    <Checkbox
                      disabled
                      checked={data?.data.client_is_out_of_town || false}
                    />
                  </FormItem>
                </div>
              </div>
              <div className="flex justify-start items-center mb-10">
                {permissions[createKey] && (
                  <>
                    <p className="mr-5">Время работы:</p>
                    <Button
                      // style={{ minWidth: "30%" }}
                      size="xs"
                      type="button"
                      onClick={() =>
                        navigate(
                          `${routePrefix.work_time}/creat-new?offerID=${id}`,
                        )
                      }
                    >
                      {t(`${TableTextConst.OFFER}Page.buttons.redirect`)}
                    </Button>
                  </>
                )}
              </div>
              {!isLoading && permissions[viewKey] && (
                <TableWorkHoursBindOffer
                  refetch={refetch}
                  data={data?.data.work_time}
                />
              )}
            </Card>
          </>
        )}
      </>
    </Loading>
  );
};

export default CardOffer;
