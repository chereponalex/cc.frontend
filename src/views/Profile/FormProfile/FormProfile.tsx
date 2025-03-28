import { useTranslation } from "react-i18next";

import { Loading } from "@/components/shared";
import { Field, FieldProps, Form, Formik } from "formik";

import Input from "@/components/ui/Input";
import { Button, Select, Card } from "@/components/ui";
import CustomerInfoField from "@/components/ui/CustomerInfoField";

import { FormItem, FormContainer } from "@/components/ui/Form";
import { validationSchemaProfile } from "@/utils/validationForm";
import { useAppSelector } from "@/store";
import { useGetRolesQuery } from "@/services/RtkQueryService";
import { useMemo } from "react";

const FormProfile = ({ onNextChange, setIsEdit, isLoading }: any) => {
  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state.auth);

  // const { data: roles = null, isLoading: isLoadingRoles } = useGetRolesQuery({
  //   per_page: "all",
  // });

  const initialValues = {
    first_name: user?.first_name || "",
    role: user?.role?.name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
  };

  const onNext = (values: any) => {
    const changedValues = {};
    Object.keys(values).forEach((key) => {
      //@ts-ignore
      if (values[key] !== initialValues[key]) {
        //@ts-ignore
        changedValues[key] = values[key];
      }
    });
    onNextChange?.(changedValues, "profile");
  };

  return (
    <Loading type="cover" /*  loading={!roles && isLoadingRoles} */>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={validationSchemaProfile}
        onSubmit={(values) => onNext(values)}
      >
        {({ values, touched, errors }) => {
          return (
            <Form>
              <FormContainer>
                <Card>
                  <FormItem
                    size="xs"
                    label={t("formInput.profile.name")}
                    invalid={errors.first_name && (touched.first_name as any)}
                    errorMessage={errors.first_name as any}
                    layout="vertical"
                    asterisk
                  >
                    <Field
                      size="xs"
                      type="text"
                      autoComplete="off"
                      name="first_name"
                      placeholder=""
                      component={Input}
                    />
                  </FormItem>
                  <FormItem
                    size="xs"
                    label={t("formInput.profile.last_name")}
                    invalid={errors.last_name && (touched.last_name as any)}
                    errorMessage={errors.last_name as any}
                    layout="vertical"
                    asterisk
                  >
                    <Field
                      size="xs"
                      type="text"
                      autoComplete="off"
                      name="last_name"
                      placeholder=""
                      component={Input}
                    />
                  </FormItem>
                  <FormItem
                    label={t("formInput.profile.role")}
                    layout="vertical"
                  >
                    <Field
                      size="xs"
                      type="text"
                      autoComplete="off"
                      name="role"
                      placeholder=""
                      component={Input}
                      disabled
                    />
                  </FormItem>
                  <FormItem
                    label={t("formInput.profile.email")}
                    invalid={errors.email && (touched.email as any)}
                    errorMessage={errors.email as any}
                    layout="vertical"
                    asterisk
                  >
                    <Field
                      size="xs"
                      type="text"
                      autoComplete="off"
                      name="email"
                      placeholder=""
                      component={Input}
                    />
                  </FormItem>
                </Card>
                <>
                  {!isLoading && (
                    <Button
                      className="mt-4"
                      shape="circle"
                      variant="twoTone"
                      size="md"
                      onClick={() => setIsEdit((prev: any) => !prev)}
                    >
                      Закрыть
                    </Button>
                  )}
                  <Button
                    className="mt-4 ml-4"
                    shape="circle"
                    variant="twoTone"
                    size="md"
                    loading={isLoading}
                  >
                    Обновить
                  </Button>
                </>
              </FormContainer>
            </Form>
          );
        }}
      </Formik>
    </Loading>
  );
};

export default FormProfile;
