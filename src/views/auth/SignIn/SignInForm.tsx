import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
// import Checkbox from '@/components/ui/Checkbox'
import { FormItem, FormContainer } from "@/components/ui/Form";
import Alert from "@/components/ui/Alert";
import PasswordInput from "@/components/shared/PasswordInput";
import ActionLink from "@/components/shared/ActionLink";
import useTimeOutMessage from "@/utils/hooks/useTimeOutMessage";
import useAuth from "@/utils/hooks/useAuth";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import type { CommonProps } from "@/@types/common";
import { useTranslation } from "react-i18next";

interface SignInFormProps extends CommonProps {
  disableSubmit?: boolean;
  forgotPasswordUrl?: string;
  signUpUrl?: string;
}

type SignInFormSchema = {
  login: string;
  password: string;
  rememberMe: boolean;
};

const SignInForm = (props: SignInFormProps) => {
  const {
    disableSubmit = false,
    className,
    forgotPasswordUrl = "/forgot-password",
    signUpUrl = "/sign-up",
  } = props;

  const [message, setMessage] = useTimeOutMessage();

  const { signIn } = useAuth();

  const { t } = useTranslation();

  const validationSchema = Yup.object().shape({
    login: Yup.string().required(t("errorText.enterYourUserName")),
    password: Yup.string().required(t("errorText.enterYourPassword")),
    rememberMe: Yup.bool(),
  });

  const onSignIn = async (
    values: SignInFormSchema,
    setSubmitting: (isSubmitting: boolean) => void,
  ) => {
    const { login, password } = values;
    setSubmitting(true);

    const result = await signIn({ login, password });

    if (result?.status === "failed") {
      setMessage(result.message);
    }

    setSubmitting(false);
  };

  return (
    <div className={className}>
      {message && (
        <Alert showIcon className="mb-4" type="danger">
          <>{message}</>
        </Alert>
      )}
      <Formik
        initialValues={{
          login: "",
          password: "",
          rememberMe: false,
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          if (!disableSubmit) {
            onSignIn(values, setSubmitting);
          } else {
            setSubmitting(false);
          }
        }}
      >
        {({ touched, errors, isSubmitting }) => (
          <Form>
            <FormContainer>
              <FormItem
                bottom={1}
                label={t("authPage.signInForm.userName")}
                invalid={(errors.login && touched.login) as boolean}
                errorMessage={errors.login}
              >
                <Field
                  size="md"
                  type="text"
                  autoComplete="off"
                  name="login"
                  placeholder={t("authPage.signInForm.userName")}
                  component={Input}
                />
              </FormItem>
              <FormItem
                bottom={1}
                label={t("authPage.signInForm.password")}
                invalid={(errors.password && touched.password) as boolean}
                errorMessage={errors.password}
              >
                <Field
                  size="md"
                  autoComplete="off"
                  name="password"
                  placeholder={t("authPage.signInForm.password")}
                  component={PasswordInput}
                />
              </FormItem>
              <div className="flex justify-end mb-6">
                {/*    <Field*/}
                {/*        className="mb-0"*/}
                {/*        name="rememberMe"*/}
                {/*        component={Checkbox}*/}
                {/*    >*/}
                {/*        Remember Me*/}
                {/*    </Field>*/}
                <ActionLink to={forgotPasswordUrl}>
                  {t("authPage.signInForm.forgotPassword")}
                </ActionLink>
              </div>
              <Button
                block
                loading={isSubmitting}
                variant="solid"
                type="submit"
              >
                {isSubmitting
                  ? t("authPage.signInForm.buttons.SigningIn")
                  : t("authPage.signInForm.buttons.signIn")}
              </Button>
              {/*<div className="mt-4 text-center">*/}
              {/*    <span>{`Don't have an account yet?`} </span>*/}
              {/*    <ActionLink to={signUpUrl}>Sign up</ActionLink>*/}
              {/*</div>*/}
            </FormContainer>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SignInForm;
