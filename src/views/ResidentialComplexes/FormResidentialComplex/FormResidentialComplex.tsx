import { useTranslation } from "react-i18next";
import { Field, FieldProps, Form, Formik } from "formik";
import { FormItem, FormContainer } from "@/components/ui/Form";
import type { ComponentType } from "react";
import Input from "@/components/ui/Input";
import { Button, Select, Checkbox, Card } from "@/components/ui";
import { FormEssence } from "@/@types/form";
import {
  useSelectInfoDevelopersQuery,
  useSelectInfoCitiesQuery,
} from "@/services/RtkQueryService";
import { Loading } from "@/components/shared";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import NumericFormatInput from "@/components/ui/NumericFormatInput/NumericFormatInput";
import NumberInput from "@/components/ui/NumberInput/NumberInput";
import { CreatNewFormProps } from "@/@types/props";
import { validationSchemaResidentialComplex } from "@/utils/validationForm";
import { RealEstateBuilding, SelectInfo, TableTextConst } from "@/@types";
import routePrefix from "@/configs/routes.config/routePrefix";
import "./index.css";
import useDarkMode from "@/utils/hooks/useDarkmode";
import { useAppDispatch, useAppSelector } from "@/store";
import cs from "classnames";
import TextareaAutosize from "react-textarea-autosize";
import AddPictureComponent from "@/components/shared/AddPictureComponent";
import { setDrawerState } from "@/store/slices/actionState";

const CustomTextArea = ({ form, field, value }: any) => {
  const [isDark] = useDarkMode();
  const textAreaRef = useRef<any>(null);
  const [len, setLen] = useState<number>(0);
  const onChange = (e: any) => {
    form.setFieldValue(field.name, e.target.innerHTML);
    setLen(value.length);
  };
  useEffect(() => {
    setLen(value.length);
  }, [value]);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.innerHTML = value;
      form.setFieldValue(field.name, textAreaRef.current.innerHTML);
    }
  }, []);
  return (
    <>
      <div
        ref={textAreaRef}
        onChange={onChange}
        className={cs("py-2 px-2 custom-text-area", {
          "dark-mode": isDark,
          "light-mode": !isDark,
        })}
        contentEditable
        suppressContentEditableWarning={true}
      >
        {value}
      </div>
      <p>{`${len}/300`}</p>
    </>
  );
};

