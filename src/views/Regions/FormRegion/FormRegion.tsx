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
import {
  useGetCountriesQuery,
  useSelectInfoCountriesQuery,
} from "@/services/RtkQueryService";
import { SelectInfoCountry, TableTextConst } from "@/@types";
import routePrefix from "@/configs/routes.config/routePrefix";
import { useAppDispatch } from "@/store";
import { setDrawerState } from "@/store/slices/actionState";

const FormRegion = ({
  data,
  isEdit = false,
  onNextChange,
  isLoadingEndpoint,
}: any) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { data: selectInfo = null, isLoading: isLoadingCountries } =
    //@ts-ignore
    useSelectInfoCountriesQuery();
  const countries = (selectInfo?.data || []) as SelectInfoCountry[];
  const onNext = (values: FormEssenceRegion) => {
    onNextChange?.(values);
    dispatch(setDrawerState(false));
  };

  const initialValues: FormEssenceRegion = useMemo(() => {
    return {
      name: data?.name || "",
      country_id: data?.country.id || "",
    };
  }, [data]);

  return (
    <Loading type="cover" loading={!selectInfo && isLoadingCountries}>
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
                          options={countries}
                          value={countries?.filter(
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
