import { useState } from "react";
import { FormItem, FormContainer } from "@/components/ui/Form";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import ActionLink from "@/components/shared/ActionLink";
import { apiForgotPassword } from "@/services/AuthService";
import useTimeOutMessage from "@/utils/hooks/useTimeOutMessage";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import type { CommonProps } from "@/@types/common";
import type { AxiosError } from "axios";
import { useTranslation } from "react-i18next";

interface ForgotPasswordFormProps extends CommonProps {
  disableSubmit?: boolean;
  signInUrl?: string;
}

type ForgotPasswordFormSchema = {
  email: string;
};

const ForgotPasswordForm = (props: ForgotPasswordFormProps) => {
  const { disableSubmit = false, className, signInUrl = "/sign-in" } = props;

  const [emailSent, setEmailSent] = useState(false);

  const { t } = useTranslation();

  const [message, setMessage] = useTimeOutMessage();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email(t("errorText.enterCorrectEmail"))
      .required(t("errorText.enterYourEmail")),
  });

  const onSendMail = async (
    values: ForgotPasswordFormSchema,
    setSubmitting: (isSubmitting: boolean) => void,
  ) => {
    setSubmitting(true);
    try {
      const resp = await apiForgotPassword(values);
      if (resp.data) {
        setSubmitting(false);
        setEmailSent(true);
      }
    } catch (errors) {
      setMessage(
        (errors as AxiosError<{ message: string }>)?.response?.data?.message ||
          (errors as Error).toString(),
      );
      setSubmitting(false);
    }
  };

  return (
    <div className={className}>
      <div className="mb-6">
        {emailSent ? (
          <>
            <h3 className="mb-1">
              {t("authPage.forgotPasswordForm.checkEmail")}
            </h3>
            <p>
              {t("authPage.forgotPasswordForm.passwordRecoveryInstruction")}
            </p>
          </>
        ) : (
          <>
            <h3 className="mb-1">
              {t("authPage.forgotPasswordForm.forgotPassword")}
            </h3>
            <p>{t("authPage.forgotPasswordForm.enterYourEmailAddress")}</p>
          </>
        )}
      </div>
      {message && (
        <Alert showIcon className="mb-4" type="danger">
          {message}
        </Alert>
      )}
      <Formik
        initialValues={{
          email: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          if (!disableSubmit) {
            onSendMail(values, setSubmitting);
          } else {
            setSubmitting(false);
          }
        }}
      >
        {({ touched, errors, isSubmitting }) => (
          <Form>
            <FormContainer>
              <div className={emailSent ? "hidden" : ""}>
                <FormItem
                  invalid={errors.email && touched.email}
                  errorMessage={errors.email}
                >
                  <Field
                    type="email"
                    autoComplete="off"
                    name="email"
                    placeholder="Email"
                    component={Input}
                  />
                </FormItem>
              </div>
              <Button
                block
                loading={isSubmitting}
                variant="solid"
                type="submit"
              >
                {emailSent
                  ? t("authPage.forgotPasswordForm.buttons.resendEmail")
                  : t("authPage.forgotPasswordForm.buttons.sendEmail")}
              </Button>
              <div className="mt-4 text-center">
                <span>{t("authPage.forgotPasswordForm.backTo") + " "}</span>
                <ActionLink to={signInUrl}>
                  {t("authPage.forgotPasswordForm.signIn")}
                </ActionLink>
              </div>
            </FormContainer>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ForgotPasswordForm;
