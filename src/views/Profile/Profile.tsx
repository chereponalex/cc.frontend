import { useState } from "react";

import { TypeTabProfile } from "@/@types/tabs";
import Tabs from "@/components/ui/Tabs";
import { useTranslation } from "react-i18next";

import FormChangePass from "./FormChangePass/FormChangePass";
import CardProfile from "./CardProfile/CardProfile";
import { useUpdateEmployeeIdMutation } from "@/services/RtkQueryService";
import { updateUser, useAppDispatch, useAppSelector } from "@/store";
import { ToastType } from "@/@types/toast";
import { toast } from "@/components/ui";
import Notification from "@/components/ui/Notification";
import { Employee } from "@/@types";

const { TabNav, TabList, TabContent } = Tabs;

const Profile = () => {
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = useState<string>(TypeTabProfile.PROFILE);
  const { user } = useAppSelector((state) => state.auth);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const [UpdateData, { isLoading }] = useUpdateEmployeeIdMutation();

  const openNotification = (type: ToastType, text: string) => {
    toast.push(
      <Notification title={t(`toast.title.${type}`)} type={type}>
        {text}
      </Notification>,
    );
  };

  const handleUpdate = async (form: Partial<Employee>, typeSubmit: string) => {
    try {
      const formUpdate =
        typeSubmit === "profile" ? { ...form } : { password: form.newPassword };
      const result = await UpdateData({
        id: user?.id,
        ...formUpdate,
      }).unwrap();
      if (result.data && typeSubmit === "profile") {
        const { first_name, last_name, role, email } = result.data;
        dispatch(updateUser({ first_name, last_name, role, email }));
        openNotification(ToastType.SUCCESS, t(`toast.message.employee.update`));
        setIsEdit(false);
      }
      if (result.data && typeSubmit === "password") {
        openNotification(ToastType.SUCCESS, t(`toast.message.password.update`));
        setCurrentTab(TypeTabProfile.PROFILE);
      }
    } catch (error) {
      openNotification(
        ToastType.WARNING,
        (error as { message: string }).message,
      );
    }
  };

  return (
    <Tabs value={currentTab} onChange={(val) => setCurrentTab(val)}>
      <TabList>
        <TabNav value={TypeTabProfile.PROFILE}>{t("tabsText.profile")}</TabNav>
        <TabNav value={TypeTabProfile.PASSWORD}>
          {t("tabsText.password")}
        </TabNav>
      </TabList>
      <div className="py-4">
        <TabContent value={TypeTabProfile.PROFILE}>
          <h3 className="mb-4">Общая информация</h3>
          <CardProfile
            isLoading={isLoading}
            onNextChange={handleUpdate}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
          />
        </TabContent>
        <TabContent value={TypeTabProfile.PASSWORD}>
          <h3 className="mb-4">Смена пароля</h3>
          <FormChangePass onNextChange={handleUpdate} isLoading={isLoading} />
        </TabContent>
      </div>
    </Tabs>
  );
};

export default Profile;
