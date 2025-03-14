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
import { useGetRealEstateObjectsActionInfoQuery } from "@/services/RtkQueryService";
import { useAppSelector } from "@/store";
import useDarkMode from "@/utils/hooks/useDarkmode";

const FormObject = ({
  data,
  isEdit = false,
  onNextChange,
  isLoadingEndpoint,
  duplicate,
  object_id,
}: CreatNewFormObjectProps) => {
  const [isDark] = useDarkMode();
  const { mode } = useAppSelector((state) => state.theme);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: selectInfo, isLoading: isLoadingSelectInfo } =
    //@ts-ignore
    useGetRealEstateObjectsActionInfoQuery();

  const real_estate_buildings =
    (selectInfo?.data.real_estate_buildings as any) || {};
  const roominess = selectInfo?.data.roominess || {};
  const finishing = selectInfo?.data.finishing || {};
  const types = selectInfo?.data.types || {};
  const deadlines = selectInfo?.data.deadlines || {};

  const onNext = (values: any) => {
    onNextChange?.(values);
  };

  const initialValues: any = useMemo(() => {
    return {
      real_estate_building_id: object_id
        ? object_id
        : data?.real_estate_building.id || "",
      roominess: data?.roominess.key || "",
      type: data?.type.key || "",
      finishing: data?.finishing.key || "",
      square: data?.square || "",
      price: data?.price || "",
      deadline: data?.deadline.key || "",
    };
  }, [data]);

  const optionsRealEstateObjects = useMemo(() => {
    const data = Object.entries(real_estate_buildings);
    return data.map(([id, value]) => ({
      label: value,
      value: id,
    }));
  }, [real_estate_buildings]);

  const optionsRoominess = useMemo(() => {
    const data = Object.entries(roominess);
    return data.map(([id, value]) => ({
      label: value,
      value: id,
    }));
  }, [roominess]);

  const optionsFinishing = useMemo(() => {
    const data = Object.entries(finishing);
    return data.map(([id, value]) => ({
      label: value,
      value: id,
    }));
  }, [finishing]);

  const optionsTypes = useMemo(() => {
    const data = Object.entries(types);
    return data.map(([id, value]) => ({
      label: value,
      value: id,
    }));
  }, [types]);

  const optionsDeadlines = useMemo(() => {
    const data = Object.entries(deadlines);
    return data.map(([id, value]) => ({
      label: value,
      value: id,
    }));
  }, [deadlines]);

  return (
    <Loading type="cover" loading={isLoadingSelectInfo}>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={validationSchemaObject}
        onSubmit={(values) => onNext(values)}
      >
        {({ values, touched, errors }) => {
          console.log(values, "values");
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
                          options={optionsRealEstateObjects}
                          value={optionsRealEstateObjects.filter(
                            (name: any) => {
                              return (
                                name.value === values.real_estate_building_id
                              );
                            },
                          )}
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
                          options={optionsRoominess}
                          value={optionsRoominess.filter((roominess: any) => {
                            // console.log(roominess, "roominess");
                            // console.log(values, "values");
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
                          options={optionsTypes}
                          value={optionsTypes.filter(
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
                          options={optionsFinishing}
                          value={optionsFinishing.filter(
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
                  {/* </Card> */}
                  {/* <Card className="mt-5"> */}
                  <FormItem
                    label={t("formInput.realEstateObject.deadline")}
                    invalid={errors.deadline && (touched.deadline as boolean)}
                    errorMessage={errors.deadline as string}
                    layout="horizontal"
                    style={{ fontSize: "16px", fontWeight: 900 }}
                    asterisk
                  >
                    <Field name="deadline">
                      {({ field, form }: FieldProps) => (
                        <Select
                          size="xs"
                          placeholder=""
                          field={field}
                          form={form}
                          options={optionsDeadlines}
                          value={optionsDeadlines.filter((deadline: any) => {
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
                    onClick={() =>
                      navigate(
                        object_id
                          ? `${routePrefix.real_estate_building}/${object_id}`
                          : `${routePrefix.real_estate_object}`,
                      )
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

// const [state, setState] = useState<any>({ optionSelected: null });

// const Option = (props: any) => {
//   return (
//     <div>
//       <components.Option {...props}>
//         <input
//           type="checkbox"
//           checked={props.isSelected}
//           onChange={() => null}
//           style={{ marginTop: "-10px" }}
//         />
//         {""}
//         <label style={{ marginLeft: "10px" }}>{props.label}</label>
//       </components.Option>
//     </div>
//   );
// };
// const mockData = [
//   { value: "0", label: "Все" },
//   { value: "1", label: "Готово" },
//   { value: "2", label: "В этом году" },
//   { value: "3", label: "До 1 кв 2025" },
//   { value: "4", label: "До 2 кв 2025" },
//   { value: "5", label: "До 3 кв 2025" },
//   { value: "6", label: "До 4 кв 2025" },
// ];
// const handleChange = (selected: any) => {
//   setState({
//     optionSelected: selected,
//   });
// };

// <FormItem
//   label={t("formInput.realEstateObject.deadline")}
//   // invalid={errors.roominess_id && touched.roominess_id}
//   // errorMessage={errors.roominess_id}
//   layout="horizontal"
//   asterisk
// >
//   <Field name="deadline_id">
//     {({ field, form }: FieldProps) => (
//       <Select
//         placeholder=""
//         field={field}
//         form={form}
//         isMulti
//         options={mockData}
//         closeMenuOnSelect={false}
//         hideSelectedOptions={false}
//         components={{
//           Option,
//         }}
//         onChange={handleChange}
//         value={state.optionSelected}
//         // options={optionsTypes}
//         // value={optionsTypes.filter(
//         //   (type: any) =>
//         //     type.value === values.type_id
//         // )}
//         // onChange={(roominess) => {
//         //   if (type) {
//         //     form.setFieldValue(field.name, type.value);
//         //   }
//         // }}
//       />
//     )}
//   </Field>
// </FormItem>;
