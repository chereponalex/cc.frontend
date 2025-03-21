import { useTranslation } from "react-i18next";
import { Field, FieldProps, Form, Formik } from "formik";
import { FormItem, FormContainer } from "@/components/ui/Form";
import Input from "@/components/ui/Input";
import { Button, Card, Select } from "@/components/ui";
import { FormEssence } from "@/@types/form";
import { useNavigate } from "react-router-dom";
import { CreatNewFormProps } from "@/@types/props";
import { validationSchemaScript } from "@/utils/validationForm";
import { Script, TableTextConst } from "@/@types";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import routePrefix from "@/configs/routes.config/routePrefix";
import {
  useGetScriptActionInfoQuery,
  useSelectInfoScriptQuery,
} from "@/services/RtkQueryService";
import TableScript from "@/components/shared/TableScript";
import { useEffect, useMemo, useState } from "react";
import { Loading } from "@/components/shared";
import "./index.css";
import cs from "classnames";
import { useAppDispatch, useAppSelector } from "@/store";
import useDarkMode from "@/utils/hooks/useDarkmode";
import { setDrawerState } from "@/store/slices/actionState";

type ScriptDataProps = {
  id: string;
};

const FormScripts = (
  {
    data,
    isEdit = false,
    onNextChange,
    isLoadingEndpoint,
    duplicate,
  }: any /* CreatNewFormProps<FormEssence<Script>> */,
) => {
  const dispatch = useAppDispatch();
  const [isDark] = useDarkMode();
  const { t } = useTranslation();
  const {
    data: selectInfo,
    isLoading: isLoadingSelectInfo,
    //@ts-ignore
  } = useGetScriptActionInfoQuery();

  const { data: selectInfoScript, isLoading: isLoadingSelectInfoScript } =
    //@ts-ignore
    useSelectInfoScriptQuery();
  // console.log(selectInfoScript, 'selectInfoScript')

  const scriptLocations = selectInfo?.data.script_locations || {};
  const typesTransfers = selectInfo?.data.types || {};

  const script_locations = selectInfoScript?.data?.script_location;
  console.log(script_locations, "script_locations");
  const optionsTypesTransfers = useMemo(() => {
    return Object.entries(typesTransfers).map(([value, label]) => ({
      label,
      value,
    }));
  }, [scriptLocations]);

  const optionsScriptLocations = useMemo(() => {
    return Object.entries(scriptLocations).map(([value, label]) => ({
      label,
      value,
    }));
  }, [scriptLocations]);
  const [dataCollection, setDataColletion] = useState<ScriptDataProps[]>([]);
  useEffect(() => {
    setDataColletion(
      data?.questions?.map((item: any) => ({
        ...item,
        question_id: item.id,
      })),
    );
  }, [data]);

  const onNext = (values: FormEssence<Script>, duplicate: any) => {
    const filtered = dataCollection
      ?.map((item: any) => item.question_id)
      .filter((item: any) => item);
    const onlyChangeFields =
      filtered?.length > 0 ? { questions: filtered } : ({} as any);
    if (duplicate === null) {
      Object.keys(values).forEach((key) => {
        if (values[key] !== initialValues[key]) {
          onlyChangeFields[key] = values[key];
        }
      });
    }
    onNextChange?.(
      duplicate === null
        ? onlyChangeFields
        : filtered?.length > 0
          ? //TODO проверить
            { ...values, questions: filtered }
          : { ...values, questions: filtered },
    );
    // dispatch(setDrawerState(false));
  };

  const initialValues: any = useMemo(() => {
    return {
      name: data?.name || "",
      text: data?.text || "",
      script_location: data?.script_location || "",
      type: data?.type?.key || "",
    };
  }, [data]);

  return (
    <Loading type="cover" loading={isLoadingEndpoint && isLoadingSelectInfo}>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={validationSchemaScript}
        onSubmit={(values) => onNext(values, duplicate)}
      >
        {({ values, touched, errors }) => {
          console.log(values, "values");
          return (
            <Form>
              <FormContainer>
                <Card>
                  <FormItem
                    noPadding
                    label={t("formInput.scripts.name")}
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
                    label={t("formInput.scripts.script_location")}
                    invalid={
                      errors.script_location &&
                      (touched.script_location as boolean)
                    }
                    errorMessage={errors.script_location as string}
                    layout="horizontal"
                    asterisk
                  >
                    <Field name="script_location">
                      {({ field, form }: FieldProps) => (
                        <Select
                          isLoading={isLoadingSelectInfoScript}
                          size="xs"
                          menuPlacement="auto"
                          placeholder=""
                          field={field}
                          form={form}
                          options={script_locations}
                          value={script_locations?.filter((location: any) => {
                            return location.value === values.script_location;
                          })}
                          onChange={(location: any) => {
                            if (location) {
                              form.setFieldValue(field.name, location.value);
                            }
                          }}
                        />
                      )}
                    </Field>
                  </FormItem>
                  {values.script_location === "TRANSFER" && (
                    <FormItem
                      label={t("formInput.scripts.types_transfers")}
                      invalid={errors.type && (touched.type as boolean)}
                      errorMessage={errors.type as string}
                      layout="horizontal"
                      asterisk
                    >
                      <Field name="type">
                        {({ field, form }: FieldProps) => (
                          <Select
                            isLoading={isLoadingSelectInfoScript}
                            size="xs"
                            menuPlacement="auto"
                            placeholder=""
                            field={field}
                            form={form}
                            options={optionsTypesTransfers}
                            value={optionsTypesTransfers.filter((type: any) => {
                              return type.value === values.type;
                            })}
                            onChange={(type: any) => {
                              if (type) {
                                form.setFieldValue(field.name, type.value);
                              }
                            }}
                          />
                        )}
                      </Field>
                    </FormItem>
                  )}
                  <FormItem
                    label={
                      values.script_location === "TRANSFER"
                        ? t("formInput.scripts.transfer_instructions")
                        : t("formInput.scripts.script")
                    }
                    invalid={errors.text && (touched.text as boolean)}
                    errorMessage={errors.text as string}
                    layout="horizontal"
                  >
                    <Field name="text">
                      {({ field, form }: FieldProps) => (
                        <div
                          className={cs({
                            "dark-mode": isDark === true,
                            "light-mode": isDark === false,
                          })}
                        >
                          <CKEditor
                            editor={ClassicEditor}
                            data={field.value}
                            onChange={(event, editor) => {
                              const data = editor.getData();
                              form.setFieldValue(field.name, data);
                            }}
                          />
                        </div>
                      )}
                    </Field>
                  </FormItem>
                  <TableScript
                    loading={isLoadingSelectInfo}
                    selectInfo={selectInfoScript?.data}
                    dataCollection={dataCollection}
                    setDataColletion={setDataColletion}
                  />
                </Card>
                <div
                  className="flex justify-end mt-4 gap-2"
                  style={{
                    padding: "10px",
                    position: "sticky",
                    bottom: 0,
                    zIndex: 10,
                    borderTop: "1px solid #4b5563",
                    background: isDark === true ? "#1f2937" : "white",
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
                      : t(`${TableTextConst.SCRIPT}Page.buttons.createNew`)}
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

export default FormScripts;
