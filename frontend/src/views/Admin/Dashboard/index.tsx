import React from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();

    const adminMenus = [
        {
            title: '사용자 승인',
            description: '가입 요청 사용자들을 승인합니다',
            path: '/admin/user-approval',
            color: '#28a745'
        },
        {
            title: '게임 등록',
            description: '새로운 보드게임을 등록합니다',
            path: '/admin/upload',
            color: '#007bff'
        },
        {
            title: '게임 수정',
            description: '등록된 게임 정보를 수정합니다',
            path: '/admin/edit',
            color: '#ffc107'
        }
    ];

    return (
        <div className="admin-dashboard">
            <h2>관리자 대시보드</h2>
            
            <div className="admin-menu-grid">
                {adminMenus.map((menu, index) => (
                    <div 
                        key={index}
                        className="admin-menu-card"
                        onClick={() => navigate(menu.path)}
                        style={{ borderLeftColor: menu.color }}
                    >
                        <div className="menu-content">
                            <h3>{menu.title}</h3>
                            <p>{menu.description}</p>
                        </div>
                        <div className="menu-arrow">→</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;
