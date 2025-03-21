import { useTranslation } from "react-i18next";
import { Field, Form, Formik } from "formik";
import { FormItem, FormContainer } from "@/components/ui/Form";
import Input from "@/components/ui/Input";
import { Button, Card } from "@/components/ui";
import { useNavigate } from "react-router-dom";
import { CreatNewFormProps } from "@/@types/props";
import { validationSchemaTag } from "@/utils/validationForm";
import { FormEssence } from "@/@types/form";
import { Tag } from "@/@types";
import routePrefix from "@/configs/routes.config/routePrefix";
import { useAppDispatch } from "@/store";
import { setDrawerState } from "@/store/slices/actionState";

const FormTag = ({
  data = {
    name: "",
  } as any,
  isEdit = false,
  onNextChange,
  isLoadingEndpoint,
}: CreatNewFormProps<FormEssence<Tag>>) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const onNext = (values: FormEssence<Tag>) => {
    onNextChange?.(values);
    dispatch(setDrawerState(false));
  };

  return (
    <Formik
      initialValues={data}
      enableReinitialize={true}
      validationSchema={validationSchemaTag}
      onSubmit={(values) => onNext(values)}
    >
      {({ touched, errors }) => {
        return (
          <Form>
            <FormContainer>
              <Card>
                <FormItem
                  bottom={-12}
                  label={t("formInput.tags.name")}
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
              </Card>

              <div className="flex justify-end mt-4 gap-2">
                <Button
                  type="button"
                  onClick={() => dispatch(setDrawerState(false))}
                >
                  {t("global.close")}
                </Button>
                <Button
                  loading={isLoadingEndpoint}
                  variant="solid"
                  type="submit"
                >
                  {isEdit ? t("global.save") : t("tagPage.buttons.createNew")}
                </Button>
              </div>
            </FormContainer>
          </Form>
        );
      }}
    </Formik>
  );
};

export default FormTag;
