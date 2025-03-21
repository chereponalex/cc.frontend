import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Radio from "@/components/ui/Radio";

import { CreatNewFormQuestionProps } from "@/@types/props";

import { Loading } from "@/components/shared";
import { Field, FieldProps, Form, Formik } from "formik";
import { Button, Card } from "@/components/ui";
import { FormItem, FormContainer } from "@/components/ui/Form";

import Input from "@/components/ui/Input";
import { useMemo } from "react";
import { TableTextConst } from "@/@types";
import routePrefix from "@/configs/routes.config/routePrefix";
import { validationSchemaQuestion } from "@/utils/validationForm";
import { useAppDispatch } from "@/store";
import { setDrawerState } from "@/store/slices/actionState";

const RadioComponent = ({ form, field }: any) => {
  const onChangeRadio = (val: string) => {
    form.setFieldValue(field.name, val);
  };

  return (
    <Radio.Group value={field.value} key={field.value} onChange={onChangeRadio}>
      <Radio value={true}>Да</Radio>
      <Radio value={false}>Нет</Radio>
    </Radio.Group>
  );
};

const FormQuestion = ({
  data,
  isEdit = false,
  onNextChange,
  isLoadingEndpoint,
  duplicate,
}: CreatNewFormQuestionProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

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
    dispatch(setDrawerState(false));
  };

  const initialValues: any = useMemo(() => {
    return {
      text: data?.text || "",
      reply: data?.reply,
    };
  }, [data]);

  return (
    <Loading type="cover" loading={isLoadingEndpoint}>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={validationSchemaQuestion}
        onSubmit={(values) => onNext(values, duplicate)}
      >
        {({ values, touched, errors }) => {
          console.log(values, "values");
          return (
            <Form>
              <FormContainer>
                <Card>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "start",
                    }}
                  >
                    <div style={{ width: "100%", maxWidth: "500px" }}>
                      <FormItem
                        bottom={-12}
                        label={t("formInput.question.question")}
                        invalid={errors.text && (touched.text as boolean)}
                        errorMessage={errors.text as string}
                        layout="vertical"
                        asterisk
                      >
                        <Field
                          type="text"
                          textArea
                          autoComplete="off"
                          name="text"
                          placeholder=""
                          component={Input}
                        />
                      </FormItem>
                    </div>
                    <div style={{ paddingLeft: "10px" }}>
                      <FormItem
                        label={t("formInput.question.answer")}
                        invalid={errors.reply && (touched.reply as boolean)}
                        errorMessage={errors.reply as string}
                        layout="vertical"
                        asterisk
                      >
                        <Field name="reply">
                          {({ field, form }: FieldProps) => (
                            <RadioComponent field={field} form={form} />
                          )}
                        </Field>
                      </FormItem>
                    </div>
                  </div>
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
                      : t(`${TableTextConst.QUESTION}Page.buttons.createNew`)}
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
export default FormQuestion;
