import Card from "@/components/ui/Card";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetDeveloperByIdQuery,
  useSoftDeleteDeveloperByIdMutation,
  useUpdateDeveloperByIdMutation,
} from "@/services/RtkQueryService";
import { Loading } from "@/components/shared";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import { ToastType } from "@/@types/toast";
import { Button, toast } from "@/components/ui";
import Notification from "@/components/ui/Notification";
import { FormEssence } from "@/@types/form";
import { HiEye, HiPencil, HiTrash } from "react-icons/hi";
import FormDevelopers from "@/views/Developers/FormDevelopers";
import CustomerInfoField from "@/components/ui/CustomerInfoField";
import { omit } from "lodash";
import { Developer, TableTextConst } from "@/@types";
import routePrefix from "@/configs/routes.config/routePrefix";
import methodInsert from "@/utils/methodInsertBread";
import { useAppSelector } from "@/store";

const CardDeveloper = () => {
  const permissions: any = useAppSelector(
    (state) => state.auth.user.role?.permissions,
  );
  const updateKey = `api.v1.crm.${TableTextConst.DEVELOPERS}.update`;
  const deleteSoftKey = `api.v1.crm.${TableTextConst.DEVELOPERS}.delete_soft`;
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [isEdit, setIsEdit] = useState(false);
  const searchParams = new URLSearchParams(location.search);
  const isEditPage = searchParams.get("editPage");
  const isDuplicatePage = searchParams.get("duplicate");

  const { data, isLoading } = useGetDeveloperByIdQuery(id as string);
  const [UpdateData] = useUpdateDeveloperByIdMutation();
  const [SoftDeleteDeveloper] = useSoftDeleteDeveloperByIdMutation();

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

  const handleUpdate = async (form: FormEssence<Developer>) => {
    try {
      await UpdateData({ id: id, ...form }).unwrap();
      openNotification(
        ToastType.SUCCESS,
        t(`toast.message.${TableTextConst.DEVELOPERS}.update`),
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
    const deletedItem: any = await SoftDeleteDeveloper(id);
    if (!deletedItem?.data.error) {
      openNotification(
        ToastType.SUCCESS,
        t(`toast.message.${TableTextConst.DEVELOPERS}.delete`),
      );
      navigate(`${routePrefix.developer}`);
    }
  };

  useEffect(() => {
    if (isEditPage) {
      setIsEdit(true);
    }
  }, []);

  return (
    <Loading loading={!data && isLoading} type="cover">
      {/* {methodInsert(document.getElementById("breadcrumbs"), data?.data.name)} */}
      <>
        <div className="mb-1 flex justify-between items-center w-full">
          <h3 className="mb-2 text-base">
            {t(`${TableTextConst.DEVELOPERS}Page.card.title`)} {data?.data.name}
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
                onClick={() => handleDelete(id as string)}
              />
            {/* )} */}
          </div>
        </div>

        {isEdit ? (
          <FormDevelopers
            duplicate={isDuplicatePage}
            data={formData}
            onNextChange={handleUpdate}
            isLoadingEndpoint={isLoading}
            isEdit
          />
        ) : (
          <Card>
            <div className="flex flex-col xl:justify-between h-full 2xl:min-w-[360px] mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-y-4 gap-x-4">
                <CustomerInfoField
                  title={t("formInput.residentialComplexes.id")}
                  value={data?.data.int_id || t("global.noDataAvailable")}
                />
                <CustomerInfoField
                  title={t("formInput.residentialComplexes.name")}
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

export default CardDeveloper;
