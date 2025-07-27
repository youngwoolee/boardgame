// src/utils/axiosInstance.ts
import axios from 'axios';
import { toast } from 'react-toastify';

let accessToken: string | null = sessionStorage.getItem('accessToken');

// Access Token을 설정하고 가져오는 함수 (sessionStorage와 동기화)
export const setAccessToken = (token: string | null) => {
    accessToken = token;
    if (token) {
        sessionStorage.setItem('accessToken', token);
    } else {
        sessionStorage.removeItem('accessToken');
    }
};

export const getAccessToken = () => {
    return accessToken;
};

const axiosInstance = axios.create({
    baseURL: '${process.env.REACT_APP_API_URL}/api/v1',
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
});

// ✅ 중앙 집중식 토큰 갱신 함수
const refreshToken = async () => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/auth/refresh`, {}, {
            withCredentials: true,
        });

        const { accessToken: newAccessToken, expirationTime } = response.data;
        setAccessToken(newAccessToken);
        const expires = new Date().getTime() + Number(expirationTime) * 1000;
        localStorage.setItem('accessTokenExpires', expires.toString());
        return newAccessToken; // 성공 시 새 토큰 반환
    } catch (error) {
        // 갱신 실패 시 모든 인증 정보 삭제 및 로그아웃 처리
        setAccessToken(null);
        localStorage.removeItem('accessTokenExpires');
        toast.error("세션이 만료되었습니다. 다시 로그인해주세요.");
        setTimeout(() => {
            window.location.href = '/auth/sign-in';
        }, 1500);
        return Promise.reject(error); // 에러를 다시 던져서 원래 요청도 실패 처리
    }
};

// ✅ 앱 로드 시 실행되는 토큰 갱신 함수 (수정)
export const silentRefresh = async () => {
    const token = getAccessToken();
    const expires = localStorage.getItem('accessTokenExpires');

    // ✅ 토큰이 없거나, 만료 시간이 지났을 경우에만 갱신을 시도합니다.
    if (!token || (expires && new Date().getTime() > Number(expires))) {
        try {
            // refreshToken 함수는 실패 시 자동으로 로그아웃 처리합니다.
            await refreshToken();
        } catch (error) {
            // refreshToken 내부에서 이미 로그아웃 및 에러 처리가 되므로 여기서는 무시합니다.
            console.log("Silent refresh failed, user is logged out or has no valid refresh token.");
        }
    }
};

// ✅ 요청 인터셉터 (선제적 갱신 기능 추가)
axiosInstance.interceptors.request.use(
    async (config) => {
        const token = getAccessToken();
        const expires = localStorage.getItem('accessTokenExpires');

        // 토큰이 있고, 만료 시간이 지났는지 확인
        if (token && expires && new Date().getTime() > Number(expires)) {
            try {
                // 먼저 토큰을 갱신
                const newAccessToken = await refreshToken();
                // 갱신된 토큰으로 헤더를 설정하여 요청 계속
                config.headers['Authorization'] = `Bearer ${newAccessToken}`;
            } catch (error) {
                // 갱신 실패 시 요청 중단
                return Promise.reject(error);
            }
        } else if (token) {
            // 토큰이 있고 만료되지 않았다면 그냥 헤더에 추가
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ✅ 응답 인터셉터 (사후 대응 - 안전장치 역할)
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        // 401 에러이고, 재시도한 요청이 아닐 경우
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const newAccessToken = await refreshToken();
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;