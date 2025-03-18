import { useTranslation } from "react-i18next";
import {
  useCreatNewDeveloperMutation,
  useGetDeveloperByIdQuery,
} from "@/services/RtkQueryService";
import { Loading } from "@/components/shared";
import { toast } from "@/components/ui";
import Notification from "@/components/ui/Notification";
import { ToastType } from "@/@types/toast";
import FormDevelopers from "@/views/Developers/FormDevelopers";
import { FormEssence } from "@/@types/form";
import { useNavigate, useParams } from "react-router-dom";
import { useMemo } from "react";
import { omit } from "lodash";
import { Developer, TableTextConst } from "@/@types";
import routePrefix from "@/configs/routes.config/routePrefix";
import methodInsert from "@/utils/methodInsertBread";

const CreatNewDevelopers = ({ item }: any) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
console.log(item, 'item')
  // const { data, isLoading } = useGetDeveloperByIdQuery(id as string, {
  //   skip: !id,
  // });
  const [creatNew, { isLoading: isLoadingCreate }] =
    useCreatNewDeveloperMutation();

  const openNotification = (type: ToastType, text: string) => {
    toast.push(
      <Notification title={t(`toast.title.${type}`)} type={type}>
        {text}
      </Notification>
    );
  };

  const handleCreatNew = async (form: FormEssence<Developer>) => {
    try {
      await creatNew(form).unwrap();
      openNotification(
        ToastType.SUCCESS,
        t(`toast.message.${TableTextConst.DEVELOPERS}.create`)
      );
      navigate(`${routePrefix.developer}`);
    } catch (error) {
      openNotification(
        ToastType.WARNING,
        (error as { message: string }).message
      );
    }
  };

  return (
    <Loading /* loading={isLoading} type="cover" */>
      {/* {methodInsert(document.getElementById("breadcrumbs"), data?.data.name)} */}
      <FormDevelopers
        data={item}
        onNextChange={handleCreatNew}
        isLoadingEndpoint={isLoadingCreate}
      />
    </Loading>
  );
};

export default CreatNewDevelopers;
