import { useTranslation } from "react-i18next";
import { Field, FieldProps, Form, Formik } from "formik";
import { FormItem, FormContainer } from "@/components/ui/Form";
import { Button, Card, InputGroup, Select } from "@/components/ui";
import { FormEssenceBlackList } from "@/@types/form";
import { useNavigate } from "react-router-dom";
import { CreatNewFormProps } from "@/@types/props";
import { validationSchemaBlackList } from "@/utils/validationForm";
import { CountryOption, TableTextConst } from "@/@types";
import { countryList } from "@/constants/countries.constant";
import NumericFormatInput from "@/components/ui/NumericFormatInput";
import { OptionProps, SingleValueProps, components } from "react-select";
import NumberInput from "@/components/ui/NumberInput";
import { ComponentType } from "react";
import routePrefix from "@/configs/routes.config/routePrefix";

const { SingleValue } = components;

const PhoneSelectOption = ({
  innerProps,
  data,
  isSelected,
}: OptionProps<CountryOption>) => {
  return (
    <div
      className={`cursor-pointer flex items-center justify-between p-2 ${
        isSelected
          ? "bg-gray-100 dark:bg-gray-500"
          : "hover:bg-gray-50 dark:hover:bg-gray-600"
      }`}
      {...innerProps}
    >
      <div className="flex items-center gap-2">
        <span>
          ({data.value}) {data.dialCode}
        </span>
      </div>
    </div>
  );
};

const PhoneControl = (props: SingleValueProps<CountryOption>) => {
  const selected = props.getValue()[0];
  return (
    <SingleValue {...props}>
      {selected && <span>{selected.dialCode}</span>}
    </SingleValue>
  );
};

const FormBlackLists = ({
  data = {
    dialCode: "",
    phoneNumber: "",
  },
  isEdit = false,
  onNextChange,
  isLoadingEndpoint,
}: CreatNewFormProps<FormEssenceBlackList>) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onNext = (values: FormEssenceBlackList) => {
    onNextChange?.(values);
  };

  return (
    <Formik
      initialValues={data}
      enableReinitialize={true}
      validationSchema={validationSchemaBlackList}
      onSubmit={(values) => onNext(values)}
    >
      {({ values, touched, errors }) => {
        return (
          <Form>
            <FormContainer>
              <Card>
                <FormItem
                  label={t("formInput.blackLists.phone")}
                  invalid={
                    (errors.dialCode && touched.dialCode) ||
                    (errors.phoneNumber && touched.phoneNumber)
                  }
                  layout="horizontal"
                  errorMessage={errors.dialCode || errors.phoneNumber}
                  asterisk
                >
                  <InputGroup>
                    {/* <Field name="dialCode">
                      {({ field, form }: FieldProps) => (
                        <Select<CountryOption>
                          className="min-w-[130px]"
                          placeholder={t(
                            "formInput.blackLists.placeholder.dialCode",
                          )}
                          components={{
                            Option: PhoneSelectOption,
                            SingleValue: PhoneControl,
                          }}
                          field={field}
                          form={form}
                          options={countryList}
                          value={countryList.filter(
                            (country) => country.value === values.dialCode,
                          )}
                          onChange={(country) =>
                            form.setFieldValue(field.name, country?.value)
                          }
                        />
                      )}
                    </Field> */}
                    <Field name="phoneNumber">
                      {({ field, form }: FieldProps) => {
                        return (
                          <NumericFormatInput
                            size={"xs" as any}
                            form={form}
                            field={field}
                            customInput={NumberInput as ComponentType}
                            onValueChange={(e) => {
                              form.setFieldValue(field.name, e.value);
                            }}
                          />
                        );
                      }}
                    </Field>
                  </InputGroup>
                </FormItem>
              </Card>
              <div className="flex justify-end mt-4 gap-2">
                <Button
                  type="button"
                  onClick={() => navigate(`${routePrefix.black_list}`)}
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
                    : t(`${TableTextConst.BLACK_LIST}Page.buttons.createNew`)}
                </Button>
              </div>
            </FormContainer>
          </Form>
        );
      }}
    </Formik>
  );
};

export default FormBlackLists;
