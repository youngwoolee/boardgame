import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiPlus, FiEdit, FiDownload, FiArrowRight } from 'react-icons/fi';
import './style.css';

export default function AdminDashboard() {
    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        // 관리자 메뉴로 이동할 때는 일반 navigate 사용 (히스토리 쌓기)
        navigate(path);
    };

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <h1 className="dashboard-title">관리자 대시보드</h1>
                <p className="dashboard-subtitle">보드게임 대여 시스템을 관리합니다</p>
            </div>

            <div className="admin-menu-grid">
                <div className="admin-menu-card" onClick={() => handleNavigation('/admin/user-approval')}>
                    <div className="menu-card-header" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                        <FiUsers className="menu-icon" />
                    </div>
                    <div className="menu-card-content">
                        <h3 className="menu-card-title">사용자 승인</h3>
                        <p className="menu-card-description">가입 요청 사용자들을 승인합니다</p>
                    </div>
                    <div className="menu-card-arrow">
                        <FiArrowRight className="arrow-icon" />
                    </div>
                </div>

                <div className="admin-menu-card" onClick={() => handleNavigation('/admin/upload')}>
                    <div className="menu-card-header" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                        <FiPlus className="menu-icon" />
                    </div>
                    <div className="menu-card-content">
                        <h3 className="menu-card-title">게임 등록</h3>
                        <p className="menu-card-description">새로운 보드게임을 등록합니다</p>
                    </div>
                    <div className="menu-card-arrow">
                        <FiArrowRight className="arrow-icon" />
                    </div>
                </div>

                <div className="admin-menu-card" onClick={() => handleNavigation('/admin/edit')}>
                    <div className="menu-card-header" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                        <FiEdit className="menu-icon" />
                    </div>
                    <div className="menu-card-content">
                        <h3 className="menu-card-title">게임 수정</h3>
                        <p className="menu-card-description">등록된 보드게임을 수정합니다</p>
                    </div>
                    <div className="menu-card-arrow">
                        <FiArrowRight className="arrow-icon" />
                    </div>
                </div>

                <div className="admin-menu-card" onClick={() => handleNavigation('/admin/barcode-download')}>
                    <div className="menu-card-header" style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
                        <FiDownload className="menu-icon" />
                    </div>
                    <div className="menu-card-content">
                        <h3 className="menu-card-title">바코드 다운로드</h3>
                        <p className="menu-card-description">게임별 바코드를 생성하고 다운로드합니다</p>
                    </div>
                    <div className="menu-card-arrow">
                        <FiArrowRight className="arrow-icon" />
                    </div>
                </div>
            </div>

            <div className="dashboard-stats">
                <div className="stat-card">
                    <div className="stat-icon">
                        <FiUsers />
                    </div>
                    <div className="stat-content">
                        <h3>총 사용자</h3>
                        <div className="stat-number">1,234</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">
                        <FiPlus />
                    </div>
                    <div className="stat-content">
                        <h3>총 게임</h3>
                        <div className="stat-number">567</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">
                        <FiDownload />
                    </div>
                    <div className="stat-content">
                        <h3>오늘 대여</h3>
                        <div className="stat-number">89</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
