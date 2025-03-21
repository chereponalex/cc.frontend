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
import { useAppDispatch, useAppSelector } from "@/store";
import routePrefix from "@/configs/routes.config/routePrefix";
import { objScriptLocations } from "../Scripts";
import { setDrawerState } from "@/store/slices/actionState";

const RadioComponent = ({ value }: any) => {
  return (
    <Radio.Group disabled={true} value={value} key={value}>
      <Radio value={true}>Да</Radio>
      <Radio value={false}>Нет</Radio>
    </Radio.Group>
  );
};

const CardScripts = ({ item }: any) => {
  const permissions: any = useAppSelector(
    (state) => state.auth.user.role?.permissions,
  );
  const dispatch = useAppDispatch();
  const updateKey = `api.v1.crm.${TableTextConst.SCRIPT}.update`;
  const deleteSoftKey = `api.v1.crm.${TableTextConst.SCRIPT}.delete_soft`;
  const { t } = useTranslation();
  const [isEdit, setIsEdit] = useState(false);
  const searchParams = new URLSearchParams(location.search);
  const isEditPage = searchParams.get("editPage");
  const isDuplicatePage = searchParams.get("duplicate");

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
      await UpdateData({ id: item?.id, ...form }).unwrap();
      openNotification(
        ToastType.SUCCESS,
        t(`toast.message.${TableTextConst.SCRIPT}.update`),
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
    const deletedItem: any = await SoftDeleteScript(id);
    if (!deletedItem?.data.error) {
      openNotification(
        ToastType.SUCCESS,
        t(`toast.message.${TableTextConst.SCRIPT}.delete`),
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
            {t(`${TableTextConst.SCRIPT}Page.card.title`)} {item?.name}
          </h3>
        </div>
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
        {isEdit ? (
          <FormScripts
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
                  title={t("formInput.scripts.id")}
                  value={item?.int_id || t("global.noDataAvailable")}
                />
                <CustomerInfoField
                  title={t("formInput.scripts.name")}
                  value={item?.name || t("global.noDataAvailable")}
                />
                <CustomerInfoField
                  title={t("formInput.scripts.script")}
                  value={item?.text || t("global.noDataAvailable")}
                />
                <CustomerInfoField
                  title={t("formInput.scripts.script_location")}
                  value={
                    objScriptLocations[item?.script_location] ||
                    t("global.noDataAvailable")
                  }
                />
                {item?.script_location.key === "TRANSFER" && (
                  <CustomerInfoField
                    title={t("formInput.scripts.types_transfers")}
                    value={item?.type?.value || t("global.noDataAvailable")}
                  />
                )}
                <CustomerInfoField
                  title={t("formInput.scripts.question")}
                  value={
                    ((item && item?.questions?.length > 0 && (
                      <div>
                        {item.questions.map((question: any, index: number) => {
                          return (
                            <div key={index} style={{ marginBottom: "12px" }}>
                              <p>
                                {index + 1} - {question.text}
                              </p>
                              <RadioComponent value={question.reply} />
                            </div>
                          );
                        })}
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
