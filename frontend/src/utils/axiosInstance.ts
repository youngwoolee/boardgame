// src/utils/axiosInstance.ts
import axios from 'axios';
import {toast} from "react-toastify";

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
        const { status, data } = error.response;

        if (status === 401 || status === 403) {
            // ✅ 응답 데이터의 코드가 'NA' (Not Approved)인 경우
            if (data && data.code === 'NA') {
                toast.warn('관리자 승인이 필요한 계정입니다.');
            } else {
                // 그 외 일반적인 인증/권한 실패
                toast.error('로그인이 필요하거나 접근 권한이 없습니다.');
            }

            deleteAccessTokenCookie();
            // 토스트 메시지가 보일 시간을 확보한 후 페이지 이동
            setTimeout(() => {
                window.location.href = '/auth/sign-in';
            }, 1500);
        }
        return Promise.reject(error);
    }
);

export default instance;