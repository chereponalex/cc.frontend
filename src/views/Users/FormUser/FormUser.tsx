import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Loading } from "@/components/shared";
import {
  Field,
  FieldInputProps,
  FieldProps,
  Form,
  Formik,
  FormikProps,
} from "formik";
import { Button, Select, Card } from "@/components/ui";
import { FormItem, FormContainer } from "@/components/ui/Form";

import Input from "@/components/ui/Input";
import { useEffect, useMemo, useState } from "react";
import {
  validationSchemaEmployee,
  validationSchemaEmployeeEdit,
} from "@/utils/validationForm";
import { TableTextConst } from "@/@types";
import routePrefix from "@/configs/routes.config/routePrefix";
import { useGetEmployeesActionInfoQuery } from "@/services/RtkQueryService";
import { useAppSelector } from "@/store";
import useDarkMode from "@/utils/hooks/useDarkmode";
import DatePicker from "@/components/ui/DatePicker";
import "../FormUser/index.css";
import timezoneClient from "@/utils/timezone";
import cs from "classnames";

interface DatePickerProps<V = any, FormValues = any> {
  field: FieldInputProps<V>;
  form: FormikProps<any>;
  value: Date | string | null;
  errors: any;
  touched: any;
  onChange: (date: any) => void;
}

const DateInputPicker = ({
  field,
  form,
  value,
  errors,
  touched,
}: DatePickerProps) => {
  const [date, setDate] = useState<Date | null>(null);
  useEffect(() => {
    if (value) {
      setDate(new Date(value));
    }
  }, [value]);

  const onChangeDatePicker = (e: any) => {
    setDate(e);
    form.setFieldValue(field.name, timezoneClient(e));
  };

  return (
    <DatePicker
      className={cs({
        "invalid-input": errors.date_of_birth && touched.date_of_birth,
      })}
      value={date}
      size="xs"
      inputtable
      onChange={onChangeDatePicker}
    />
  );
};

