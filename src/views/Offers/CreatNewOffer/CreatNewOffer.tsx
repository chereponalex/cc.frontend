import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
  useCreatNewOfferMutation,
  useGetOfferByIdQuery,
} from "@/services/RtkQueryService";
import { Loading } from "@/components/shared";
import Notification from "@/components/ui/Notification";
import { toast } from "@/components/ui";
import { ToastType } from "@/@types/toast";
import FormOffer from "../FormOffer";
import routePrefix from "@/configs/routes.config/routePrefix";
import { TableTextConst } from "@/@types";
import methodInsert from "@/utils/methodInsertBread";

const CreatNewOffer = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const objectID = searchParams.get("objectID");

  const { data, isLoading } = useGetOfferByIdQuery(id as string, {
    skip: !id,
  });
  const [creatNew, { isLoading: isLoadingCreate }] = useCreatNewOfferMutation();

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

  const handleCreatNew = async (form: any) => {
    try {
      const created = await creatNew(form).unwrap();
      console.log(created, "created");
      if (created?.error && created?.error.hasOwnProperty("uis")) {
        openNotification(
          ToastType.WARNING,
          t(`toast.message.${TableTextConst.OFFER}.uisErrorCreate`),
          12000,
        );
      } else {
        openNotification(
          ToastType.SUCCESS,
          t(`toast.message.${TableTextConst.OFFER}.create`),
        );
      }
      navigate(
        objectID
          ? `${routePrefix.real_estate_building}/${objectID}`
          : `${routePrefix.offer}`,
      );
    } catch (error) {
      openNotification(
        ToastType.WARNING,
        (error as { message: string }).message,
      );
    }
  };

  return (
    <Loading loading={isLoading && isLoadingCreate} type="cover">
      {methodInsert(document.getElementById("breadcrumbs"), data?.data.name)}
      <FormOffer
        object_id={objectID}
        data={data?.data as any}
        onNextChange={handleCreatNew}
        isLoadingEndpoint={isLoadingCreate}
      />
    </Loading>
  );
};

export default CreatNewOffer;
