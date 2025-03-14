import { useTranslation } from "react-i18next";
import { Field, FieldProps, Form, Formik } from "formik";
import { FormItem, FormContainer } from "@/components/ui/Form";
import { Button, Card, Select, TimeInput } from "@/components/ui";
import { useNavigate } from "react-router-dom";
import { CreatNewFormProps } from "@/@types/props";
import { validationSchemaWorkingHour } from "@/utils/validationForm";
import { FormEssence } from "@/@types/form";
import { TableTextConst, WorkTime } from "@/@types";
import { useGetWorkTimeActionInfoQuery } from "@/services/RtkQueryService";
import { Loading } from "@/components/shared";
import { useEffect, useMemo, useState } from "react";
import timeFormatHHMM from "@/utils/timeFormatHHMM";
import routePrefix from "@/configs/routes.config/routePrefix";
import { components } from "react-select";
import { HiPlus, HiTrash } from "react-icons/hi";
import { useAppSelector } from "@/store";
import useDarkMode from "@/utils/hooks/useDarkmode";

const FormTime = ({
  values,
  errors,
  touched,
  time,
  onChange,
  onDelete,
  canDelete,
}: any) => {
  const { t } = useTranslation();

  return (
    <Card style={{ marginBottom: "5px" /* , maxWidth: "90%" */ }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ width: "100%" }}>
          <FormItem
            label={t("formInput.workingHours.timeStart")}
            layout="horizontal"
            invalid={errors.start && (touched.start as boolean)}
            errorMessage={errors.start as string}
          >
            <TimeInput
              size="xs"
              value={
                values.start ? new Date(`1999-01-01 ${values.start}`) : null
              }
              onChange={(start: any) => {
                onChange({
                  ...time,
                  start: start ? timeFormatHHMM(start) : start,
                });
              }}
            />
          </FormItem>
          <FormItem
            label={t("formInput.workingHours.timeEnd")}
            layout="horizontal"
            invalid={errors.end && (touched.end as boolean)}
            errorMessage={errors.end as string}
          >
            <TimeInput
              size="xs"
              value={values.end ? new Date(`1999-01-01 ${values.end}`) : null}
              onChange={(end) => {
                onChange({ ...time, end: end ? timeFormatHHMM(end) : end });
              }}
            />
          </FormItem>
        </div>

        {canDelete && (
          <Button
            style={{ marginLeft: "10px", marginTop: "10px" }}
            type="button"
            shape="circle"
            variant="plain"
            size="xs"
            icon={<HiTrash size={20} />}
            onClick={onDelete}
          />
        )}
      </div>
    </Card>
  );
};

