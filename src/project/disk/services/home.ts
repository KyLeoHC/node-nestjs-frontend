import http from '@/common/http';
import {
  GET_USER_PROFILE_API
} from '@/common/api';

export interface UserProfile {
  id: string;
  username: string;
}

/**
 * get user profile data
 * @param params
 */
const getUserProfileData = (): Promise<UserProfile> => {
  return new Promise<UserProfile>((resolve, reject): void => {
    http.get<UserProfile>(GET_USER_PROFILE_API)
      .then((response): void => {
        resolve(response.data);
      })
      .catch((response): void => {
        reject(response);
      });
  });
};

export {
  getUserProfileData
};
