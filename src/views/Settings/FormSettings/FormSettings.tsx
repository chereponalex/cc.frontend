import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Loading } from "@/components/shared";
import { Field, FieldProps, Form, Formik } from "formik";
import { Button, Card } from "@/components/ui";
import { FormItem, FormContainer } from "@/components/ui/Form";

import Input from "@/components/ui/Input";
import { useMemo } from "react";
import { validationSchemaSettings } from "@/utils/validationForm";
import { TableTextConst } from "@/@types";
import routePrefix from "@/configs/routes.config/routePrefix";

const FormSettings = ({
  data,
  isEdit = false,
  onNextChange,
  isLoadingEndpoint,
  duplicate,
}: any) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onNext = (values: any, duplicate: boolean) => {
    const onlyChangeFields = {} as any;
    if (duplicate === null) {
      Object.keys(values).forEach((key) => {
        if (values[key] !== initialValues[key]) {
          onlyChangeFields[key] = values[key];
        }
      });
    }
    onNextChange?.(duplicate === null ? onlyChangeFields : values);
  };

  const initialValues: any = useMemo(() => {
    return {
      name: data?.name || "",
      key: data?.key || "",
      value: data?.value || "",
    };
  }, [data]);

  return (
    <Loading type="cover">
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={validationSchemaSettings}
        onSubmit={(values) => onNext(values, duplicate)}
      >
        {({ values, touched, errors }) => {
          return (
            <Form>
              <FormContainer>
                <Card>
                  <FormItem
                    label={t("formInput.settings.name")}
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
                      placeholder=""
                      component={Input}
                    />
                  </FormItem>
                  <FormItem
                    label={t("formInput.settings.key")}
                    invalid={errors.key && (touched.key as any)}
                    errorMessage={errors.key as any}
                    layout="horizontal"
                    asterisk
                  >
                    <Field
                      size="xs"
                      type="text"
                      autoComplete="off"
                      name="key"
                      placeholder=""
                      component={Input}
                    />
                  </FormItem>
                  <FormItem
                    label={t("formInput.settings.value")}
                    invalid={errors.value && (touched.value as any)}
                    errorMessage={errors.value as any}
                    layout="horizontal"
                    asterisk
                  >
                    <Field
                      size="xs"
                      type="text"
                      autoComplete="off"
                      name="value"
                      placeholder=""
                      component={Input}
                    />
                  </FormItem>
                </Card>
                <div className="flex justify-end mt-4 gap-2">
                  <Button
                    type="button"
                    onClick={() => navigate(`${routePrefix.settings}`)}
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
                      : t(`${TableTextConst.SETTINGS}Page.buttons.createNew`)}
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
export default FormSettings;
