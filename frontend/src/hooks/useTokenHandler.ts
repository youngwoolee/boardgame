import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import axiosInstance, {setAccessToken} from "../utils/axiosInstance";

/**
 * JWT 토큰을 쿠키에 저장하고 홈으로 이동하는 로직
 */
export default function useTokenHandler() {
    const [_, setCookie] = useCookies();
    const navigate = useNavigate();

    const handleTokenAndRedirect = (token: string, expirationTime: string) => {
        // ✅ Axios 인스턴스에 토큰 설정
        setAccessToken(token);

        const expires = new Date().getTime() + Number(expirationTime) * 1000;
        localStorage.setItem('accessTokenExpires', expires.toString());

        navigate('/');
    };

    return handleTokenAndRedirect;
}