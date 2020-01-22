import http from '@/common/http';
import {
  LOGIN_API,
  REGISTER_ACCOUNT_API
} from '@/common/api';

/**
 * register a account
 * @param params
 */
const postRegisterData = (
  params: {
    username: string;
    password: string;
  }
): Promise<void> => {
  return new Promise<void>((resolve, reject): void => {
    http.post<void>(REGISTER_ACCOUNT_API, params)
      .then((): void => {
        resolve();
      })
      .catch((response): void => {
        reject(response);
      });
  });
};

/**
 * login
 * @param params
 */
const postLoginData = (
  params: {
    username: string;
    password: string;
  }
): Promise<string> => {
  return new Promise<string>((resolve, reject): void => {
    http.post<string>(LOGIN_API, params)
      .then((response): void => {
        resolve(response.data || '');
      })
      .catch((response): void => {
        reject(response);
      });
  });
};

export {
  postRegisterData,
  postLoginData
};
