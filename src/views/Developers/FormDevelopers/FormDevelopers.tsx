import { useTranslation } from "react-i18next";
import { Field, Form, Formik } from "formik";
import { FormItem, FormContainer } from "@/components/ui/Form";
import Input from "@/components/ui/Input";
import { Button, Card } from "@/components/ui";
import { FormEssence, FormEssenceDeveloper } from "@/@types/form";
import { useNavigate } from "react-router-dom";
import { CreatNewFormProps } from "@/@types/props";
import { validationSchemaDeveloper } from "@/utils/validationForm";
import { Developer, TableTextConst } from "@/@types";
import routePrefix from "@/configs/routes.config/routePrefix";

const FormDevelopers = ({
  data,
  isEdit = false,
  onNextChange,
  isLoadingEndpoint,
  duplicate,
}: CreatNewFormProps<FormEssence<Developer>>) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onNext = (values: FormEssenceDeveloper, duplicate: any) => {
    const onlyChangeFields = {} as any;
    if (duplicate === null) {
      Object.keys(values).forEach((key: string) => {
        //@ts-ignore
        if (values[key] !== initialValues[key]) {
          //@ts-ignore
          onlyChangeFields[key] = values[key];
        }
      });
    }
    onNextChange?.(duplicate === null ? onlyChangeFields : values);
  };

  const initialValues = {
    name: data?.name || "",
  };

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={true}
      validationSchema={validationSchemaDeveloper}
      onSubmit={(values) => onNext(values, duplicate)}
    >
      {({ touched, errors }) => {
        return (
          <Form>
            <FormContainer>
              <Card>
                <FormItem
                  bottom={-12}
                  label={t("formInput.developers.name")}
                  invalid={errors.name && (touched.name as boolean)}
                  errorMessage={errors.name as string}
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
              </Card>
              <div className="flex justify-end mt-4 gap-2">
                <Button
                  type="button"
                  onClick={() => navigate(`${routePrefix.developer}`)}
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
                    : t(`${TableTextConst.DEVELOPERS}Page.buttons.createNew`)}
                </Button>
              </div>
            </FormContainer>
          </Form>
        );
      }}
    </Formik>
  );
};

export default FormDevelopers;
