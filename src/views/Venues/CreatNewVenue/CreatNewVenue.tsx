import { useTranslation } from "react-i18next";
import {
  useCreatNewMarketplaceMutation,
  useGetMarketplaceByIdQuery,
} from "@/services/RtkQueryService";
import { Loading } from "@/components/shared";
import { toast } from "@/components/ui";
import Notification from "@/components/ui/Notification";
import { ToastType } from "@/@types/toast";
import { FormEssence } from "@/@types/form";
import { useNavigate, useParams } from "react-router-dom";
import { useMemo } from "react";
import { omit } from "lodash";
import { Marketplace, TableTextConst } from "@/@types";
import FormVenue from "@/views/Venues/FormVenue";
import routePrefix from "@/configs/routes.config/routePrefix";
import methodInsert from "@/utils/methodInsertBread";

const CreatNewVenue = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useGetMarketplaceByIdQuery(id as string, {
    skip: !id,
  });
  const [creatNew, { isLoading: isLoadingCreate }] =
    useCreatNewMarketplaceMutation();

  const formData = useMemo(() => {
    return data ? omit(data.data, ["id", "links"]) : data;
  }, [data]);

  const openNotification = (type: ToastType, text: string) => {
    toast.push(
      <Notification title={t(`toast.title.${type}`)} type={type}>
        {text}
      </Notification>,
    );
  };

  const handleCreatNew = async (form: FormEssence<Marketplace>) => {
    try {
      await creatNew(form).unwrap();
      openNotification(
        ToastType.SUCCESS,
        t(`toast.message.${TableTextConst.VENUE}.create`),
      );
      navigate(`${routePrefix.marketplace}`);
    } catch (error) {
      openNotification(
        ToastType.WARNING,
        (error as { message: string }).message,
      );
    }
  };

  return (
    <Loading loading={isLoadingCreate} type="cover">
      {methodInsert(document.getElementById("breadcrumbs"), data?.data.name)}
      <FormVenue
        data={formData}
        onNextChange={handleCreatNew}
        isLoadingEndpoint={isLoading}
      />
    </Loading>
  );
};

export default CreatNewVenue;
