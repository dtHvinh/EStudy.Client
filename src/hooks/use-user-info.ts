import api from "@/components/utils/requestUtils";
import useSWR from "swr";

type UserInfoResponseType = {
  id: string;
  name: string;
  email?: string;
  phoneNumber?: string;
};

export function useUserInfo() {
  const { data, error, isLoading } = useSWR<UserInfoResponseType>(
    "/api/user/me",
    api.get
  );

  return { user: data, getUserError: error, isUserLoading: isLoading };
}
