import { useTranslation } from "react-i18next";
import {
  useCreatNewRealEstateBuildingMutation,
  useGetRealEstateBuildingByIdQuery,
} from "@/services/RtkQueryService";
import { Loading } from "@/components/shared";
import FormResidentialComplex from "@/views/ResidentialComplexes/FormResidentialComplex";
import { toast } from "@/components/ui";
import Notification from "@/components/ui/Notification";
import { ToastType } from "@/@types/toast";
import { FormEssence } from "@/@types/form";
import { useNavigate, useParams } from "react-router-dom";
import { RealEstateBuilding, TableTextConst } from "@/@types";
import { omit } from "lodash";
import { useMemo } from "react";
import routePrefix from "@/configs/routes.config/routePrefix";
import methodInsert from "@/utils/methodInsertBread";

const CreatNewResidentialComplexes = ({ item }: any) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  // const { data, isLoading } = useGetRealEstateBuildingByIdQuery(id as string, {
  //   skip: !id,
  // });
  const [creatNew, { isLoading: isLoadingCreate }] =
    useCreatNewRealEstateBuildingMutation();

  const openNotification = (type: ToastType, text: string) => {
    toast.push(
      <Notification title={t(`toast.title.${type}`)} type={type}>
        {text}
      </Notification>,
    );
  };

  const handleCreatNew = async (form: FormEssence<RealEstateBuilding>) => {
    try {
      // const images = form.images;
      // const formData = new FormData();
      // images.forEach(img => {
      //   formData.append("images", img);
      // })

      // const otherData = {
      //   ...form,
      //   images: undefined,
      // };

      await creatNew(form as any).unwrap();
      openNotification(
        ToastType.SUCCESS,
        t(`toast.message.${TableTextConst.REALESTATEBUILDING}.create`),
      );
      navigate(`${routePrefix.real_estate_building}`);
    } catch (error) {
      openNotification(
        ToastType.WARNING,
        (error as { message: string }).message,
      );
    }
  };

  return (
    <FormResidentialComplex
      data={item}
      onNextChange={handleCreatNew}
      isLoadingEndpoint={isLoadingCreate}
    />
  );
};

export default CreatNewResidentialComplexes;
