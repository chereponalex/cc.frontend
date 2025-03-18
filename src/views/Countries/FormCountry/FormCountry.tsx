import { useTranslation } from "react-i18next";
import { FormEssenceCountry } from "@/@types/form";
import { CreatNewFormCountryProps } from "@/@types/props";

import { Loading } from "@/components/shared";
import { Field, Form, Formik } from "formik";
import { Button, Card } from "@/components/ui";
import { FormItem, FormContainer } from "@/components/ui/Form";

import Input from "@/components/ui/Input";
import { useMemo } from "react";
import { validationSchemaCountry } from "@/utils/validationForm";
import { TableTextConst } from "@/@types";
import { useAppDispatch } from "@/store";
import { setDrawerState } from "@/store/slices/actionState";

const FormCountry = ({
  data,
  isEdit = false,
  onNextChange,
  isLoadingEndpoint,
}: CreatNewFormCountryProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const onNext = (values: FormEssenceCountry) => {
    onNextChange?.(values);
    dispatch(setDrawerState(false));
  };

  const initialValues: FormEssenceCountry = useMemo(() => {
    return {
      name: data?.name || "",
    };
  }, [data]);

  return (
    <Loading type="cover">
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={validationSchemaCountry}
        onSubmit={(values) => onNext(values)}
      >
        {({ values, touched, errors }) => {
          return (
            <Form>
              <FormContainer>
                <Card>
                  <FormItem
                    label={t("formInput.countries.name")}
                    // TODO
                    //@ts-ignore
                    invalid={errors.name && touched.name}
                    //@ts-ignore
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
                      : t(`${TableTextConst.COUNTRY}Page.buttons.createNew`)}
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
export default FormCountry;
