import { useTranslation } from "react-i18next";
import { Field, FieldProps, Form, Formik } from "formik";
import { FormContainer, FormItem } from "@/components/ui/Form";
import { useMemo, type ComponentType } from "react";
import Input from "@/components/ui/Input";
import { Button, Card, Select } from "@/components/ui";
import { CreatNewFormProps } from "@/@types/props";
import NumericFormatInput from "@/components/ui/NumericFormatInput/NumericFormatInput";
import NumberInput from "@/components/ui/NumberInput/NumberInput";
import { validationSchemaCity } from "@/utils/validationForm";
import { FormEssence } from "@/@types/form";
import { City, SelectInfoCountry, TableTextConst } from "@/@types";
import { useSelectInfoCountriesQuery } from "@/services/RtkQueryService";
import { Loading } from "@/components/shared";
import { setDrawerState } from "@/store/slices/actionState";
import { useAppDispatch } from "@/store";

const FormCity = ({
  data,
  isEdit = false,
  onNextChange,
  isLoadingEndpoint,
}: CreatNewFormProps<FormEssence<City>>) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { data: selectInfo, isLoading: isLoadingSelectInfo } =
    //@ts-ignore
    useSelectInfoCountriesQuery();
  const countries = (selectInfo?.data || []) as SelectInfoCountry[];

  const onNext = (values: FormEssence<City>) => {
    onNextChange?.(values);
    dispatch(setDrawerState(false));
  };

  const initialValues: any = useMemo(() => {
    return {
      name: data?.name || "",
      latitude: data?.latitude || "",
      longitude: data?.longitude || "",
      region_id: data?.region?.id || "",
      country_id: data?.country?.id || "",
    };
  }, [data]);

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={true}
      validationSchema={validationSchemaCity}
      onSubmit={(values) => onNext(values)}
    >
      {({ values, touched, errors }) => {
        return (
          <Loading type="cover" loading={isLoadingSelectInfo}>
            <Form>
              <FormContainer>
                <Card>
                  <FormItem
                    label={t("formInput.cities.name")}
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
                    label={t("formInput.cities.latitude")}
                    invalid={errors.latitude && (touched.latitude as any)}
                    errorMessage={errors.latitude as any}
                    layout="horizontal"
                    asterisk
                  >
                    <Field name="latitude">
                      {({ field, form }: FieldProps) => {
                        return (
                          <NumericFormatInput
                            //@ts-ignore
                            size="xs"
                            form={form}
                            field={field}
                            customInput={NumberInput as ComponentType}
                            placeholder=""
                            onValueChange={(e) => {
                              form.setFieldValue(field.name, e.value);
                            }}
                          />
                        );
                      }}
                    </Field>
                  </FormItem>
                  <FormItem
                    label={t("formInput.cities.longitude")}
                    invalid={errors.longitude && (touched.longitude as boolean)}
                    errorMessage={errors.longitude as string}
                    layout="horizontal"
                    asterisk
                  >
                    <Field name="longitude">
                      {({ field, form }: FieldProps) => {
                        return (
                          <NumericFormatInput
                            //@ts-ignore
                            size="xs"
                            form={form}
                            field={field}
                            customInput={NumberInput as ComponentType}
                            placeholder=""
                            onValueChange={(e) => {
                              form.setFieldValue(field.name, e.value);
                            }}
                          />
                        );
                      }}
                    </Field>
                  </FormItem>
                  <FormItem
                    label={t("formInput.countries.country")}
                    invalid={
                      errors.country_id && (touched.country_id as boolean)
                    }
                    errorMessage={errors.country_id as string}
                    layout="horizontal"
                    asterisk
                  >
                    <Field name="country_id">
                      {({ field, form }: FieldProps) => (
                        <Select
                          noOptionsMessage={() => t(`select.noOptions`)}
                          size="xs"
                          placeholder=""
                          field={field}
                          form={form}
                          options={countries}
                          value={countries.filter((country: any) => {
                            return country.value === values.country_id;
                          })}
                          onChange={(country) => {
                            if (country) {
                              form.setFieldValue(field.name, country.value);
                              form.setFieldValue("region_id", null);
                            }
                          }}
                        />
                      )}
                    </Field>
                  </FormItem>
                  <FormItem
                    label={t("formInput.cities.location")}
                    invalid={errors.region_id && (touched.region_id as boolean)}
                    errorMessage={errors.region_id as string}
                    layout="horizontal"
                    asterisk
                  >
                    <Field name="region_id">
                      {({ field, form }: FieldProps) => {
                        const filteredRegions = values.country_id
                          ? countries.find(
                              (country: any) =>
                                country.value === values.country_id,
                            )?.regions || []
                          : [];
                        return (
                          <Select
                            noOptionsMessage={() => t(`select.noOptions`)}
                            size="xs"
                            placeholder=""
                            field={field}
                            form={form}
                            isDisabled={!values.country_id}
                            options={filteredRegions}
                            value={filteredRegions.filter((region: any) => {
                              return region.value === values.region_id;
                            })}
                            onChange={(region) => {
                              if (region) {
                                form.setFieldValue(field.name, region.value);
                              }
                            }}
                          />
                        );
                      }}
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
                      : t(`${TableTextConst.CITY}Page.buttons.createNew`)}
                  </Button>
                </div>
              </FormContainer>
            </Form>
          </Loading>
        );
      }}
    </Formik>
  );
};

export default FormCity;