const FormResidentialComplex = ({
  data,
  isEdit = false,
  onNextChange,
  isLoadingEndpoint,
  duplicate,
}: CreatNewFormProps<FormEssence<RealEstateBuilding>>) => {
  const textAreaRef = useRef<any>({});
  const { mode } = useAppSelector((state) => state.theme);
  const [isDark] = useDarkMode();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const {
    data: selectInfoDevelopers,
    isLoading: isLoadingSelectInfoDevelopers,
  } =
    //@ts-ignore
    useSelectInfoDevelopersQuery();
  const { data: selectInfoCities, isLoading: isLoadingSelectInfoCities } =
    //@ts-ignore
    useSelectInfoCitiesQuery();
  const developers = (selectInfoDevelopers?.data || []) as SelectInfo[];
  const cities = (selectInfoCities?.data || []) as SelectInfo[];

  const onNext = (values: FormEssence<RealEstateBuilding>, duplicate: any) => {
    onNextChange?.(values);
  };

  const initialValues: any = useMemo(() => {
    return {
      images: data?.images || [],
      name: data?.name || "",
      city_id: data?.city?.id || "",
      developer_id: data?.developer?.id || "",
      is_region: data?.is_region || false,
      latitude: data?.latitude || "",
      longitude: data?.longitude || "",
      site: data?.site || "",
      location: data?.location || "",
      description: data?.description || "",
    };
  }, [data]);

  return (
    <Loading
      loading={
        isLoadingEndpoint &&
        isLoadingSelectInfoDevelopers &&
        isLoadingSelectInfoCities
      }
      type="cover"
    >
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={validationSchemaResidentialComplex}
        onSubmit={(values) => onNext(values, duplicate)}
      >
        {({ values, touched, errors }) => {
          return (
            <Form>
              <FormContainer>
                <Card>
                  <FormItem
                    label={t("formInput.residentialComplexes.image")}
                    layout="horizontal"
                  >
                    <Field name="images">
                      {({ field, form }: FieldProps<any, any>) => (
                        <AddPictureComponent
                          field={field}
                          form={form}
                          images={values.images}
                        />
                      )}
                    </Field>
                  </FormItem>
                  <FormItem
                    label={t("formInput.residentialComplexes.name")}
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
                  <FormItem
                    label={t("formInput.residentialComplexes.developer")}
                    invalid={
                      errors.developer_id && (touched.developer_id as boolean)
                    }
                    errorMessage={errors.developer_id as string}
                    layout="horizontal"
                    asterisk
                  >
                    <Field name="developer_id">
                      {({ field, form }: FieldProps) => (
                        <Select
                          size="xs"
                          placeholder=""
                          field={field}
                          form={form}
                          options={developers}
                          value={developers.filter(
                            (developer) =>
                              developer.value === values.developer_id,
                          )}
                          onChange={(developer) => {
                            if (developer) {
                              form.setFieldValue(field.name, developer.value);
                            }
                          }}
                        />
                      )}
                    </Field>
                  </FormItem>
                  <FormItem
                    noPadding
                    label={t("formInput.residentialComplexes.city")}
                    invalid={errors.city_id && (touched.city_id as boolean)}
                    errorMessage={errors.city_id as string}
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
                          options={cities}
                          value={cities.filter(
                            (city) => city.value === values.city_id,
                          )}
                          onChange={(city) => {
                            if (city) {
                              form.setFieldValue(field.name, city.value);
                            }
                          }}
                        />
                      )}
                    </Field>
                  </FormItem>
                  <FormItem
                    noPadding
                    label={t("formInput.residentialComplexes.region")}
                    invalid={errors.is_region && (touched.is_region as boolean)}
                    errorMessage={errors.is_region as string}
                    layout="horizontal"
                  >
                    <Field name="is_region" component={Checkbox} />
                  </FormItem>
                  <FormItem
                    label={t("formInput.residentialComplexes.latitude")}
                    invalid={errors.latitude && (touched.latitude as boolean)}
                    errorMessage={errors.latitude as string}
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
                    label={t("formInput.residentialComplexes.longitude")}
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
                    label={t("formInput.residentialComplexes.website")}
                    invalid={errors.site && (touched.site as boolean)}
                    errorMessage={errors.site as string}
                    layout="horizontal"
                    asterisk
                  >
                    <Field
                      size="xs"
                      type="text"
                      autoComplete="off"
                      name="site"
                      placeholder=""
                      component={Input}
                    />
                  </FormItem>
                  <FormItem
                    label={t("formInput.residentialComplexes.location")}
                    invalid={errors.location && (touched.location as boolean)}
                    errorMessage={errors.location as string}
                    layout="horizontal"
                    asterisk
                  >
                    <Field name="location">
                      {({ field, form }: FieldProps) => (
                        <TextareaAutosize
                          {...field}
                          placeholder=""
                          maxLength={300}
                          minRows={1}
                          maxRows={15}
                          className={cs("mt-2 py-2 px-2 custom-text-area", {
                            "invalid-text-area":
                              errors.location && touched.location,
                            "dark-mode": isDark,
                            "light-mode": !isDark,
                          })}
                          style={{
                            color: !isDark ? "#6b7280" : "white",
                            width: "100%",
                            // resize: "none",
                          }}
                        />
                      )}
                    </Field>
                    {`${values.location.length}/300`}
                  </FormItem>
                  <FormItem
                    label={t("formInput.residentialComplexes.description")}
                    invalid={
                      errors.description && (touched.description as boolean)
                    }
                    errorMessage={errors.description as string}
                    layout="horizontal"
                    asterisk
                  >
                    <Field name="description">
                      {({ field, form }: FieldProps) => (
                        <TextareaAutosize
                          {...field}
                          placeholder=""
                          maxLength={300}
                          minRows={1}
                          maxRows={15}
                          className={cs("mt-2 py-2 px-2 custom-text-area", {
                            "invalid-text-area":
                              errors.description && touched.description,
                            "dark-mode": isDark,
                            "light-mode": !isDark,
                          })}
                          style={{
                            color: !isDark ? "#6b7280" : "white",
                            width: "100%",
                            // resize: "none",
                          }}
                        />
                      )}
                    </Field>
                    {`${values.description.length}/300`}
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
                          `${TableTextConst.REALESTATEBUILDING}Page.buttons.createNew`,
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

export default FormResidentialComplex;
