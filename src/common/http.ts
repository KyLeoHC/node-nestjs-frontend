/* eslint @typescript-eslint/no-explicit-any: 0 */
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  Canceler
} from 'axios';
import router from '@/project/disk/router';
import { Toast } from 'vant';
import {
  getToken,
  clearToken
} from '@/common/auth';
import {
  baseUrl
} from './env';

export enum ServerResponseCode {
  SUCCESS = '200',
  UNAUTHORIZED = '401'
}

const isCancel = axios.isCancel;
const CancelToken = axios.CancelToken;
const axiosConfig: AxiosRequestConfig = {
  baseURL: baseUrl,
  timeout: 10000,
  withCredentials: true
};
const axiosInstance = axios.create(axiosConfig);

axios.defaults.headers.post['Content-Type'] = 'application/json';

axiosInstance.interceptors.request.use(function (config): AxiosRequestConfig {
  const token = getToken();
  if (token) {
    config.headers.common.Authorization = `Bearer ${token}`;
  }
  return config;
}, function (error): Promise<any> {
  return Promise.reject(error);
});

axiosInstance.interceptors.response.use(function (response): any {
  let message = '';
  const data = response.data || { code: '' };
  if (data.code === ServerResponseCode.SUCCESS) {
    return data;
  } else if (data.code === ServerResponseCode.UNAUTHORIZED) {
    router.push({ name: 'login' });
    message = 'invalid login';
    clearToken();
  } else {
    message = data.message || 'unknown error';
  }
  Toast.clear();
  return new Promise((resolve, reject): void => {
    Toast.fail({
      message,
      onClose(): void {
        reject(data);
      }
    });
  });
}, function (error): Promise<any> {
  const webErrorResponse = {
    isWebError: true,
    msg: ''
  };
  if (isCancel(error)) {
    console.log('Request canceled:', error);
  } else if (/timeout\sof[\w\s]+exceeded/.test(error.toString())) {
    webErrorResponse.msg = 'request timeout!';
  } else if (/(Request failed)|(Network Error)/.test(error.toString())) {
    webErrorResponse.msg = 'network error!';
  }
  if (webErrorResponse.msg) {
    Toast.clear();
    Toast.fail(webErrorResponse.msg);
  }
  return Promise.reject(webErrorResponse.msg ? webErrorResponse : error);
});

/**
 * basic data structure of server response
 */
export interface ServerResponse<T = any> {
  code: string;
  message?: string;
  data?: T;
}

class Http {
  private _axiosInstance: AxiosInstance;
  private _cancelerMap: Map<string, Canceler> = new Map<string, Canceler>();

  public constructor(axiosInstance: AxiosInstance) {
    this._axiosInstance = axiosInstance;
  }

  /**
   * check and cancel the same request
   * @param url
   * @param config
   * @private
   */
  private _processCancelTokenConfig(url: string, config: AxiosRequestConfig = {}): AxiosRequestConfig {
    const cancelerMap = this._cancelerMap;
    const canceler = cancelerMap.get(url);
    if (canceler) {
      cancelerMap.delete(url);
      canceler('cancel previous request');
    }
    if (!config.cancelToken) {
      config.cancelToken = new CancelToken(function (canceler): void {
        cancelerMap.set(url, canceler);
      });
    }
    return config;
  }

  /**
   * check if the request is sending
   * @param url
   */
  public checkRequestSending(url = ''): boolean {
    return this._cancelerMap.has(url);
  }

  /**
   * wrap the 'get' method of axios
   * @param url
   * @param config
   */
  public get<T>(url: string, config?: AxiosRequestConfig): Promise<ServerResponse<T>> {
    config = this._processCancelTokenConfig(url, config);
    return new Promise((resolve, reject): void => {
      this._axiosInstance.get<ServerResponse<T>, ServerResponse<T>>(url, config)
        .then((response): void => {
          this._cancelerMap.delete(url);
          resolve(response);
        })
        .catch((error): void => {
          if (!isCancel(error)) {
            this._cancelerMap.delete(url);
            reject(error);
          }
        });
    });
  }

  /**
   * wrap the 'post' method of axios
   * @param url
   * @param data
   * @param config
   */
  public post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ServerResponse<T>> {
    config = this._processCancelTokenConfig(url, config);
    return new Promise((resolve, reject): void => {
      this._axiosInstance.post<ServerResponse<T>, ServerResponse<T>>(url, data, config)
        .then((response): void => {
          this._cancelerMap.delete(url);
          resolve(response);
        })
        .catch((error): void => {
          if (!isCancel(error)) {
            this._cancelerMap.delete(url);
            reject(error);
          }
        });
    });
  }

  /**
   * wrap the 'put' method of axios
   * @param url
   * @param data
   * @param config
   */
  public put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ServerResponse<T>> {
    config = this._processCancelTokenConfig(url, config);
    return new Promise((resolve, reject): void => {
      this._axiosInstance.put<ServerResponse<T>, ServerResponse<T>>(url, data, config)
        .then((response): void => {
          this._cancelerMap.delete(url);
          resolve(response);
        })
        .catch((error): void => {
          if (!isCancel(error)) {
            this._cancelerMap.delete(url);
            reject(error);
          }
        });
    });
  }

  /**
   * wrap the 'delete' method of axios
   * @param url
   * @param config
   */
  public delete<T>(url: string, config?: AxiosRequestConfig): Promise<ServerResponse<T>> {
    config = this._processCancelTokenConfig(url, config);
    return new Promise((resolve, reject): void => {
      this._axiosInstance.delete<ServerResponse<T>, ServerResponse<T>>(url, config)
        .then((response): void => {
          this._cancelerMap.delete(url);
          resolve(response);
        })
        .catch((error): void => {
          if (!isCancel(error)) {
            this._cancelerMap.delete(url);
            reject(error);
          }
        });
    });
  }
}

const http = new Http(axiosInstance);

export {
  isCancel
};
export default http;
