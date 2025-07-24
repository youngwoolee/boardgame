// src/utils/axiosInstance.ts
import axios from 'axios';

const instance = axios.create({
    baseURL: '${process.env.REACT_APP_API_URL}/api/v1',
    withCredentials: true,
});

// 쿠키 삭제 함수
const deleteAccessTokenCookie = () => {
    document.cookie = 'accessToken=; Max-Age=0; path=/;'; // 기본 path
};

// 응답 인터셉터
instance.interceptors.response.use(
    response => response,
    error => {
        const status = error.response?.status;
        if (status === 401 || status === 403) {
            deleteAccessTokenCookie();
            window.location.href = '/auth/sign-in'; // 로그인 페이지 경로
        }
        return Promise.reject(error);
    }
);

export default instance;