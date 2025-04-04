import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
  useCreatNewRealEstateObjectMutation,
  useGetRealEstateObjectByIdQuery,
} from "@/services/RtkQueryService";
import { Loading } from "@/components/shared";
import Notification from "@/components/ui/Notification";
import { toast } from "@/components/ui";
import { ToastType } from "@/@types/toast";
import FormObject from "../FormObject";
import routePrefix from "@/configs/routes.config/routePrefix";
import { TableTextConst } from "@/@types";
import methodInsert from "@/utils/methodInsertBread";
import MenuItem from "antd/es/menu/MenuItem";
import { setDrawerState } from "@/store/slices/actionState";
import { useAppDispatch } from "@/store";

const CreatNewObject = ({ item }: any) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  // const { id } = useParams();
  // const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const objectID = searchParams.get("objectID");

  // const { data, isLoading } = useGetRealEstateObjectByIdQuery(id as string, {
  //   skip: !id,
  // });
  const [creatNew, { isLoading: isLoadingCreate }] =
    useCreatNewRealEstateObjectMutation();

  const openNotification = (type: ToastType, text: string) => {
    toast.push(
      <Notification title={t(`toast.title.${type}`)} type={type}>
        {text}
      </Notification>,
    );
  };

  const handleCreatNew = async (form: any) => {
    try {
      await creatNew(form).unwrap();
      openNotification(
        ToastType.SUCCESS,
        t(`toast.message.${TableTextConst.REAL_ESTATE_OBJECT}.create`),
      );
      dispatch(setDrawerState(false));

      // navigate(
      //   objectID
      //     ? `${routePrefix.real_estate_building}/${objectID}`
      //     : `${routePrefix.real_estate_object}`
      // );
    } catch (error) {
      openNotification(
        ToastType.WARNING,
        (error as { message: string }).message,
      );
    }
  };

  return (
    <Loading /* loading={isLoading} type="cover" */>
      <FormObject
        object_id={objectID}
        data={item}
        onNextChange={handleCreatNew}
        // isLoadingEndpoint={isLoadingCreate}
      />
    </Loading>
  );
};

export default CreatNewObject;
