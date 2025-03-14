import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Radio from "@/components/ui/Radio";
import BaseService from "@/services/BaseService";

import { CreatNewFormOfferProps } from "@/@types/props";

import { Loading } from "@/components/shared";
import { Field, FieldProps, Form, Formik } from "formik";
import { Button, Card, Checkbox, Select, Switcher } from "@/components/ui";
import { FormItem, FormContainer } from "@/components/ui/Form";

import Input from "@/components/ui/Input";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { TableTextConst } from "@/@types";
import routePrefix from "@/configs/routes.config/routePrefix";
import { validationSchemaOffer } from "@/utils/validationForm";
import { useGetOfferActionInfoQuery } from "@/services/RtkQueryService";
import { useAppSelector } from "@/store";
import { components } from "react-select";
import useDarkMode from "@/utils/hooks/useDarkmode";
import cs from "classnames";
import "../index.css";

const SwitcherComponent = ({ form, field, value }: any) => {
  const onSwitcherToggle = (value: boolean) => {
    form.setFieldValue(field.name, !value);
  };

  return (
    <div>
      <Switcher checked={value} color="green-500" onChange={onSwitcherToggle} />
    </div>
  );
};
const NoOptionsMessage = (props: any) => {
  const { t } = useTranslation();
  return (
    <components.NoOptionsMessage {...props}>
      <span>{t(`select.noOptions`)}</span>
    </components.NoOptionsMessage>
  );
};

const CheckBoxComponent = ({ form, field, value }: any) => {
  const onCheck = () => {
    form.setFieldValue(field.name, !value);
  };

  return <Checkbox checked={value} color="green-500" onChange={onCheck} />;
};

const Option = (props: any) => {
  return (
    <div>
      <components.Option {...props}>
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
          style={{ marginTop: "-10px" }}
        />
        <label style={{ marginLeft: "10px" }}>{props.label}</label>
      </components.Option>
    </div>
  );
};

