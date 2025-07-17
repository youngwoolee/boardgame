import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

/**
 * JWT 토큰을 쿠키에 저장하고 홈으로 이동하는 로직
 */
export default function useTokenHandler() {
    const [_, setCookie] = useCookies();
    const navigate = useNavigate();

    const handleTokenAndRedirect = (token: string, expirationTime: string) => {
        const now = new Date().getTime();
        const expires = new Date(now + Number(expirationTime) * 1000); // expirationTime은 초 단위로 가정

        setCookie('accessToken', token, { expires, path: '/' });
        navigate('/');
    };

    return handleTokenAndRedirect;
}