import { TableTextConst } from "@/@types";
import { Loading } from "@/components/shared";
import { validationSchemaBindToBuilding } from "@/utils/validationForm";
import { Form, Formik } from "formik";
import { HiPlus } from "react-icons/hi";
import { FormContainer, FormItem } from "@/components/ui/Form";
import { useTranslation } from "react-i18next";
import { Button, Card, Select } from "@/components/ui";
import { components } from "react-select";
import "./index.css";
import { useState } from "react";
import { TypeTabTableResidentialComplex } from "@/@types/tabs";
import { useNavigate, useParams } from "react-router-dom";
import routePrefix from "@/configs/routes.config/routePrefix";
import { useAppSelector } from "@/store";

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

export const FormBindToBuilding = ({
  textConst,
  onNext,
  type,
  setBindMode,
  bindMode,
  selectedRowsData,
}: any) => {
  const permissions: any = useAppSelector(
    (state) => state.auth.user.role?.permissions,
  );

  const updateKey = `api.v1.crm.${TableTextConst.REALESTATEBUILDING}.update`;
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const onSubmit = () => {
    if (
      type === TypeTabTableResidentialComplex.PAYMENT_METHODS ||
      type === TypeTabTableResidentialComplex.METRO_STATIONS ||
      type === TypeTabTableResidentialComplex.TAGS
    ) {
      selectedRowsData.length > 0 && onNext({ [type]: selectedRowsData });
    } else {
      if (type === TypeTabTableResidentialComplex.OBJECTS) {
        navigate(
          //@ts-ignore
          `${routePrefix[textConst]}/creat-new?objectID=${id}`,
        );
      }
      if (type === TypeTabTableResidentialComplex.OFFERS) {
        navigate(
          //@ts-ignore
          `${routePrefix[textConst]}/creat-new?objectID=${id}`,
        );
      }
    }
  };

  const initialValues = {
    item: "",
  };
  return (
    <Loading type="cover" style={{ width: "100%" }}>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={validationSchemaBindToBuilding}
        onSubmit={(values) => onSubmit()}
      >
        {({ values, touched, errors }) => {
          return (
            <Form>
              <FormContainer>
                {type === TypeTabTableResidentialComplex.PAYMENT_METHODS ||
                type === TypeTabTableResidentialComplex.METRO_STATIONS ||
                type === TypeTabTableResidentialComplex.TAGS ? (
                  <>
                    {bindMode ? (
                      <>
                        <Button
                          variant="solid"
                          type="submit"
                          size="md"
                          style={{ minWidth: "100px", marginTop: "0.5rem" }}
                          className="float-right ml-5 pl-2 pr-2"
                          onClick={() => onSubmit()}
                        >
                          <p style={{ fontSize: "12px" }}>{t(`global.save`)}</p>
                        </Button>
                        <Button
                          type="button"
                          size="md"
                          style={{ minWidth: "100px", marginTop: "0.5rem" }}
                          className="float-right ml-5 pl-2 pr-2"
                          onClick={() => setBindMode(false)}
                        >
                          <p style={{ fontSize: "12px" }}>
                            {t(`global.close`)}
                          </p>
                        </Button>
                      </>
                    ) : (
                      <>
                        {/* {permissions[updateKey] && ( */}
                        <Button
                          type="button"
                          size="md"
                          style={{ minWidth: "100px", marginTop: "0.5rem" }}
                          className="float-right ml-5 pl-2 pr-2"
                          icon={<HiPlus />}
                          onClick={() => setBindMode(true)}
                        >
                          <p style={{ fontSize: "12px" }}>
                            {t(
                              `${
                                TableTextConst.REALESTATEBUILDING
                              }Page.buttons.${t(textConst)}AttachNew`,
                            )}
                          </p>
                        </Button>
                        {/* )} */}
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {/* {permissions[`api.v1.crm.${textConst}.create`] && ( */}
                    <Button
                      type="submit"
                      size="md"
                      style={{ minWidth: "100px", marginTop: "0.5rem" }}
                      className="float-right ml-5 pl-2 pr-2"
                      icon={<HiPlus />}
                      onClick={() => onSubmit()}
                    >
                      <p style={{ fontSize: "12px" }}>
                        {t(
                          `${TableTextConst.REALESTATEBUILDING}Page.buttons.${t(
                            textConst,
                          )}AttachNew`,
                        )}
                      </p>
                    </Button>
                    {/* )} */}
                  </>
                )}
              </FormContainer>
            </Form>
          );
        }}
      </Formik>
    </Loading>
  );
};