const FormUser = ({
  data,
  isEdit = false,
  onNextChange,
  isLoadingEndpoint,
  duplicate,
}: any) => {
  const [isDark] = useDarkMode();
  const { mode } = useAppSelector((state) => state.theme);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: selectInfo, isLoading: isLoadingSelectInfo } =
    //@ts-ignore
    useGetEmployeesActionInfoQuery();
  const countries = selectInfo?.data.countries || {};
  const regions = selectInfo?.data.regions || {};
  const cities = selectInfo?.data.cities || {};
  const roles = selectInfo?.data.roles || {};

  const onNext = (values: any, duplicate: boolean) => {
    const onlyChangeFields = {} as any;
    if (duplicate === null) {
      Object.keys(values).forEach((key) => {
        if (values[key] !== initialValues[key]) {
          onlyChangeFields[key] = values[key];
        }
      });
    }
    onNextChange?.(duplicate === null ? onlyChangeFields : values);
  };

  const initialValues: any = useMemo(() => {
    return {
      name: data?.name || "",
      last_name: data?.last_name || "",
      date_of_birth: data?.date_of_birth || "",
      phone: data?.phone || "",
      email: data?.email || "",
      password: data?.password || "",
      role_id: data?.role?.id || "",
      country_id: data?.country.id || "",
      region_id: data?.region.id || "",
      city_id: data?.city.id || "",
    };
  }, [data]);

  const optionsCountries = useMemo(() => {
    const data = Object.entries(countries);
    return data.map(([id, value]) => ({
      label: value,
      value: id,
    }));
  }, [countries]);

  const optionsRoles = useMemo(() => {
    const data = Object.entries(roles);
    return data.map(([id, value]) => ({
      label: value,
      value: id,
    }));
  }, [roles]);

  const actualOptions = (dataObj: any) => {
    if (dataObj) {
      return Object.entries(dataObj)?.map(([value, label]) => ({
        label,
        value,
      }));
    }
  };

  return (
    <Loading type="cover" loading={isLoadingEndpoint && isLoadingSelectInfo}>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={
          isEdit ? validationSchemaEmployeeEdit : validationSchemaEmployee
        }
        onSubmit={(values) => onNext(values, duplicate)}
      >
        {({ values, touched, errors }) => {
          return (
            <Form>
              <FormContainer>
                <Card>
                  <FormItem
                    label={t("formInput.employee.name")}
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
                    label={t("formInput.employee.last_name")}
                    invalid={errors.last_name && (touched.last_name as any)}
                    errorMessage={errors.last_name as any}
                    layout="horizontal"
                    asterisk
                  >
                    <Field
                      size="xs"
                      type="text"
                      autoComplete="off"
                      name="last_name"
                      placeholder=""
                      component={Input}
                    />
                  </FormItem>
                  <FormItem
                    label={t("formInput.employee.date_of_birth")}
                    invalid={
                      errors.date_of_birth && (touched.date_of_birth as any)
                    }
                    errorMessage={errors.date_of_birth as any}
                    layout="horizontal"
                    asterisk
                  >
                    <Field name="date_of_birth">
                      {({ field, form }: FieldProps) => (
                        <DateInputPicker
                          errors={errors}
                          touched={touched}
                          field={field}
                          form={form}
                          value={values.date_of_birth}
                          onChange={(date: any) => {
                            if (date) {
                              form.setFieldValue(field.name, date.value);
                            }
                          }}
                        />
                      )}
                    </Field>
                  </FormItem>
                  <FormItem
                    label={t("formInput.employee.email")}
                    invalid={errors.email && (touched.email as any)}
                    errorMessage={errors.email as any}
                    layout="horizontal"
                    asterisk
                  >
                    <Field
                      size="xs"
                      type="text"
                      autoComplete="off"
                      name="email"
                      placeholder=""
                      component={Input}
                    />
                  </FormItem>
                  <FormItem
                    label={t("formInput.employee.phone")}
                    invalid={errors.phone && (touched.phone as any)}
                    errorMessage={errors.phone as any}
                    layout="horizontal"
                    asterisk
                  >
                    <Field
                      size="xs"
                      type="text"
                      autoComplete="off"
                      name="phone"
                      placeholder=""
                      component={Input}
                    />
                  </FormItem>
                  <FormItem
                    label={t("formInput.employee.password")}
                    invalid={errors.password && (touched.password as any)}
                    errorMessage={errors.password as any}
                    layout="horizontal"
                    asterisk={isEdit ? false : true}
                  >
                    <Field
                      size="xs"
                      type="text"
                      autoComplete="off"
                      name="password"
                      placeholder=""
                      component={Input}
                    />
                  </FormItem>
                  <FormItem
                    label={t("formInput.employee.role")}
                    invalid={errors.role_id && (touched.role_id as any)}
                    errorMessage={errors.role_id as any}
                    layout="horizontal"
                    asterisk
                  >
                    <Field name="role_id">
                      {({ field, form }: FieldProps) => (
                        <Select
                          size="xs"
                          placeholder=""
                          field={field}
                          form={form}
                          options={optionsRoles}
                          value={optionsRoles.filter(
                            (role: any) => role.value === values.role_id,
                          )}
                          onChange={(role) => {
                            if (role) {
                              form.setFieldValue(field.name, role.value);
                            }
                          }}
                        />
                      )}
                    </Field>
                  </FormItem>
                  <FormItem
                    label={t("formInput.employee.country")}
                    invalid={errors.country_id && (touched.country_id as any)}
                    errorMessage={errors.country_id as any}
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
                          value={optionsCountries?.filter(
                            (country: any) =>
                              country.value === values.country_id,
                          )}
                          onChange={(country) => {
                            if (country) {
                              form.setFieldValue(field.name, country.value);
                              form.setFieldValue("region_id", null);
                              form.setFieldValue("city_id", null);
                            }
                          }}
                        />
                      )}
                    </Field>
                  </FormItem>
                  <FormItem
                    label={t("formInput.employee.region")}
                    invalid={errors.region_id && (touched.region_id as any)}
                    errorMessage={errors.region_id as any}
                    layout="horizontal"
                    asterisk
                  >
                    <Field name="region_id">
                      {({ field, form }: FieldProps) => (
                        <Select
                          size="xs"
                          menuPlacement="auto"
                          placeholder=""
                          field={field}
                          form={form}
                          isDisabled={!values.country_id}
                          options={actualOptions(regions[values.country_id])}
                          value={
                            regions[values.country_id]
                              ? actualOptions(
                                  regions[values.country_id],
                                )?.filter(
                                  (region: any) =>
                                    region.value === values.region_id,
                                )
                              : null
                          }
                          onChange={(region) => {
                            if (region) {
                              form.setFieldValue(field.name, region.value);
                              form.setFieldValue("city_id", null);
                            }
                          }}
                        />
                      )}
                    </Field>
                  </FormItem>
                  <FormItem
                    label={t("formInput.employee.city")}
                    invalid={errors.city_id && (touched.city_id as any)}
                    errorMessage={errors.city_id as any}
                    layout="horizontal"
                    asterisk
                  >
                    <Field name="city_id">
                      {({ field, form }: FieldProps) => (
                        <Select
                          size="xs"
                          menuPlacement="top"
                          placeholder=""
                          field={field}
                          form={form}
                          isDisabled={!values.country_id || !values.region_id}
                          options={actualOptions(cities[values.region_id])}
                          value={
                            cities[values.region_id]
                              ? actualOptions(cities[values.region_id])?.filter(
                                  (city: any) => {
                                    return city.value === values.city_id;
                                  },
                                )
                              : null
                          }
                          onChange={(city) => {
                            if (city) {
                              form.setFieldValue(field.name, city.value);
                            }
                          }}
                        />
                      )}
                    </Field>
                  </FormItem>
                </Card>
                <div
                  className="flex justify-end mt-4 gap-2"
                  style={{
                    padding: "10px",
                    position: "sticky",
                    bottom: 0,
                    zIndex: 10,
                    borderTop: "1px solid #4b5563",
                    background: isDark ? "#1f2937" : "white",
                  }}
                >
                  <Button
                    type="button"
                    onClick={() => navigate(`${routePrefix.employee}`)}
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
                      : t(`${TableTextConst.EMPLOYEE}Page.buttons.createNew`)}
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
export default FormUser;
