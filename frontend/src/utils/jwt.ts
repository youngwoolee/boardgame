import jwt_decode from "jwt-decode";
import { Cookies } from 'react-cookie';

const cookies = new Cookies();

interface JwtPayload {
    sub: string;
    exp: number;
    role: string | string[];
    [key: string]: any; // 추가 필드들을 허용
}

export function getUserRole(): string | null {
    try {
        console.log('=== JWT getUserRole 시작 ===');
        
        // react-cookie를 사용하여 토큰 찾기
        const token = cookies.get('accessToken');
        console.log('JWT - Token found:', token ? 'Yes' : 'No');
        console.log('JWT - Token value:', token);
        console.log('JWT - Token length:', token ? token.length : 0);

        if (!token) {
            console.log('JWT - No token found in cookies');
            return null;
        }

        // 토큰 디코딩
        const decoded = jwt_decode<JwtPayload>(token);
        console.log('JWT - Decoded payload:', decoded);
        console.log('JWT - Payload keys:', Object.keys(decoded));
        console.log('JWT - Role field:', decoded.role);
        console.log('JWT - Role type:', typeof decoded.role);
        console.log('JWT - Role is array:', Array.isArray(decoded.role));

        // 만료 시간 확인
        const currentTime = Date.now() / 1000;
        console.log('JWT - Current time:', currentTime);
        console.log('JWT - Token exp:', decoded.exp);
        
        if (decoded.exp && decoded.exp < currentTime) {
            console.log('JWT - Token expired');
            // 만료된 토큰 제거
            cookies.remove('accessToken', { path: '/' });
            return null;
        }

        // 역할 추출
        let role: string | null = null;
        
        if (Array.isArray(decoded.role)) {
            role = decoded.role[0];
            console.log('JWT - Role from array:', role);
        } else if (typeof decoded.role === 'string') {
            role = decoded.role;
            console.log('JWT - Role from string:', role);
        } else {
            console.log('JWT - Role field is neither string nor array:', decoded.role);
            // 다른 가능한 필드들 확인
            const possibleRoleFields = ['authorities', 'roles', 'userRole', 'user_role'];
            for (const field of possibleRoleFields) {
                if (decoded[field]) {
                    console.log(`JWT - Found role in field '${field}':`, decoded[field]);
                    if (Array.isArray(decoded[field])) {
                        role = decoded[field][0];
                    } else {
                        role = decoded[field];
                    }
                    break;
                }
            }
        }
        
        console.log('JWT - Final extracted role:', role);
        console.log('JWT - Role === "ROLE_ADMIN":', role === "ROLE_ADMIN");
        console.log('=== JWT getUserRole 완료 ===');
        
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
    console.log('JWT - Token cleared');
}