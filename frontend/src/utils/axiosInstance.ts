// src/utils/axiosInstance.ts
import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    withCredentials: true,
});

// 응답 인터셉터
instance.interceptors.response.use(
    response => response,
    error => {
        const status = error.response?.status;
        if (status === 401 || status === 403) {
            window.location.href = '/auth/sign-in'; // 로그인 페이지 경로
        }
        return Promise.reject(error);
    }
);

export default instance;