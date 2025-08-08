import api from "@/components/utils/requestUtils";
import useSWR from "swr";

export interface GetUserProfileResponse {
  id: number;
  userName: string;
  name: string;
  email: string;
  phoneNumber: string;
  profilePicture?: string;
  bio?: string;
}

export default function useUserProfile({ userName }: { userName?: string }) {
  const key = userName ? `/api/user/profile/${userName}` : `/api/user/profile`;
  const {
    data: userProfile,
    isLoading,
    error,
  } = useSWR<GetUserProfileResponse>(key, api.get);
  return { userProfile, isLoading, error };
}
