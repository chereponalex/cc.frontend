import SignInForm from "./SignInForm";
import { useTranslation } from "react-i18next";

const SignIn = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className="mb-8">
        <h3 className="mb-1">{t("authPage.signInForm.welcome")}</h3>
        <p>{t("authPage.signInForm.enterYourCredentials")}</p>
      </div>
      <SignInForm disableSubmit={false} />
    </>
  );
};

export default SignIn;
