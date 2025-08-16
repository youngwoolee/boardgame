import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiPlus, FiEdit, FiDownload, FiArrowRight } from 'react-icons/fi';
import './style.css';

export default function AdminDashboard() {
    const navigate = useNavigate();

    const adminMenus = [
        {
            id: 'user-approval',
            title: '사용자 승인',
            description: '가입 요청 사용자들을 승인합니다',
            icon: <FiUsers className="menu-icon" />,
            path: '/admin/user-approval',
            color: '#3b82f6'
        },
        {
            id: 'upload-game',
            title: '게임 등록',
            description: '새로운 보드게임을 등록합니다',
            icon: <FiPlus className="menu-icon" />,
            path: '/admin/upload',
            color: '#10b981'
        },
        {
            id: 'edit-game',
            title: '게임 수정',
            description: '등록된 보드게임을 수정합니다',
            icon: <FiEdit className="menu-icon" />,
            path: '/admin/edit',
            color: '#f59e0b'
        },
        {
            id: 'barcode-download',
            title: '바코드 다운로드',
            description: '보드게임에 붙일 바코드를 다운로드합니다',
            icon: <FiDownload className="menu-icon" />,
            path: '/admin/barcode-download',
            color: '#8b5cf6'
        }
    ];

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <h1 className="dashboard-title">관리자 대시보드</h1>
                <p className="dashboard-subtitle">보드게임 대여 시스템을 관리합니다</p>
            </div>
            
            <div className="admin-menu-grid">
                {adminMenus.map((menu) => (
                    <div 
                        key={menu.id} 
                        className="admin-menu-card"
                        onClick={() => navigate(menu.path)}
                    >
                        <div className="menu-card-header" style={{ backgroundColor: menu.color }}>
                            {menu.icon}
                        </div>
                        <div className="menu-card-content">
                            <h3 className="menu-card-title">{menu.title}</h3>
                            <p className="menu-card-description">{menu.description}</p>
                        </div>
                        <div className="menu-card-arrow">
                            <FiArrowRight className="arrow-icon" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-stats">
                <div className="stat-card">
                    <div className="stat-icon">
                        <FiUsers />
                    </div>
                    <div className="stat-content">
                        <h3>총 사용자</h3>
                        <span className="stat-number">1,234</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">
                        <FiPlus />
                    </div>
                    <div className="stat-content">
                        <h3>총 게임</h3>
                        <span className="stat-number">567</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">
                        <FiDownload />
                    </div>
                    <div className="stat-content">
                        <h3>오늘 대여</h3>
                        <span className="stat-number">89</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
