import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { CreatNewFormRoleProps } from "@/@types/props";
import routePrefix from "@/configs/routes.config/routePrefix";
import { TableTextConst } from "@/@types";

import { FormItem, FormContainer } from "@/components/ui/Form";
import Input from "@/components/ui/Input";
import { validationSchemaRole } from "@/utils/validationForm";
import { Button, Card } from "@/components/ui";
import { Field, Form, Formik } from "formik";

import { Loading } from "@/components/shared";
import {
  useCreatNewRoleMutation,
  useGetRouterListQuery,
} from "@/services/RtkQueryService";
import TablePermissions from "@/components/shared/TablePermissions";
import { useAppSelector } from "@/store";
import useDarkMode from "@/utils/hooks/useDarkmode";
import navigationConfig from "@/configs/navigation.config";

const FormRole = ({
  data,
  isEdit = false,
  onNextChange,
  isLoadingEndpoint,
  isEditPage,
  duplicate,
}: CreatNewFormRoleProps) => {
  const [isDark] = useDarkMode();
  const { mode } = useAppSelector((state) => state.theme);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [permissionsValues, setPermissionsValues] = useState<any>({});
  useEffect(() => {
    setPermissionsValues(data?.permissions || {});
  }, [data]);

  //@ts-ignore
  const { data: dataAllRoutes, isLoading: router } = useGetRouterListQuery();

  const onNext = (values: any, e: any) => {
    let specificKeys = { ...dataAllRoutes?.data };
    let navTree: any[] = [];
    let notSelectValue: any = {};
    const permissionHost = "api.v1.crm";

    for (const key in specificKeys) {
      if (key.startsWith("api.v1")) {
        delete specificKeys[key];
      }
    }
    navigationConfig.map((el: any) => {
      if (el.subMenu.length > 0) {
        el.subMenu.map((subEl: any) => {
          navTree.push(`${permissionHost}.${subEl.permissionKey}.create`);
          navTree.push(`${permissionHost}.${subEl.permissionKey}.view`);
          navTree.push(`${permissionHost}.${subEl.permissionKey}.update`);
          navTree.push(`${permissionHost}.${subEl.permissionKey}.delete_soft`);

          delete specificKeys[subEl.matchingKey];
        });
      }
      return {};
    });

    navTree.forEach((key) => {
      if (!(key in permissionsValues)) {
        notSelectValue[key] = false;
      }
    });

    let notIncludesTablePermissions: any = {};
    Object.values(specificKeys).forEach((item: any) => {
      for (const key in item) {
        if (item.hasOwnProperty(key)) {
          const element = item[key];
          notIncludesTablePermissions[element.permission_key] = true;
        }
      }
    });

    const updatedPermissions = {
      ...permissionsValues,
      ...notSelectValue,
    };

    if (
      updatedPermissions.hasOwnProperty(`${permissionHost}.transfer.create`)
    ) {
      updatedPermissions[`${permissionHost}.transfer.create_report`] =
        updatedPermissions[`${permissionHost}.transfer.create`];
    } else {
      updatedPermissions[`${permissionHost}.transfer.create_report`] = false;
    }
    if (Object.keys(updatedPermissions).length > 0) {
      onNextChange?.({
        ...values,
        //TODO ломается таблица если я добавляю notIncludesTablePermissions
        permissions: updatedPermissions /* {
          ...permissionsValues,
          ...notSelectValue,
          // ...notIncludesTablePermissions,
        }, */,
      });
    }
  };

  const initialValues: any = useMemo(() => {
    return {
      name: data?.name || "",
      permissions: permissionsValues,
    };
  }, [data]);
  return (
    <Loading type="cover">
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={validationSchemaRole}
        onSubmit={(values, e) => onNext(values, e)}
      >
        {({ values, touched, errors }) => {
          return (
            <Form>
              <FormContainer>
                <Card>
                  {/* {(isEdit && isEditPage) || !isEdit ? (
                    <CustomerInfoField
                      title={t("formInput.roles.name")}
                      value={data?.name || t("global.noDataAvailable")}
                    />
                  ) : ( */}
                  <FormItem
                    noPadding
                    label={t("formInput.roles.name")}
                    invalid={errors.name && (touched.name as any)}
                    errorMessage={errors.name as any}
                    layout="horizontal"
                    asterisk
                  >
                    <Field
                      size="xs"
                      type="text"
                      autoComplete="off"
                      name="name"
                      placeholder="Название роли"
                      component={Input}
                    />
                  </FormItem>
                  {/* )} */}

                  <FormItem
                    label={t("formInput.roles.access")}
                    layout="vertical"
                    asterisk
                  >
                    <TablePermissions
                      permissionsValues={permissionsValues}
                      isEdit={isEdit}
                      isEditPage={isEditPage}
                      setPermissionsValues={setPermissionsValues}
                    />
                  </FormItem>
                </Card>
                <div
                  className="flex justify-end mt-4 gap-2"
                  // style={{
                  //   padding: "10px",
                  //   position: "sticky",
                  //   bottom: 0,
                  //   zIndex: 10,
                  //   borderTop: "1px solid #4b5563",
                  //   background: isDark ? "#1f2937" : "white",
                  // }}
                >
                  <Button
                    type="button"
                    onClick={() => navigate(`${routePrefix.role}`)}
                  >
                    {t("global.close")}
                  </Button>
                  <Button
                    loading={isLoadingEndpoint}
                    variant="solid"
                    type="submit"
                  >
                    {isEdit
                      ? t("global.save")
                      : t(`${TableTextConst.ROLE}Page.buttons.createNew`)}
                  </Button>
                </div>
              </FormContainer>
            </Form>
          );
        }}
      </Formik>
    </Loading>
  );
};

export default FormRole;
