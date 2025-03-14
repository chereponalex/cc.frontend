import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { FormEssenceRegion } from "@/@types/form";

import { Loading } from "@/components/shared";
import { Field, FieldProps, Form, Formik } from "formik";
import { Button, Select, Card } from "@/components/ui";
import { FormItem, FormContainer } from "@/components/ui/Form";

import Input from "@/components/ui/Input";
import { useMemo } from "react";
import { validationSchemaRegion } from "@/utils/validationForm";
import { useGetCountriesQuery } from "@/services/RtkQueryService";
import { TableTextConst } from "@/@types";
import routePrefix from "@/configs/routes.config/routePrefix";

const FormRegion = ({
  data,
  isEdit = false,
  onNextChange,
  isLoadingEndpoint,
}: any) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: countries = null, isLoading: isLoadingCountries } =
    useGetCountriesQuery({
      per_page: "all",
    });
  console.log(countries, "countries");
  const onNext = (values: FormEssenceRegion) => {
    onNextChange?.(values);
  };

  const initialValues: FormEssenceRegion = useMemo(() => {
    return {
      name: data?.name || "",
      country_id: data?.country.id || "",
    };
  }, [data]);

  const optionsCountries = useMemo(() => {
    return countries
      ? countries.data.map((el) => ({ label: el.name, value: el.id }))
      : [];
  }, [countries]);

  return (
    <Loading type="cover" loading={!countries && isLoadingCountries}>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={validationSchemaRegion}
        onSubmit={(values) => onNext(values)}
      >
        {({ values, touched, errors }) => {
          return (
            <Form>
              <FormContainer>
                <Card>
                  <FormItem
                    label={t("formInput.regions.region")}
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
                  <FormItem
                    label={t("formInput.regions.country")}
                    //@ts-ignore
                    invalid={errors.country_id && touched.country_id}
                    //@ts-ignore
                    errorMessage={errors.country_id}
                    layout="horizontal"
                    asterisk
                  >
                    <Field name="country_id">
                      {({ field, form }: FieldProps) => (
                        <Select
                          size="xs"
                          placeholder=""
                          field={field}
                          form={form}
                          options={optionsCountries}
                          value={optionsCountries.filter(
                            (country: any) =>
                              country.value === values.country_id,
                          )}
                          onChange={(country) => {
                            if (country) {
                              form.setFieldValue(field.name, country.value);
                            }
                          }}
                        />
                      )}
                    </Field>
                  </FormItem>
                </Card>
                <div className="flex justify-end mt-4 gap-2">
                  <Button
                    type="button"
                    onClick={() => navigate(`${routePrefix.region}`)}
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
                      : t(`${TableTextConst.REGION}Page.buttons.createNew`)}
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
export default FormRegion;
