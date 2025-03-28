import { useTranslation } from "react-i18next";

import { Loading } from "@/components/shared";
import { Field, Form, Formik } from "formik";

import Input from "@/components/ui/Input";
import { Button, Card } from "@/components/ui";

import { FormItem, FormContainer } from "@/components/ui/Form";
import { validationSchemaChangePass } from "@/utils/validationForm";

const FormChangePass = ({ onNextChange, isLoading }: any) => {
  const { t } = useTranslation();

  const onNext = (values: any) => {
    onNextChange?.(values, "password");
  };

  const initialValues = {
    newPassword: "",
    repeatNewPassword: "",
  };

  return (
    <Loading type="cover">
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={validationSchemaChangePass}
        onSubmit={(values) => onNext(values)}
      >
        {({ values, touched, errors }) => {
          return (
            <Form>
              <FormContainer>
                <Card>
                  {/* <FormItem
                    label={t("formInput.password.pass")}
                    invalid={errors.password && (touched.password as any)}
                    errorMessage={errors.password as any}
                    layout="vertical"
                    asterisk
                  >
                    <Field
                      type="text"
                      autoComplete="off"
                      name="password"
                      placeholder=""
                      component={Input}
                    />
                  </FormItem> */}
                  <FormItem
                    label={t("formInput.password.newPass")}
                    invalid={errors.newPassword && (touched.newPassword as any)}
                    errorMessage={errors.newPassword as any}
                    layout="vertical"
                    asterisk
                  >
                    <Field
                      size="xs"
                      type="text"
                      autoComplete="off"
                      name="newPassword"
                      placeholder=""
                      component={Input}
                    />
                  </FormItem>
                  <FormItem
                    label={t("formInput.password.repeatNewPass")}
                    invalid={
                      errors.repeatNewPassword &&
                      (touched.repeatNewPassword as any)
                    }
                    errorMessage={errors.repeatNewPassword as any}
                    layout="vertical"
                    asterisk
                  >
                    <Field
                      size="xs"
                      type="text"
                      autoComplete="off"
                      name="repeatNewPassword"
                      placeholder=""
                      component={Input}
                    />
                  </FormItem>
                </Card>
                <Button
                  className="mt-4"
                  shape="circle"
                  variant="twoTone"
                  size="md"
                  loading={isLoading}
                >
                  Обновить
                </Button>
              </FormContainer>
            </Form>
          );
        }}
      </Formik>
    </Loading>
  );
};

export default FormChangePass;
