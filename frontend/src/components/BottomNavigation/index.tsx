import {useLocation, useNavigate} from "react-router-dom";
import {getUserRole} from "../../utils/jwt";
import './style.css'

export default function BottomNavigation() {
    const location = useLocation();
    const navigate = useNavigate();
    const userRole = getUserRole();
    const isAdmin = userRole === "ROLE_ADMIN";

    const isActive = (path: string) =>
        location.pathname === path || location.pathname.startsWith(path + '/');

    return (
        <div className="bottom-nav">
            <div
                className={`nav-item ${isActive('/') ? 'active' : ''}`}
                onClick={() => navigate('/', { replace: true })}
                role="button"
                tabIndex={0}
                style={{ cursor: 'pointer' }}
            >
                <span>대여</span>
            </div>
            <div
                className={`nav-item ${isActive('/ranking') ? 'active' : ''}`}
                role="button"
                tabIndex={0}
                style={{ cursor: 'pointer' }}
            >
                <span>순위</span>
            </div>
            <div
                className={`nav-item ${isActive('/my') ? 'active' : ''}`}
                onClick={() => navigate('/my', { replace: true })}
                role="button"
                tabIndex={0}
                style={{ cursor: 'pointer' }}
            >
                <span>나의 정보</span>
            </div>
            {isAdmin && (
                <div
                    className={`nav-item ${isActive('/admin') ? 'active' : ''}`}
                    onClick={() => navigate('/admin', { replace: true })}
                    role="button"
                    tabIndex={0}
                    style={{ cursor: 'pointer' }}
                >
                    <span>관리</span>
                </div>
            )}
        </div>
    );
}