const FormWorkingHour = ({
  data,
  isEdit = false,
  onNextChange,
  isLoadingEndpoint,
  offer_id,
}: CreatNewFormProps<FormEssence<WorkTime>>) => {
  const { mode } = useAppSelector((state) => state.theme);
  const [isDark] = useDarkMode();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [daySelected, setDaySelected] = useState<{
    [key: string]: { start: string; end: string }[];
  }>({});

  useEffect(() => {
    console.log(daySelected, "daySelected");
  }, [daySelected]);

  const { data: selectInfo, isLoading: isLoadingSelectInfo } =
    //@ts-ignore
    useGetWorkTimeActionInfoQuery();

  const createNewTimePeriod = (day: any) => {
    setDaySelected((prev: any) => {
      return {
        ...prev,
        [day]: [...prev[day], { start: "00:00", end: "00:00" }],
      };
    });
  };

  const offers = selectInfo?.data.offers || {};
  const week_days = selectInfo?.data.week_days || {};

  const optionsOffers = useMemo(() => {
    const data = Object.entries(offers);
    return data.map(([id, value]) => ({
      label: value,
      value: id,
    }));
  }, [offers]);

  const optionsWeekDays = useMemo(() => {
    const data = Object.entries(week_days);
    return data.map(([id, value]) => ({
      label: value,
      value: id,
    }));
  }, [week_days]);

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
  const onNext = (values: FormEssence<WorkTime>) => {
    let payload: { start: string; end: string; day: number }[] = [];
    for (const [key, value] of Object.entries(daySelected)) {
      value.forEach((el) => {
        payload.push({ ...el, day: Number(key) });
      });
    }

    onNextChange?.({ ...values, days: payload });
  };

  const initialValues: any = useMemo(() => {
    return {
      offer_id: offer_id ? offer_id : data?.offer?.id || "",
      days: data?.days || "",
    };
  }, [data]);

  const handleChange = (e: { label: string; value: string }[]) => {
    console.log(e, "e");
    setDaySelected((prev) => {
      let objItem: any = {};

      e.forEach((item: { label: string; value: string }) => {
        if (prev[item.value]) {
          objItem[item.value] = prev[item.value];
        } else {
          objItem[item.value] = [{ start: "00:00", end: "00:00" }];
        }
      });
      return objItem;
    });
    // form.setValue(field.name, e);
  };
  const handleDeleteTimeGap = (day: string, index: number) => {
    setDaySelected((prev: any) => {
      prev[day].splice(index, 1);
      console.log("ddd", index, prev);
      return { ...prev };
    });
  };
  const handleFormTimeChange = (
    key: string,
    index: number,
    field: any,
    forceDelete = false,
  ) => {
    setDaySelected((prev: any) => {
      if (forceDelete) {
        prev[key].splice(index, 1);
      } else {
        prev[key][index] = field;
      }
      return { ...prev };
    });
  };
  console.log(`${routePrefix.offer}/${offer_id}`, "offer");
  return (
    <Loading loading={isLoadingSelectInfo} type="cover">
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={validationSchemaWorkingHour}
        onSubmit={(values) => onNext(values)}
      >
        {({ values, touched, errors }) => {
          return (
            <Form>
              <FormContainer>
                <Card>
                  <FormItem
                    label={t("formInput.workingHours.offer")}
                    invalid={errors.offer_id && (touched.offer_id as boolean)}
                    errorMessage={errors.offer_id as string}
                    layout="horizontal"
                    asterisk
                  >
                    <Field name="offer_id">
                      {({ field, form }: FieldProps) => (
                        <Select
                          size="xs"
                          placeholder=""
                          field={field}
                          form={form}
                          options={optionsOffers}
                          value={optionsOffers.filter(
                            (offer) => offer.value === values.offer_id,
                          )}
                          onChange={(offer: any) => {
                            if (offer) {
                              form.setFieldValue(field.name, offer.value);
                            }
                          }}
                        />
                      )}
                    </Field>
                  </FormItem>
                  <div
                    style={{
                      position: "sticky",
                      top: "7%",
                      zIndex: 10,
                      // borderBottom: "1px solid #4b5563",
                      background: isDark ? "#1f2937" : "white",
                    }}
                  >
                    <FormItem
                      label={t("formInput.workingHours.daysOfTheWeek")}
                      invalid={errors.days_id && (touched.days_id as boolean)}
                      errorMessage={errors.days_id as string}
                      layout="horizontal"
                      asterisk
                    >
                      <Select
                        placeholder=""
                        size="xs"
                        isMulti
                        options={optionsWeekDays}
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        components={{
                          Option,
                        }}
                        onChange={(e: any) => handleChange(e)}
                      />
                    </FormItem>
                  </div>

                  {Object.keys(daySelected)?.length > 0 &&
                    Object.keys(daySelected)?.map((day: any, index: number) => {
                      return (
                        // <Card key={index} style={{ marginBottom: "15px" }}>
                        <>
                          <FormItem
                            label={week_days[day]}
                            layout="vertical"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              marginBottom: "17px",
                              fontWeight: 900,
                              alignItems: "end",
                            }}
                            asterisk
                          >
                            <div className="max-w-screen-lg">
                              {daySelected[day].map(
                                (
                                  time: { start: string; end: string },
                                  i: number,
                                ) => {
                                  return (
                                    <FormTime
                                      key={i}
                                      setDaySelected={setDaySelected}
                                      time={time}
                                      canDelete={daySelected[day].length > 1}
                                      values={time}
                                      errors={errors}
                                      touched={touched}
                                      onChange={(field: {
                                        start: string;
                                        end: string;
                                      }) => handleFormTimeChange(day, i, field)}
                                      onDelete={() =>
                                        handleDeleteTimeGap(day, i)
                                      }
                                    />
                                  );
                                },
                              )}
                            </div>
                            <Button
                              className="right"
                              size="xs"
                              icon={<HiPlus size={15} />}
                              onClick={() => createNewTimePeriod(day)}
                              type="button"
                            >
                              Добавить временной промежуток
                            </Button>
                          </FormItem>
                        </>
                        // </Card>
                      );
                    })}

                  {/* <FormItem
                  label={t("formInput.workingHours.timeStart")}
                  layout="horizontal"
                  invalid={errors.start && (touched.start as boolean)}
                  errorMessage={errors.start as string}
                >
                  <Field name="start" placeholder="Date">
                    {({ field, form }: FieldProps) => (
                      <TimeInput
                        field={field}
                        form={form}
                        value={
                          values.start
                            ? new Date(`1999-01-01 ${values.start}`)
                            : null
                        }
                        onChange={(time) => {
                          form.setFieldValue(
                            field.name,
                            time ? timeFormatHHMM(time) : time,
                          );
                        }}
                      />
                    )}
                  </Field>
                </FormItem>
                <FormItem
                  label={t("formInput.workingHours.timeEnd")}
                  layout="horizontal"
                  invalid={errors.end && (touched.end as boolean)}
                  errorMessage={errors.end as string}
                >
                  <Field name="end" placeholder="Date">
                    {({ field, form }: FieldProps) => (
                      <TimeInput
                        field={field}
                        form={form}
                        value={
                          values.end
                            ? new Date(`1999-01-01 ${values.end}`)
                            : null
                        }
                        onChange={(time) => {
                          console.log(time);
                          form.setFieldValue(
                            field.name,
                            time ? timeFormatHHMM(time) : time,
                          );
                        }}
                      />
                    )}
                  </Field>
                </FormItem> */}

                  <div
                    className="flex justify-end mt-4 gap-2"
                    style={{
                      padding: "10px",
                      position: "sticky",
                      bottom: 0,
                      // zIndex: 10,
                      borderTop: "2px solid #4b5563",
                      background: isDark ? "#1f2937" : "white",
                    }}
                  >
                    <Button
                      type="button"
                      onClick={() =>
                        navigate(
                          offer_id
                            ? `${routePrefix.offer}/${offer_id}`
                            : `${routePrefix.work_time}`,
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
                            `${TableTextConst.WORK_TIME}Page.buttons.createNew`,
                          )}
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

export default FormWorkingHour;
