import axios from './axios';
import { AxiosRequestConfig } from 'axios';

// 기본 API 요청 함수들
export const apiClient = {
  /**
   * GET 요청
   * @param url 요청 URL
   * @param config 추가 설정
   */
  get: async <T>(url: string, config?: AxiosRequestConfig) => {
    const response = await axios.get<T>(url, config);
    return response.data;
  },

  /**
   * POST 요청
   * @param url 요청 URL
   * @param data 요청 데이터
   * @param config 추가 설정
   */
  post: async <T>(url: string, data?: any, config?: AxiosRequestConfig) => {
    const response = await axios.post<T>(url, data, config);
    return response.data;
  },

  /**
   * PUT 요청
   * @param url 요청 URL
   * @param data 요청 데이터
   * @param config 추가 설정
   */
  put: async <T>(url: string, data?: any, config?: AxiosRequestConfig) => {
    const response = await axios.put<T>(url, data, config);
    return response.data;
  },

  /**
   * PATCH 요청
   * @param url 요청 URL
   * @param data 요청 데이터
   * @param config 추가 설정
   */
  patch: async <T>(url: string, data?: any, config?: AxiosRequestConfig) => {
    const response = await axios.patch<T>(url, data, config);
    return response.data;
  },

  /**
   * DELETE 요청
   * @param url 요청 URL
   * @param config 추가 설정
   */
  delete: async <T>(url: string, config?: AxiosRequestConfig) => {
    const response = await axios.delete<T>(url, config);
    return response.data;
  },
};

export default apiClient; 