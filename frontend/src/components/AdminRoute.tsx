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

    useEffect(() => {
        const checkRole = () => {
            try {
                const token = cookies.accessToken;
                
                if (!token) {
                    setRole(null);
                    setIsLoading(false);
                    return;
                }

                // JWT 직접 디코딩
                const decoded = jwt_decode<JwtPayload>(token);
                
                let extractedRole: string | null = null;
                
                if (Array.isArray(decoded.role)) {
                    extractedRole = decoded.role[0];
                } else if (typeof decoded.role === 'string') {
                    extractedRole = decoded.role;
                } else {
                    // 다른 가능한 필드들 확인
                    const possibleRoleFields = ['authorities', 'roles', 'userRole', 'user_role'];
                    for (const field of possibleRoleFields) {
                        if (decoded[field]) {
                            if (Array.isArray(decoded[field])) {
                                extractedRole = decoded[field][0];
                            } else {
                                extractedRole = decoded[field];
                            }
                            break;
                        }
                    }
                }
                
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
        return <Navigate to="/auth/sign-in" replace />;
    }

    if (role !== "ROLE_ADMIN") {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminRoute;