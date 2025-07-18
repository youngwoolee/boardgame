import {useLocation, useNavigate} from "react-router-dom";
import {FiList, FiShoppingCart, FiUser} from "react-icons/fi";
import './style.css'

export default function BottomNavigation() {
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path: string) =>
        location.pathname === path || location.pathname.startsWith(path + '/');

    return (
        <div className="bottom-nav">
            <div
                className={`nav-item ${isActive('/') ? 'active' : ''}`}
                onClick={() => navigate('/')}
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
                className={`nav-item ${isActive('/reservations') ? 'active' : ''}`}
                onClick={() => navigate('/reservations')}
                role="button"
                tabIndex={0}
                style={{ cursor: 'pointer' }}
            >
                <span>나의 정보</span>
            </div>
        </div>
    );
}