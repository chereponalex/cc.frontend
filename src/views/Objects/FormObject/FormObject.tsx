import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import InputMask from "react-input-mask";

import { CreatNewFormObjectProps } from "@/@types/props";

import { Loading } from "@/components/shared";
import { Field, FieldProps, Form, Formik } from "formik";
import { Button, Card, Select } from "@/components/ui";
import { FormItem, FormContainer } from "@/components/ui/Form";

import Input from "@/components/ui/Input";
import { useMemo } from "react";
import { TableTextConst } from "@/@types";
import routePrefix from "@/configs/routes.config/routePrefix";
import { separateNumbers } from "@/utils/separateNumbers";
import { validationSchemaObject } from "@/utils/validationForm";
import {
  useGetRealEstateObjectsActionInfoQuery,
  useSelectInfoRealEstateObjectQuery,
} from "@/services/RtkQueryService";
import { useAppDispatch, useAppSelector } from "@/store";
import useDarkMode from "@/utils/hooks/useDarkmode";
import { setDrawerState } from "@/store/slices/actionState";

const FormObject = ({
  data,
  isEdit = false,
  onNextChange,
  isLoadingEndpoint,
  duplicate,
  object_id,
}: CreatNewFormObjectProps) => {
  const dispatch = useAppDispatch();
  const [isDark] = useDarkMode();
  const { t } = useTranslation();
  const { data: selectInfo, isLoading: isLoadingSelectInfoReo } =
    //@ts-ignore
    useSelectInfoRealEstateObjectQuery();
  const real_estate_buildings = selectInfo?.data.real_estate_buildings || [];
  const roominess = selectInfo?.data?.roominess || [];
  const types = selectInfo?.data?.types || [];
  const finishing = selectInfo?.data?.finishing || [];
  const deadlines = selectInfo?.data?.deadlines || [];

  const onNext = (values: any) => {
    onNextChange?.(values);
  };

  const initialValues: any = useMemo(() => {
    return {
      real_estate_building_id: object_id ? object_id : data?.building.id || "",
      roominess: data?.roominess.value || "",
      type: data?.type.value || "",
      finishing: data?.finishing.value || "",
      square: data?.square || "",
      price: data?.price || "",
      deadline: data?.deadline.value || "",
    };
  }, [data]);

  console.log(initialValues, "init");
  console.log(deadlines, "deadlines");

  return (
    <Loading type="cover" loading={isLoadingSelectInfoReo}>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={validationSchemaObject}
        onSubmit={(values) => onNext(values)}
      >
        {({ values, touched, errors }) => {
          // console.log(values, "values");
          return (
            <Form>
              <FormContainer>
                <Card>
                  <FormItem
                    label={t("formInput.realEstateObject.name")}
                    invalid={
                      errors.real_estate_building_id &&
                      (touched.real_estate_building_id as any)
                    }
                    errorMessage={errors.real_estate_building_id as any}
                    layout="horizontal"
                    asterisk
                  >
                    <Field name="real_estate_building_id">
                      {({ field, form }: FieldProps) => (
                        <Select
                          size="xs"
                          placeholder=""
                          field={field}
                          form={form}
                          options={real_estate_buildings}
                          value={real_estate_buildings?.filter((name: any) => {
                            return (
                              name.value === values.real_estate_building_id
                            );
                          })}
                          onChange={(name) => {
                            if (name) {
                              form.setFieldValue(field.name, name.value);
                            }
                          }}
                        />
                      )}
                    </Field>
                  </FormItem>
                  <FormItem
                    label={t("formInput.realEstateObject.roominess")}
                    invalid={errors.roominess && (touched.roominess as boolean)}
                    errorMessage={errors.roominess as string}
                    layout="horizontal"
                    asterisk
                  >
                    <Field name="roominess">
                      {({ field, form }: FieldProps) => (
                        <Select
                          size="xs"
                          placeholder=""
                          field={field}
                          form={form}
                          options={roominess}
                          value={roominess?.filter((roominess: any) => {
                            return roominess.value === values.roominess;
                          })}
                          onChange={(roominess) => {
                            if (roominess) {
                              form.setFieldValue(field.name, roominess.value);
                            }
                          }}
                        />
                      )}
                    </Field>
                  </FormItem>
                  <FormItem
                    label={t("formInput.realEstateObject.type")}
                    invalid={errors.type && (touched.type as boolean)}
                    errorMessage={errors.type as string}
                    layout="horizontal"
                    asterisk
                  >
                    <Field name="type">
                      {({ field, form }: FieldProps) => (
                        <Select
                          size="xs"
                          placeholder=""
                          field={field}
                          form={form}
                          options={types}
                          value={types?.filter(
                            (type: any) => type.value === values.type,
                          )}
                          onChange={(type) => {
                            if (type) {
                              form.setFieldValue(field.name, type.value);
                            }
                          }}
                        />
                      )}
                    </Field>
                  </FormItem>
                  <FormItem
                    label={t("formInput.realEstateObject.finishing")}
                    invalid={errors.finishing && (touched.finishing as boolean)}
                    errorMessage={errors.finishing as string}
                    layout="horizontal"
                    asterisk
                  >
                    <Field name="finishing">
                      {({ field, form }: FieldProps) => (
                        <Select
                          size="xs"
                          placeholder=""
                          field={field}
                          form={form}
                          options={finishing}
                          value={finishing?.filter(
                            (finishing: any) =>
                              finishing.value === values.finishing,
                          )}
                          onChange={(finishing) => {
                            if (finishing) {
                              form.setFieldValue(field.name, finishing.value);
                            }
                          }}
                        />
                      )}
                    </Field>
                  </FormItem>
                  <FormItem
                    label={t("formInput.realEstateObject.square")}
                    invalid={errors.square && (touched.square as boolean)}
                    errorMessage={errors.square as string}
                    layout="horizontal"
                    asterisk
                  >
                    <Field
                      size="xs"
                      type="number"
                      autoComplete="off"
                      name="square"
                      placeholder=""
                      component={Input}
                    />
                  </FormItem>
                  <FormItem
                    label={t("formInput.realEstateObject.price")}
                    invalid={errors.price && (touched.price as boolean)}
                    errorMessage={errors.price as string}
                    layout="horizontal"
                    asterisk
                  >
                    <Field
                      size="xs"
                      type="number"
                      autoComplete="off"
                      name="price"
                      placeholder=""
                      component={Input}
                    />
                  </FormItem>
                  <FormItem
                    label={t("formInput.realEstateObject.deadline")}
                    invalid={errors.deadline && (touched.deadline as boolean)}
                    errorMessage={errors.deadline as string}
                    layout="horizontal"
                    asterisk
                  >
                    <Field name="deadline">
                      {({ field, form }: FieldProps) => (
                        <Select
                          size="xs"
                          placeholder=""
                          field={field}
                          form={form}
                          options={deadlines}
                          value={deadlines?.filter((deadline: any) => {
                            return deadline.value === values.deadline;
                          })}
                          onChange={(deadline) => {
                            if (deadline) {
                              form.setFieldValue(field.name, deadline.value);
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
                    onClick={
                      () => dispatch(setDrawerState(false))

                      // navigate(
                      //   object_id
                      //     ? `${routePrefix.real_estate_building}/${object_id}`
                      //     : `${routePrefix.real_estate_object}`,
                      // )
                    }
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
                          `${TableTextConst.REAL_ESTATE_OBJECT}Page.buttons.createNew`,
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
export default FormObject;
