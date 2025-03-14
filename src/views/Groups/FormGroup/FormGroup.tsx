import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Loading } from "@/components/shared";
import { Field, Form, Formik } from "formik";
import { Button, Card } from "@/components/ui";
import { FormItem, FormContainer } from "@/components/ui/Form";

import Input from "@/components/ui/Input";
import { useEffect, useMemo, useState } from "react";
import { validationSchemaGroup } from "@/utils/validationForm";
import { TableTextConst } from "@/@types";
import routePrefix from "@/configs/routes.config/routePrefix";
import TableGroup from "@/components/shared/TableGroup";
import { useGetGroupActionInfoQuery } from "@/services/RtkQueryService";
import { useAppSelector } from "@/store";
import useDarkMode from "@/utils/hooks/useDarkmode";

type GroupDataProps = {
  employee_id: string;
  status: string;
};

const FormGroup = ({
  data,
  isEdit = false,
  onNextChange,
  isLoadingEndpoint,
  duplicate,
}: any) => {
  const [isDark] = useDarkMode();
  const { mode } = useAppSelector((state) => state.theme);

  const { data: selectInfo, isLoading: isLoadingSelectInfo } =
    //@ts-ignore
    useGetGroupActionInfoQuery();

  const { t } = useTranslation();
  const navigate = useNavigate();
  const [dataCollection, setDataColletion] = useState<GroupDataProps[]>([]);
  useEffect(() => {
    setDataColletion(
      data?.employees.map((item: any) => ({
        ...item,
        employee_id: item.id,
        status: item.status.key,
      })),
    );
  }, [data]);

  const onNext = (values: any, duplicate: boolean) => {
    const filteredEmployees = dataCollection?.filter(
      (employee: any) => employee.employee_id && employee.status,
    );
    const onlyChangeFields =
      filteredEmployees?.length > 0
        ? { employees: filteredEmployees }
        : ({} as any);

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
        : filteredEmployees.length > 0
          ? { ...values, employees: filteredEmployees }
          : values,
    );
  };

  const initialValues: any = useMemo(() => {
    return {
      name: data?.name || "",
    };
  }, [data]);

  return (
    <Loading type="cover" loading={isLoadingEndpoint && isLoadingSelectInfo}>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={validationSchemaGroup}
        onSubmit={(values) => onNext(values, duplicate)}
      >
        {({ values, touched, errors }) => {
          return (
            <Form>
              <FormContainer>
                <Card>
                  <FormItem
                    label={t("formInput.group.name")}
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
                      placeholder="Имя"
                      component={Input}
                    />
                  </FormItem>
                </Card>

                <Card style={{ marginTop: "10px" }}>
                  <TableGroup
                    selectInfo={selectInfo?.data}
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
                    background: isDark ? "#1f2937" : "white",
                  }}
                >
                  <Button
                    type="button"
                    onClick={() => navigate(`${routePrefix.groups}`)}
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
                      : t(`${TableTextConst.GROUPS}Page.buttons.createNew`)}
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
export default FormGroup;
