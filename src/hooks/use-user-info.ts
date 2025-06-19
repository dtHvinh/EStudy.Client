import api from "@/components/utils/requestUtils";
import useSWR from "swr";

export type UserInfoResponseType = {
  id: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  profilePicture?: string;
  creationDate: string;
  isOnBoarded: boolean;
};

export function useUserInfo() {
  const { data, error, isLoading, mutate } = useSWR<UserInfoResponseType>(
    "/api/user/me",
    api.get
  );

  return {
    user: data,
    getUserError: error,
    isUserLoading: isLoading,
    reload: mutate,
  };
}
