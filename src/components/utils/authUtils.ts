import { getCookie } from "cookies-next/client";
import { ACCESS_TOKEN_COOKIE } from "./requestUtils";

export default function isAuthenticated(): boolean {
  return getCookie(ACCESS_TOKEN_COOKIE) !== undefined;
}

export function getAccessToken(): string | undefined {
  const token = getCookie(ACCESS_TOKEN_COOKIE);
  return typeof token === "string" ? token : undefined;
}
