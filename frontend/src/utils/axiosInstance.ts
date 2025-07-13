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
        if (error.response?.status === 403) {
            // ✅ 403 오류 발생 시 로그인 페이지로 이동
            window.location.href = '/auth/sign-in';
        }
        return Promise.reject(error);
    }
);

export default instance;