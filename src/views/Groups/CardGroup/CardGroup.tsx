import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { Loading } from "@/components/shared";
import Card from "@/components/ui/Card";
import { Button, toast } from "@/components/ui";
import { HiEye, HiPencil, HiTrash } from "react-icons/hi";
import CustomerInfoField from "@/components/ui/CustomerInfoField";

import {
  useGetGroupActionInfoQuery,
  useGetGroupByIdQuery,
  useSoftDeleteGroupByIdMutation,
  useUpdateGroupByIdMutation,
} from "@/services/RtkQueryService";
import Notification from "@/components/ui/Notification";

import { ToastType } from "@/@types/toast";
import { TableTextConst } from "@/@types";
import routePrefix from "@/configs/routes.config/routePrefix";
import FormGroup from "../FormGroup";
import TableGroup from "@/components/shared/TableGroup";
import methodInsert from "@/utils/methodInsertBread";

const CardGroup = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const searchParams = new URLSearchParams(location.search);
  const isEditPage = searchParams.get("editPage");
  const isDuplicatePage = searchParams.get("duplicate");

  const { data, isLoading } = useGetGroupByIdQuery(id as string);

  const { data: selectInfo, isLoading: isLoadingSelectInfo } =
    //@ts-ignore
    useGetGroupActionInfoQuery();
  const [UpdateData] = useUpdateGroupByIdMutation();
  const [SoftDeleteGroup] = useSoftDeleteGroupByIdMutation();

  const openNotification = (type: ToastType, text: string) => {
    toast.push(
      <Notification title={t(`toast.title.${type}`)} type={type}>
        {text}
      </Notification>,
    );
  };
  const handleUpdate = async (form: Partial<any>) => {
    try {
      await UpdateData({
        id,
        ...form,
      } as any).unwrap();
      openNotification(
        ToastType.SUCCESS,
        t(`toast.message.${TableTextConst.GROUPS}.update`),
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
    const deletedItem: any = await SoftDeleteGroup(id);
    if (!deletedItem?.data.error) {
      openNotification(
        ToastType.SUCCESS,
        t(`toast.message.${TableTextConst.GROUPS}.delete`),
      );
      navigate(`${routePrefix.groups}`);
    }
  };

  useEffect(() => {
    if (isEditPage) {
      setIsEdit(true);
    }
  }, []);

  return (
    <Loading loading={isLoading} type="cover">
      {methodInsert(document.getElementById("breadcrumbs"), data?.data.name)}
      <>
        <div className="mb-8">
          <h3 className="mb-2">
            {t(`${TableTextConst.GROUPS}Page.card.title`)} {data?.data.name}
          </h3>
        </div>
        <div className="my-4 flex justify-end flex-col xl:flex-row gap-2">
          <Button
            shape="circle"
            variant="plain"
            size="md"
            icon={isEdit ? <HiEye /> : <HiPencil />}
            onClick={() => setIsEdit((prev) => !prev)}
          />
          <Button
            shape="circle"
            variant="plain"
            size="md"
            icon={<HiTrash />}
            onClick={() => handleDelete(id as string)}
          />
        </div>
        {isEdit ? (
          <FormGroup
            duplicate={isDuplicatePage}
            data={data?.data}
            onNextChange={handleUpdate}
            isLoadingEndpoint={isLoading}
            isEdit
          />
        ) : (
          <>
            <Card>
              <div className="flex flex-col xl:justify-between h-full 2xl:min-w-[360px] mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-y-4 gap-x-4">
                  <CustomerInfoField
                    title={t("formInput.group.name")}
                    value={data?.data.name || t("global.noDataAvailable")}
                  />
                </div>
              </div>
            </Card>
            <Card style={{ marginTop: "10px" }}>
              <TableGroup
                view
                dataCollection={
                  //@ts-ignore
                  (data?.data?.employees.map((item: any) => ({
                    ...item,
                    employee_id: item.id,
                    status: item.status.key,
                  })) as any) || []
                }
                selectInfo={selectInfo?.data}
              />
            </Card>
          </>
        )}
      </>
    </Loading>
  );
};

export default CardGroup;
