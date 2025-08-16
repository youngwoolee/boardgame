import jwt_decode from "jwt-decode";
import { Cookies } from 'react-cookie';

const cookies = new Cookies();

interface JwtPayload {
    sub: string;
    exp: number;
    role: string | string[];
    [key: string]: any;
}

export function getUserRole(): string | null {
    try {
        // react-cookie를 사용하여 토큰 찾기
        const token = cookies.get('accessToken');

        if (!token) {
            return null;
        }

        // 토큰 디코딩
        const decoded = jwt_decode<JwtPayload>(token);

        // 만료 시간 확인
        const currentTime = Date.now() / 1000;
        if (decoded.exp && decoded.exp < currentTime) {
            // 만료된 토큰 제거
            cookies.remove('accessToken', { path: '/' });
            return null;
        }

        // 역할 추출
        let role: string | null = null;
        
        if (Array.isArray(decoded.role)) {
            role = decoded.role[0];
        } else if (typeof decoded.role === 'string') {
            role = decoded.role;
        } else {
            // 다른 가능한 필드들 확인
            const possibleRoleFields = ['authorities', 'roles', 'userRole', 'user_role'];
            for (const field of possibleRoleFields) {
                if (decoded[field]) {
                    if (Array.isArray(decoded[field])) {
                        role = decoded[field][0];
                    } else {
                        role = decoded[field];
                    }
                    break;
                }
            }
        }
        
        return role;
    } catch (error) {
        console.error('JWT - Error decoding token:', error);
        // 잘못된 토큰 제거
        cookies.remove('accessToken', { path: '/' });
        return null;
    }
}

export function isTokenValid(): boolean {
    const role = getUserRole();
    return role !== null;
}

export function clearToken(): void {
    cookies.remove('accessToken', { path: '/' });
}