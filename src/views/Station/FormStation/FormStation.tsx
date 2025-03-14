import { useTranslation } from "react-i18next";
import { Field, FieldProps, Form, Formik } from "formik";
import { FormItem, FormContainer } from "@/components/ui/Form";
import Input from "@/components/ui/Input";
import { Button, Select, Card } from "@/components/ui";
import { FormEssenceMetroStation } from "@/@types/form";
import { useGetMetroStationsActionInfoQuery } from "@/services/RtkQueryService";
import { Loading } from "@/components/shared";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CreatNewFormMetroStationProps } from "@/@types/props";
import { validationSchemaStation } from "@/utils/validationForm";
import { TableTextConst } from "@/@types";
import routePrefix from "@/configs/routes.config/routePrefix";

const FormStation = ({
  data,
  isEdit = false,
  onNextChange,
  isLoadingEndpoint,
  duplicate,
}: CreatNewFormMetroStationProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: selectInfo, isLoading: isLoadingSelectInfo } =
    //@ts-ignore
    useGetMetroStationsActionInfoQuery();
  const cities = selectInfo?.data.cities || {};
  const metroLines = selectInfo?.data.metro_lines || {};

  const optionsCities = useMemo(() => {
    const result = [];

    for (const key1 in cities) {
      for (const key2 in cities[key1]) {
        result.push({ value: key2, label: cities[key1][key2] });
      }
    }
    return result;
  }, [cities]);

  const actualOptions = (dataObj: any) => {
    if (dataObj) {
      return Object.entries(dataObj)?.map(([value, label]) => ({
        label,
        value,
      }));
    }
  };

  const onNext = (values: FormEssenceMetroStation, duplicate: any) => {
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

  const initialValues: FormEssenceMetroStation = useMemo(() => {
    return {
      city_id: data?.city.id || "",
      name: data?.name || "",
      metro_line_id: data?.line.id || undefined,
    };
  }, [data]);

  return (
    <Loading
      loading={(!metroLines || !cities) && isLoadingSelectInfo}
      type="cover"
    >
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={validationSchemaStation}
        onSubmit={(values) => onNext(values, duplicate)}
      >
        {({ values, touched, errors }) => {
          console.log(values, "values");
          return (
            <Form>
              <FormContainer>
                <Card>
                  <FormItem
                    label={t("formInput.metroStations.name")}
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
                    label={t("formInput.metroStations.city")}
                    invalid={errors.city_id && touched.city_id}
                    errorMessage={errors.city_id}
                    layout="horizontal"
                    asterisk
                  >
                    <Field name="city_id">
                      {({ field, form }: FieldProps) => (
                        <Select
                          size="xs"
                          placeholder=""
                          field={field}
                          form={form}
                          options={optionsCities}
                          value={optionsCities.filter(
                            (city) => city.value === values.city_id,
                          )}
                          onChange={(city) => {
                            if (city) {
                              form.setFieldValue(field.name, city.value);
                              form.setFieldValue("metro_line_id", null);
                            }
                          }}
                        />
                      )}
                    </Field>
                  </FormItem>
                  <FormItem
                    label={t("formInput.metroStations.metroLine")}
                    invalid={
                      errors.metro_line_id && (touched.metro_line_id as boolean)
                    }
                    errorMessage={errors.metro_line_id as string}
                    layout="horizontal"
                    asterisk
                  >
                    <Field name="metro_line_id">
                      {({ field, form }: FieldProps) => (
                        <Select
                          size="xs"
                          placeholder=""
                          field={field}
                          form={form}
                          isDisabled={!values.city_id}
                          options={actualOptions(metroLines[values.city_id])}
                          value={
                            metroLines[values.city_id]
                              ? actualOptions(
                                  metroLines[values.city_id],
                                )?.filter((metro: any) => {
                                  return metro.value === values.metro_line_id;
                                })
                              : null
                          }
                          onChange={(metroLine) => {
                            if (metroLine) {
                              form.setFieldValue(field.name, metroLine.value);
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
                    onClick={() => navigate(`${routePrefix.metro_station}`)}
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
                          `${TableTextConst.METRO_STATION}Page.buttons.createNew`,
                        )}
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

export default FormStation;
