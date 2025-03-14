import Card from "@/components/ui/Card";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetPaymentMethodByIdQuery,
  useSoftDeletePaymentMethodByIdMutation,
  useUpdatePaymentMethodByIdMutation,
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
import { PaymentMethod, TableTextConst } from "@/@types";
import FormPaymentMethod from "@/views/PaymentMethods/FormPaymentMethod";
import methodInsert from "@/utils/methodInsertBread";
import { useAppSelector } from "@/store";
import routePrefix from "@/configs/routes.config/routePrefix";

const CardPaymentMethod = () => {
  const permissions: any = useAppSelector(
    (state) => state.auth.user.role?.permissions,
  );
  const updateKey = `api.v1.crm.${TableTextConst.PAYMENT_METHOD}.update`;
  const deleteSoftKey = `api.v1.crm.${TableTextConst.PAYMENT_METHOD}.delete_soft`;
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [isEdit, setIsEdit] = useState(false);
  const searchParams = new URLSearchParams(location.search);
  const isEditPage = searchParams.get("editPage");

  const { data, isLoading } = useGetPaymentMethodByIdQuery(id as string);
  const [UpdateData] = useUpdatePaymentMethodByIdMutation();
  const [SoftDeletePaymentMethod] = useSoftDeletePaymentMethodByIdMutation();
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

  const handleCreatNew = async (form: FormEssence<PaymentMethod>) => {
    try {
      await UpdateData({ id: id, ...form }).unwrap();
      openNotification(
        ToastType.SUCCESS,
        t(`toast.message.${TableTextConst.PAYMENT_METHOD}.update`),
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
    const deletedItem: any = await SoftDeletePaymentMethod(id);
    if (!deletedItem?.data.error) {
      openNotification(
        ToastType.SUCCESS,
        t(`toast.message.${TableTextConst.PAYMENT_METHOD}.delete`),
      );
      navigate(`${routePrefix.payment_method}`);
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
            {t(`${TableTextConst.PAYMENT_METHOD}Page.card.title`)}{" "}
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
          <FormPaymentMethod
            data={formData}
            onNextChange={handleCreatNew}
            isLoadingEndpoint={isLoading}
            isEdit
          />
        ) : (
          <Card>
            <div className="flex flex-col xl:justify-between h-full 2xl:min-w-[360px] mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-y-4 gap-x-4">
                <CustomerInfoField
                  title={t("formInput.paymentMethods.name")}
                  value={data?.data.name || t("global.noDataAvailable")}
                />
              </div>
            </div>
          </Card>
        )}
      </>
    </Loading>
  );
};

export default CardPaymentMethod;
