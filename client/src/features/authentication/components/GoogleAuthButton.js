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
              navigate(ROUTES.AUTH_STATUS);
            } catch (error) {
              onError?.(error.message);
            } finally {
              setLoading(false);
            }
          },
        });
      })
      .catch((error) => onError?.(error.message));

    return () => {
      active = false;
    };
  }, [navigate, onError]);

  const handleClick = () => {
    if (!GOOGLE_CLIENT_ID) {
      onError?.("Google sign-in is not configured yet. Add REACT_APP_GOOGLE_CLIENT_ID and GOOGLE_CLIENT_ID first.");
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
      <svg width="18" height="18" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
      <span>{loading ? "Connecting..." : label}</span>
    </button>
  );
};

export default GoogleAuthButton;
