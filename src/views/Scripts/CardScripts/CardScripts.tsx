import Card from "@/components/ui/Card";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetScriptByIdQuery,
  useSoftDeleteScriptByIdMutation,
  useUpdateScriptByIdMutation,
} from "@/services/RtkQueryService";
import { Loading } from "@/components/shared";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import { ToastType } from "@/@types/toast";
import { Button, Radio, toast } from "@/components/ui";
import Notification from "@/components/ui/Notification";
import { FormEssence } from "@/@types/form";
import { HiEye, HiPencil, HiTrash } from "react-icons/hi";
import CustomerInfoField from "@/components/ui/CustomerInfoField";
import { Script, TableTextConst } from "@/@types";
import FormScripts from "@/views/Scripts/FormScripts";
import methodInsert from "@/utils/methodInsertBread";
import { useAppSelector } from "@/store";
import routePrefix from "@/configs/routes.config/routePrefix";

const RadioComponent = ({ value }: any) => {
  return (
    <Radio.Group disabled={true} value={value} key={value}>
      <Radio value="Да">Да</Radio>
      <Radio value="Нет">Нет</Radio>
    </Radio.Group>
  );
};

const CardScripts = () => {
  const permissions: any = useAppSelector(
    (state) => state.auth.user.role?.permissions,
  );
  const updateKey = `api.v1.crm.${TableTextConst.SCRIPT}.update`;
  const deleteSoftKey = `api.v1.crm.${TableTextConst.SCRIPT}.delete_soft`;
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(false);
  const searchParams = new URLSearchParams(location.search);
  const isEditPage = searchParams.get("editPage");
  const isDuplicatePage = searchParams.get("duplicate");

  const { data, isLoading } = useGetScriptByIdQuery(id as string);
  const [UpdateData] = useUpdateScriptByIdMutation();
  const [SoftDeleteScript] = useSoftDeleteScriptByIdMutation();

  const openNotification = (type: ToastType, text: string) => {
    toast.push(
      <Notification title={t(`toast.title.${type}`)} type={type}>
        {text}
      </Notification>,
    );
  };

  const handleUpdate = async (form: FormEssence<Script>) => {
    try {
      await UpdateData({ id: id, ...form }).unwrap();
      openNotification(
        ToastType.SUCCESS,
        t(`toast.message.${TableTextConst.SCRIPT}.update`),
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
    const deletedItem: any = await SoftDeleteScript(id);
    if (!deletedItem?.data.error) {
      openNotification(
        ToastType.SUCCESS,
        t(`toast.message.${TableTextConst.SCRIPT}.delete`),
      );
      navigate(`${routePrefix.script}`);
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
            {t(`${TableTextConst.SCRIPT}Page.card.title`)} {data?.data.name}
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
        {isEdit ? (
          <FormScripts
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
                  title={t("formInput.scripts.id")}
                  value={data?.data.int_id || t("global.noDataAvailable")}
                />
                <CustomerInfoField
                  title={t("formInput.scripts.name")}
                  value={data?.data.name || t("global.noDataAvailable")}
                />
                <CustomerInfoField
                  title={t("formInput.scripts.script")}
                  value={data?.data.text || t("global.noDataAvailable")}
                />
                <CustomerInfoField
                  title={t("formInput.scripts.script_location")}
                  value={
                    data?.data?.script_location?.value ||
                    t("global.noDataAvailable")
                  }
                />
                {data?.data.script_location.key === "TRANSFER" && (
                  <CustomerInfoField
                    title={t("formInput.scripts.types_transfers")}
                    value={
                      data?.data?.type?.value || t("global.noDataAvailable")
                    }
                  />
                )}
                <CustomerInfoField
                  title={t("formInput.scripts.question")}
                  value={
                    ((data && data.data?.questions?.length > 0 && (
                      <div>
                        {data.data.questions.map(
                          (question: any, index: number) => {
                            return (
                              <div key={index} style={{ marginBottom: "12px" }}>
                                <p>
                                  {index + 1} - {question.text}
                                </p>
                                <RadioComponent value={question.reply} />
                              </div>
                            );
                          },
                        )}
                      </div>
                    )) as any) || t("global.noDataAvailable")
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

export default CardScripts;
