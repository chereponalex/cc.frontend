import FormProfile from "../FormProfile/FormProfile";
import { Loading } from "@/components/shared";
import Card from "@/components/ui/Card";
import { Button } from "@/components/ui";

import CustomerInfoField from "@/components/ui/CustomerInfoField";
import { useTranslation } from "react-i18next";

import { useAppSelector } from "@/store";

const CardProfile = ({ onNextChange, isEdit, setIsEdit, isLoading }: any) => {
  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state.auth);

  return (
    <Loading type="cover">
      {isEdit ? (
        <FormProfile
          isLoading={isLoading}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          onNextChange={onNextChange}
        />
      ) : (
        <>
          <Card>
            <div className="flex flex-col xl:justify-between h-full 2xl:min-w-[360px] mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-y-4 gap-x-4">
                <CustomerInfoField
                  title={t("formInput.profile.name")}
                  value={user?.name || t("global.noDataAvailable")}
                />
                <CustomerInfoField
                  title={t("formInput.profile.last_name")}
                  value={user?.last_name || t("global.noDataAvailable")}
                />
                <CustomerInfoField
                  title={t("formInput.profile.role")}
                  value={user?.role?.name || t("global.noDataAvailable")}
                />
                {/* TODO кейса с руководителем группы нет ещё на бэке */}
                {/* <CustomerInfoField
                  title={t("formInput.profile.supervisor")}
                /> */}
                <CustomerInfoField
                  title={t("formInput.profile.email")}
                  value={user?.email || t("global.noDataAvailable")}
                />
              </div>
            </div>
          </Card>
          {!isEdit ? (
            <Button
              className="mt-4"
              shape="circle"
              variant="twoTone"
              size="md"
              onClick={() => setIsEdit((prev: any) => !prev)}
            >
              Редактировать
            </Button>
          ) : (
            <>
              <Button
                className="mt-4"
                shape="circle"
                variant="twoTone"
                size="md"
                onClick={() => setIsEdit((prev: any) => !prev)}
              >
                Закрыть
              </Button>
              <Button
                className="mt-4"
                shape="circle"
                variant="twoTone"
                size="md"
                onClick={() => setIsEdit((prev: any) => !prev)}
              >
                Обновить
              </Button>
            </>
          )}
        </>
      )}
    </Loading>
  );
};

export default CardProfile;