const FormOffer = ({
  data,
  isEdit = false,
  onNextChange,
  isLoadingEndpoint,
  duplicate,
  object_id,
}: CreatNewFormOfferProps) => {
  const [isDark] = useDarkMode();
  const { mode } = useAppSelector((state) => state.theme);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: selectInfo, isLoading: isLoadingSelectInfo } =
    //@ts-ignore
    useGetOfferActionInfoQuery();

  const real_estate_buildings = selectInfo?.data.real_estate_buildings || {};
  const marketplaces = selectInfo?.data.marketplaces || {};
  const cities = selectInfo?.data.cities || {};
  const developers = selectInfo?.data.developers || {};
  const scripts = selectInfo?.data.scripts || {};

  const onNext = (values: any, duplicate: boolean) => {
    const copiedValues = { ...values };
    copiedValues.scripts = copiedValues.scripts.map((el: any) => el.value);
    const onlyChangeFields = {} as any;
    if (duplicate === null) {
      Object.keys(values).forEach((key) => {
        if (values[key] !== initialValues[key]) {
          if (key === "scripts") {
            onlyChangeFields[key] = values[key].map((el: any) => el.value);
          } else {
            onlyChangeFields[key] = values[key];
          }
        }
      });
    }
    onNextChange?.(duplicate === null ? onlyChangeFields : copiedValues);
  };

  const initialValues: any = useMemo(() => {
    return {
      external_id: data?.external_id || "",
      is_active: data?.is_active || false,
      priority: data?.priority?.toString() || "",
      name: data?.name || "",
      expert_mode: data?.expert_mode || false,
      real_estate_building_id: data?.real_estate_building.id || "",
      marketplace_id: data?.marketplace?.id || "",
      city_id: data?.city?.id || "",
      developer_id: data?.developer?.id || "",
      scripts: data
        ? Object.values(data?.scripts || {})?.map((el: any) => ({
            label: el.name,
            value: el.id,
          }))
        : [],
      price: data?.price?.toString() || "",
      operator_award: data?.operator_award.toString() || "",
      sip_uri: data?.sip_uri || "",
      is_transmit_sip: data?.is_transmit_sip || false,
      uniqueness_period: data?.uniqueness_period?.toString() || "",
      limit: data?.limit?.toString() || "",
      not_looking_for_himself: data?.not_looking_for_himself || false,
      client_is_out_of_town: data?.client_is_out_of_town || false,
    };
  }, [data]);

  const optionsMarketPlaces = useMemo(() => {
    const data = Object.entries(marketplaces);
    return data.map(([id, value]) => ({
      label: value,
      value: id,
    }));
  }, [marketplaces]);

  const optionsCities = useMemo(() => {
    const result = [];
    for (const cityId in cities) {
      for (const valueId in cities[cityId]) {
        result.push({
          label: cities[cityId][valueId],
          value: valueId,
        });
      }
    }
    return result;
  }, [cities]);

  const optionsScripts = useMemo(() => {
    const data = Object.entries(scripts);
    return data.map(([id, value]) => ({
      label: value,
      value: id,
    }));
  }, [scripts]);

  const actualOptions = (dataObj: any) => {
    if (dataObj) {
      return Object.entries(dataObj)?.map(([value, label]) => ({
        label,
        value,
      }));
    }
  };

  return (
    <Loading type="cover" loading={data && isLoadingSelectInfo}>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={validationSchemaOffer}
        onSubmit={(values) => onNext(values, duplicate)}
      >
        {({ values, touched, errors }) => {
          return (
            <Form>
              <FormContainer>
                <Card>
                  <FormItem
                    noPadding
                    label={t("formInput.offer.external_id")}
                    invalid={
                      errors.external_id && (touched.external_id as boolean)
                    }
                    errorMessage={errors.external_id as string}
                    layout="horizontal"
                  >
                    <Field
                      size="xs"
                      type="text"
                      autoComplete="off"
                      name="external_id"
                      placeholder=""
                      component={Input}
                    />
                  </FormItem>
                  <FormItem
                    noPadding
                    label={t("formInput.offer.is_active")}
                    invalid={errors.is_active && (touched.is_active as boolean)}
                    errorMessage={errors.is_active as string}
                    layout="horizontal"
                  >
                    <Field name="is_active">
                      {({ field, form }: FieldProps) => (
                        <SwitcherComponent
                          field={field}
                          form={form}
                          value={values.is_active}
                        />
                      )}
                    </Field>
                  </FormItem>
                  <FormItem
                    noPadding
                    label={t("formInput.offer.priority")}
                    invalid={errors.priority && (touched.priority as boolean)}
                    errorMessage={errors.priority as string}
                    layout="horizontal"
                    asterisk
                  >
                    <Field
                      size="xs"
                      type="text"
                      autoComplete="off"
                      name="priority"
                      placeholder=""
                      component={Input}
                    />
                  </FormItem>
                  <FormItem
                    label={t("formInput.offer.expert_mode")}
                    noPadding
                    invalid={
                      errors.expert_mode && (touched.expert_mode as boolean)
                    }
                    errorMessage={errors.expert_mode as string}
                    layout="horizontal"
                  >
                    <Field name="expert_mode">
                      {({ field, form }: FieldProps) => (
                        <CheckBoxComponent
                          field={field}
                          form={form}
                          value={values.expert_mode}
                        />
                      )}
                    </Field>
                  </FormItem>
                  <FormItem
                    label={t("formInput.offer.marketplace")}
                    invalid={
                      errors.marketplace_id &&
                      (touched.marketplace_id as boolean)
                    }
                    errorMessage={errors.marketplace_id as string}
                    layout="horizontal"
                    asterisk
                  >
                    <Field name="marketplace_id">
                      {({ field, form }: FieldProps) => (
                        <Select
                          size="xs"
                          placeholder=""
                          field={field}
                          form={form}
                          components={{ NoOptionsMessage }}
                          options={optionsMarketPlaces}
                          value={optionsMarketPlaces.filter((market: any) => {
                            return market.value === values.marketplace_id;
                          })}
                          onChange={(market) => {
                            if (market) {
                              form.setFieldValue(field.name, market.value);
                            }
                          }}
                        />
                      )}
                    </Field>
                  </FormItem>
                  <FormItem
                    label={t("formInput.offer.city")}
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
                          options={optionsCities}
                          value={optionsCities.filter((city: any) => {
                            return city.value === values.city_id;
                          })}
                          onChange={(city: any) => {
                            if (city) {
                              form.setFieldValue(field.name, city.value);
                              form.setFieldValue(
                                "real_estate_building_id",
                                null,
                              );
                              form.setFieldValue("developer_id", null);
                            }
                          }}
                        />
                      )}
                    </Field>
                  </FormItem>
                  <FormItem
                    label={t("formInput.offer.real_estate_buildings")}
                    invalid={
                      errors.real_estate_building_id &&
                      (touched.real_estate_building_id as boolean)
                    }
                    errorMessage={errors.real_estate_building_id as string}
                    layout="horizontal"
                    asterisk
                  >
                    <Field name="real_estate_building_id">
                      {({ field, form }: FieldProps) => (
                        <Select
                          size="xs"
                          placeholder=""
                          isDisabled={!values.city_id}
                          field={field}
                          form={form}
                          options={actualOptions(
                            real_estate_buildings[values.city_id],
                          )}
                          value={actualOptions(
                            real_estate_buildings[values.city_id],
                          )?.filter((object: any) => {
                            return (
                              object.value === values.real_estate_building_id
                            );
                          })}
                          onChange={(object) => {
                            if (object) {
                              form.setFieldValue(field.name, object.value);
                              form.setFieldValue(
                                "developer_id",
                                null,
                                // developers[values.real_estate_building_id],
                              );
                            }
                          }}
                        />
                      )}
                    </Field>
                  </FormItem>
                  <FormItem
                    label={t("formInput.offer.developer")}
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
                          isDisabled={
                            !values.real_estate_building_id ||
                            !values.real_estate_building_id
                          }
                          options={actualOptions(
                            developers[values.real_estate_building_id],
                          )}
                          value={
                            developers[values.real_estate_building_id]
                              ? actualOptions(
                                  developers[values.real_estate_building_id],
                                )?.filter((developer: any) => {
                                  return (
                                    developer.value === values.developer_id
                                  );
                                })
                              : null
                          }
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
                    label={t("formInput.offer.name")}
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
                    label={t("formInput.offer.scripts")}
                    invalid={errors.scripts && (touched.scripts as boolean)}
                    errorMessage={errors.scripts as string}
                    layout="horizontal"
                    asterisk
                  >
                    <Field name="scripts">
                      {({ field, form }: FieldProps) => (
                        <Select
                          className={cs({
                            "invalid-input": errors.scripts && touched.scripts,
                            "dark-mode": isDark === true,
                            "light-mode": isDark === false,
                          })}
                          size="xs"
                          placeholder=""
                          isLoading={data && isLoadingSelectInfo}
                          isMulti
                          options={optionsScripts}
                          closeMenuOnSelect={false}
                          hideSelectedOptions={false}
                          components={{ Option }}
                          value={values.scripts}
                          onChange={(script: any) => {
                            if (script) {
                              form.setFieldValue(field.name, script);
                            }
                          }}
                        />
                      )}
                    </Field>
                  </FormItem>
                  <FormItem
                    label={t("formInput.offer.price")}
                    invalid={errors.price && (touched.price as boolean)}
                    errorMessage={errors.price as string}
                    layout="horizontal"
                    asterisk
                  >
                    <Field
                      size="xs"
                      type="text"
                      autoComplete="off"
                      name="price"
                      placeholder=""
                      component={Input}
                    />
                  </FormItem>
                  <FormItem
                    label={t("formInput.offer.operator_award")}
                    invalid={
                      errors.operator_award &&
                      (touched.operator_award as boolean)
                    }
                    errorMessage={errors.operator_award as string}
                    layout="horizontal"
                    asterisk
                  >
                    <Field
                      size="xs"
                      type="text"
                      autoComplete="off"
                      name="operator_award"
                      placeholder=""
                      component={Input}
                    />
                  </FormItem>
                  <FormItem
                    label={t("formInput.offer.sip_uri")}
                    invalid={errors.sip_uri && (touched.sip_uri as boolean)}
                    errorMessage={errors.sip_uri as string}
                    layout="horizontal"
                    asterisk
                  >
                    <Field
                      size="xs"
                      type="text"
                      autoComplete="off"
                      name="sip_uri"
                      placeholder=""
                      component={Input}
                    />
                    <Field name="is_transmit_sip">
                      {({ field, form }: FieldProps) => (
                        <div className="mt-2 mb-1 flex">
                          <CheckBoxComponent
                            field={field}
                            form={form}
                            value={values.is_transmit_sip}
                          />
                          <p>Не передавать SIP в UIS</p>
                        </div>
                      )}
                    </Field>
                  </FormItem>
                  <FormItem
                    label={t("formInput.offer.uniqueness_period")}
                    invalid={
                      errors.uniqueness_period &&
                      (touched.uniqueness_period as boolean)
                    }
                    errorMessage={errors.uniqueness_period as string}
                    layout="horizontal"
                    asterisk
                  >
                    <Field
                      size="xs"
                      type="text"
                      autoComplete="off"
                      name="uniqueness_period"
                      placeholder=""
                      component={Input}
                    />
                  </FormItem>
                  <FormItem
                    label={t("formInput.offer.limit")}
                    invalid={errors.limit && (touched.limit as boolean)}
                    errorMessage={errors.limit as string}
                    layout="horizontal"
                    asterisk
                  >
                    <Field
                      size="xs"
                      type="text"
                      autoComplete="off"
                      name="limit"
                      placeholder=""
                      component={Input}
                    />
                  </FormItem>
                  <FormItem
                    noPadding
                    label={t("formInput.offer.not_looking_for_himself")}
                    invalid={
                      errors.not_looking_for_himself &&
                      (touched.not_looking_for_himself as boolean)
                    }
                    errorMessage={errors.not_looking_for_himself as string}
                    layout="horizontal"
                  >
                    <Field name="not_looking_for_himself">
                      {({ field, form }: FieldProps) => (
                        <CheckBoxComponent
                          field={field}
                          form={form}
                          value={values.not_looking_for_himself}
                        />
                      )}
                    </Field>
                  </FormItem>
                  <FormItem
                    noPadding
                    label={t("formInput.offer.client_is_out_of_town")}
                    invalid={
                      errors.client_is_out_of_town &&
                      (touched.client_is_out_of_town as boolean)
                    }
                    errorMessage={errors.client_is_out_of_town as string}
                    layout="horizontal"
                  >
                    <Field name="client_is_out_of_town">
                      {({ field, form }: FieldProps) => (
                        <CheckBoxComponent
                          field={field}
                          form={form}
                          value={values.client_is_out_of_town}
                        />
                      )}
                    </Field>
                  </FormItem>

                  <div
                    className="flex justify-end mt-4 gap-2"
                    style={{
                      width: "100%",
                      // maxWidth: "1000px",
                      padding: "10px",
                      position: "sticky",
                      bottom: 0,
                      zIndex: 10,
                      borderTop: "2px solid #4b5563",
                      background: isDark ? "#1f2937" : "white",
                    }}
                  >
                    <Button
                      type="button"
                      onClick={() =>
                        navigate(
                          object_id
                            ? `${routePrefix.real_estate_building}/${object_id}`
                            : `${routePrefix.offer}`,
                        )
                      }
                    >
                      {t("global.close")}
                    </Button>
                    <Button
                      loading={isLoadingEndpoint || isLoadingSelectInfo}
                      variant="solid"
                      type="submit"
                    >
                      {isEdit
                        ? t("global.save")
                        : t(`${TableTextConst.OFFER}Page.buttons.createNew`)}
                    </Button>
                  </div>
                </Card>
              </FormContainer>
            </Form>
          );
        }}
      </Formik>
    </Loading>
  );
};
export default FormOffer;
