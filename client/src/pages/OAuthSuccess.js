import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TOKEN_KEYS, ROUTES } from "../../../data/constants";

const OAuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const access = params.get("access");
    const refresh = params.get("refresh");

    if (access && refresh) {
      localStorage.setItem(TOKEN_KEYS.ACCESS, access);
      localStorage.setItem(TOKEN_KEYS.REFRESH, refresh);

      navigate(ROUTES.DASHBOARD);
    }
  }, [navigate]);

  return <div>Logging you in...</div>;
};

export default OAuthSuccess;