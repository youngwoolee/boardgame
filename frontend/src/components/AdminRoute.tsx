import React, {JSX, useEffect, useState} from "react";
import { Navigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import jwt_decode from 'jwt-decode';

interface JwtPayload {
    sub: string;
    exp: number;
    role: string | string[];
    [key: string]: any;
}

interface Props {
    children: JSX.Element;
}

const AdminRoute = ({ children }: Props) => {
    const [cookies] = useCookies(['accessToken']);
    const [role, setRole] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [debugInfo, setDebugInfo] = useState<string[]>([]);

    useEffect(() => {
        const checkRole = () => {
            try {
                const token = cookies.accessToken;
                console.log('AdminRoute - Token found:', token ? 'Yes' : 'No');
                
                if (!token) {
                    console.log('AdminRoute - No token found');
                    setRole(null);
                    setIsLoading(false);
                    return;
                }

                // JWT 직접 디코딩
                const decoded = jwt_decode<JwtPayload>(token);
                console.log('AdminRoute - Decoded payload:', decoded);
                
                let extractedRole: string | null = null;
                
                if (Array.isArray(decoded.role)) {
                    extractedRole = decoded.role[0];
                } else if (typeof decoded.role === 'string') {
                    extractedRole = decoded.role;
                }
                
                console.log('AdminRoute - Extracted role:', extractedRole);
                
                const debug = [
                    `현재 시간: ${new Date().toISOString()}`,
                    `JWT 토큰: ${token ? '존재' : '없음'}`,
                    `토큰 길이: ${token ? token.length : 0}`,
                    `추출된 역할: ${extractedRole}`,
                    `역할 타입: ${typeof extractedRole}`,
                    `역할 비교 결과: ${extractedRole === "ROLE_ADMIN" ? '일치' : '불일치'}`
                ];
                
                setDebugInfo(debug);
                setRole(extractedRole);
                setIsLoading(false);
                
            } catch (error) {
                console.error('AdminRoute - Error decoding JWT:', error);
                setRole(null);
                setIsLoading(false);
            }
        };

        // 즉시 권한 확인
        checkRole();
    }, [cookies.accessToken]);

    if (isLoading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                fontSize: '16px',
                color: '#666'
            }}>
                권한 확인 중...
            </div>
        );
    }

    if (!role) {
        console.log('AdminRoute - No role found, redirecting to sign-in');
        return <Navigate to="/auth/sign-in" replace />;
    }

    if (role !== "ROLE_ADMIN") {
        console.log('AdminRoute - Insufficient role:', role, 'redirecting to main');
        return <Navigate to="/" replace />;
    }

    console.log('AdminRoute - Access granted for role:', role);
    
    // 디버깅 정보를 포함하여 children 반환
    return (
        <div>
            {/* 디버깅 정보 표시 */}
            <div style={{
                position: 'fixed',
                top: '10px',
                right: '10px',
                background: 'rgba(0,0,0,0.8)',
                color: 'white',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '12px',
                maxWidth: '300px',
                zIndex: 9999
            }}>
                <strong>AdminRoute 디버깅:</strong>
                {debugInfo.map((info, index) => (
                    <div key={index} style={{margin: '2px 0'}}>{info}</div>
                ))}
            </div>
            {children}
        </div>
    );
};

export default AdminRoute;