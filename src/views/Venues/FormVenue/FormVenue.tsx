import { useTranslation } from "react-i18next";
import { Field, Form, Formik } from "formik";
import { FormItem, FormContainer } from "@/components/ui/Form";
import Input from "@/components/ui/Input";
import { Button, Card, Checkbox } from "@/components/ui";
import { useNavigate } from "react-router-dom";
import { CreatNewFormProps } from "@/@types/props";
import { validationSchemaVenue } from "@/utils/validationForm";
import { FormEssence } from "@/@types/form";
import { Marketplace } from "@/@types";
import routePrefix from "@/configs/routes.config/routePrefix";

const FormVenue = ({
  data = {
    name: "",
    expert_mode: false,
  } as any,
  isEdit = false,
  onNextChange,
  isLoadingEndpoint,
}: CreatNewFormProps<FormEssence<Marketplace>>) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onNext = (values: FormEssence<Marketplace>) => {
    onNextChange?.(values);
  };

  return (
    <Formik
      initialValues={data}
      enableReinitialize={true}
      validationSchema={validationSchemaVenue}
      onSubmit={(values) => onNext(values)}
    >
      {({ touched, errors }) => {
        return (
          <Form>
            <FormContainer>
              <Card>
                <FormItem
                  noPadding
                  label={t("formInput.venues.name")}
                  invalid={errors.name && touched.name}
                  errorMessage={errors.name}
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
                  // noPadding
                  label={t("formInput.venues.expertMode")}
                  invalid={errors.expert_mode && touched.expert_mode}
                  errorMessage={errors.expert_mode}
                  layout="horizontal"
                >
                  <Field name="expert_mode" component={Checkbox} />
                </FormItem>
              </Card>

              <div className="flex justify-end mt-4 gap-2">
                <Button
                  type="button"
                  onClick={() => navigate(`${routePrefix.marketplace}`)}
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
                    : t("marketplacePage.buttons.createNew")}
                </Button>
              </div>
            </FormContainer>
          </Form>
        );
      }}
    </Formik>
  );
};

export default FormVenue;
