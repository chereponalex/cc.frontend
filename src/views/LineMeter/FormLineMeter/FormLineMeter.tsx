import { useTranslation } from "react-i18next";
import { Field, FieldProps, Form, Formik } from "formik";
import { FormItem, FormContainer } from "@/components/ui/Form";
import { Button, Select, Card, Input } from "@/components/ui";
import { FormEssenceLineMeter } from "@/@types/form";
import {
  useGetCitiesQuery,
  useGetMetroLineActionInfoQuery,
} from "@/services/RtkQueryService";
import { Loading } from "@/components/shared";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreatNewFormLineMeterProps } from "@/@types/props";
import { validationSchemaLine } from "@/utils/validationForm";
import Colorful from "@uiw/react-color-colorful";
import { hexToHsva, hsvaToHex } from "@uiw/color-convert";
import { motion } from "framer-motion";
import useClickOutside from "@/utils/hooks/useClickOutside";
import EditableInput from "@uiw/react-color-editable-input";
import { TableTextConst } from "@/@types";
import routePrefix from "@/configs/routes.config/routePrefix";

const ColorPicker = ({ defautlColor, field, form }: any) => {
  const [hsva, setHsva] = useState(
    (defautlColor && hexToHsva(defautlColor)) || { h: 0, s: 0, v: 68, a: 1 },
  );
  const [collapse, setCollapse] = useState(false);

  useEffect(() => {
    form.setFieldValue(field.name, hsvaToHex(hsva));
  }, [hsva]);

  const onCollapse = () => {
    setCollapse(!collapse);
  };

  const ref = useClickOutside(() => setCollapse(false));

  return (
    <div ref={ref}>
      <div
        style={{ background: defautlColor }}
        className="w-8 h-8 rounded-full cursor-pointer border-solid border-2 border-gray-400"
        onClick={onCollapse}
      />
      <motion.div
        className="mt-4"
        initial={{ opacity: 0, height: 0, overflow: "hidden" }}
        animate={{
          opacity: !collapse ? 0 : 1,
          height: !collapse ? 0 : "auto",
          overflow: !collapse ? "hidden" : "visible",
        }}
        transition={{ duration: 0.15 }}
      >
        <div className="flex flex-row items-end gap-8">
          <Colorful
            // color={hsva}
            color={defautlColor}
            disableAlpha
            onChange={(color) => {
              setHsva(color.hsva);
            }}
          />
          <EditableInput
            label="Hex"
            placement="left"
            className="w-20 items-start gap-1"
            value={hsvaToHex(hsva)}
            onChange={(event) => setHsva(hexToHsva(event.target.value))}
          />
        </div>
      </motion.div>
    </div>
  );
};

const FormLineMeter = ({
  data,
  isEdit = false,
  onNextChange,
  isLoadingEndpoint,
  duplicate,
}: CreatNewFormLineMeterProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: selectInfo, isLoading: isLoadingSelectInfo } =
    //@ts-ignore
    useGetMetroLineActionInfoQuery();

  const onNext = (values: any, duplicate: string | null | undefined) => {
    const onlyChangeFields = {} as any;
    if (duplicate === null) {
      Object.keys(values).forEach((key) => {
        //@ts-ignore
        if (values[key] !== initialValues[key]) {
          onlyChangeFields[key] = values[key];
        }
      });
    }
    onNextChange?.(duplicate === null ? onlyChangeFields : values);
  };
  const cities = selectInfo?.data.cities || {};
  const line_types = selectInfo?.data.line_types || {};

  const optionsCities = useMemo(() => {
    const result = [];

    for (const key1 in cities) {
      for (const key2 in cities[key1]) {
        result.push({ value: key2, label: cities[key1][key2] });
      }
    }
    return result;
  }, [cities]);

  const optionsLineTypes = useMemo(() => {
    const data = Object.entries(line_types);
    return data.map(([id, value]) => ({
      label: value,
      value: id,
    }));
  }, [line_types]);

  const initialValues: FormEssenceLineMeter = useMemo(() => {
    return {
      name: data?.name || "",
      city_id: data?.city?.id || "",
      color: data?.color || "",
      line_type: data?.line_type.key || "",
    };
  }, [data]);

  return (
    <Loading loading={isLoadingSelectInfo} type="cover">
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={validationSchemaLine}
        onSubmit={(values) => onNext(values, duplicate)}
      >
        {({ values, touched, errors }) => {
          console.log(errors.color, "errors.color");
          return (
            <Form>
              <FormContainer>
                <Card>
                  <FormItem
                    label={t("formInput.lineMeters.name")}
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
                    label={t("formInput.lineMeters.city")}
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
                            }
                          }}
                        />
                      )}
                    </Field>
                  </FormItem>
                  <FormItem
                    label={t("formInput.lineMeters.color")}
                    invalid={errors.color && (touched.color as boolean)}
                    errorMessage={errors.color as string}
                    layout="horizontal"
                    asterisk
                  >
                    <Field name="color">
                      {({ field, form }: FieldProps) => (
                        <ColorPicker
                          form={form}
                          field={field}
                          defautlColor={values.color}
                        />
                      )}
                    </Field>
                  </FormItem>
                  <FormItem
                    label={t("formInput.lineMeters.type")}
                    invalid={errors.line_type && touched.line_type}
                    errorMessage={errors.line_type}
                    layout="horizontal"
                    asterisk
                  >
                    <Field name="line_type">
                      {({ field, form }: FieldProps) => (
                        <Select
                          size="xs"
                          placeholder=""
                          field={field}
                          form={form}
                          isDisabled={!values.city_id}
                          options={optionsLineTypes}
                          value={optionsLineTypes.filter(
                            (line) => line.value === values.line_type,
                          )}
                          onChange={(line) => {
                            if (line) {
                              form.setFieldValue(field.name, line.value);
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
                    onClick={() => navigate(`${routePrefix.metro_line}`)}
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
                      : t(`${TableTextConst.METRO_LINE}Page.buttons.createNew`)}
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

export default FormLineMeter;
