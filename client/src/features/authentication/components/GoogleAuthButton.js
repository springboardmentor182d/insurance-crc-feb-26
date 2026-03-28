import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES, TOKEN_KEYS } from "../../../data/constants";
import googleAuth from "../services/googleAuth";

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const GOOGLE_SCRIPT_ID = "google-identity-services";

const loadGoogleScript = () =>
  new Promise((resolve, reject) => {
    const existing = document.getElementById(GOOGLE_SCRIPT_ID);
    if (existing) {
      if (window.google?.accounts?.oauth2) resolve();
      else existing.addEventListener("load", resolve, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = GOOGLE_SCRIPT_ID;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Unable to load Google Sign-In"));
    document.head.appendChild(script);
  });

const GoogleAuthButton = ({ label, onError }) => {
  const navigate = useNavigate();
  const tokenClientRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    if (!GOOGLE_CLIENT_ID) return undefined;

    loadGoogleScript()
      .then(() => {
        if (!active || !window.google?.accounts?.oauth2) return;
        tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: "openid email profile",
          callback: async (tokenResponse) => {
            if (tokenResponse.error) {
              setLoading(false);
              onError?.("Google sign-in was cancelled or failed.");
              return;
            }

            try {
              const data = await googleAuth(tokenResponse.access_token);
              localStorage.setItem(TOKEN_KEYS.ACCESS, data.access_token);
              localStorage.setItem(TOKEN_KEYS.REFRESH, data.refresh_token);
              localStorage.setItem(TOKEN_KEYS.USER, JSON.stringify(data.user));
              navigate(ROUTES.DASHBOARD);
            } catch (requestError) {
              onError?.(requestError.message);
            } finally {
              setLoading(false);
            }
          },
        });
      })
      .catch((loadError) => onError?.(loadError.message));

    return () => {
      active = false;
    };
  }, [navigate, onError]);

  const handleClick = () => {
    if (!GOOGLE_CLIENT_ID) {
      onError?.("Google sign-in is not configured yet.");
      return;
    }
    if (!tokenClientRef.current) {
      onError?.("Google sign-in is still loading. Please try again.");
      return;
    }

    setLoading(true);
    onError?.("");
    tokenClientRef.current.requestAccessToken({ prompt: "consent" });
  };

  return (
    <button type="button" className="auth-btn-google" onClick={handleClick} disabled={loading}>
      <span>{loading ? "Connecting..." : label}</span>
    </button>
  );
};

export default GoogleAuthButton;
