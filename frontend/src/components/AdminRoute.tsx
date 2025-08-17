import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import jwt_decode from 'jwt-decode';

interface JwtPayload {
    role: string;
    [key: string]: any;
}

interface AdminRouteProps {
    children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
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

                const decoded = jwt_decode<JwtPayload>(token);
                const userRole = decoded.role;
                setRole(userRole);
                setIsLoading(false);
            } catch (error) {
                console.error('JWT 디코딩 오류:', error);
                setRole(null);
                setIsLoading(false);
            }
        };

        checkRole();
    }, [cookies.accessToken]);

    if (isLoading) {
        return <div>로딩 중...</div>;
    }

    if (!role) {
        // 권한이 없으면 로그인 페이지로 이동 (replace 사용)
        return <Navigate to="/auth/sign-in" replace />;
    }

    if (role !== 'ROLE_ADMIN') {
        // 관리자가 아니면 메인 페이지로 이동 (replace 사용)
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default AdminRoute;