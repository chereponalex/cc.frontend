import { TableTextConst } from "@/@types";
import { Button } from "@/components/ui";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "./index.css";
import routePrefix from "@/configs/routes.config/routePrefix";

const AccessDenied = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="access_denied_container">
      <p>{t(`${TableTextConst.ACCESS_DENIED}Page.card.title`)}</p>
      <Button
        type="button"
        size="xs"
        variant="default"
        onClick={() => navigate(`${routePrefix.home}`)}
        style={{ width: "100px", marginTop: "10px" }}
      >
        {t("global.home")}
      </Button>
    </div>
  );
};

export default AccessDenied;
