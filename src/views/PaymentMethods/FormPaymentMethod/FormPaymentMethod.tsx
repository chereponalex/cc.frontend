import { useTranslation } from "react-i18next";
import { Field, Form, Formik } from "formik";
import { FormItem, FormContainer } from "@/components/ui/Form";
import Input from "@/components/ui/Input";
import { Button, Card } from "@/components/ui";
import { useNavigate } from "react-router-dom";
import { CreatNewFormProps } from "@/@types/props";
import { validationSchemaTag } from "@/utils/validationForm";
import { FormEssence } from "@/@types/form";
import { PaymentMethod, TableTextConst } from "@/@types";
import routePrefix from "@/configs/routes.config/routePrefix";
import { setDrawerState } from "@/store/slices/actionState";
import { useAppDispatch } from "@/store";

const FormPaymentMethod = ({
  data = {
    name: "",
  } as any,
  isEdit = false,
  onNextChange,
  isLoadingEndpoint,
}: CreatNewFormProps<FormEssence<PaymentMethod>>) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const onNext = (values: FormEssence<PaymentMethod>) => {
    onNextChange?.(values);
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
                  label={t("formInput.paymentMethods.name")}
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
                  {isEdit
                    ? t("global.save")
                    : t(
                        `${TableTextConst.PAYMENT_METHOD}Page.buttons.createNew`,
                      )}
                </Button>
              </div>
            </FormContainer>
          </Form>
        );
      }}
    </Formik>
  );
};

export default FormPaymentMethod;
