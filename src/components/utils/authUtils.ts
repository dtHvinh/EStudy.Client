import { getCookie } from "cookies-next/client";
import { ACCESS_TOKEN_COOKIE } from "./requestUtils";

export default function isAuthenticated(): boolean {
  return getCookie(ACCESS_TOKEN_COOKIE) !== undefined;
}
