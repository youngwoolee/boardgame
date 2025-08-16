import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiPlus, FiEdit, FiDownload, FiArrowRight } from 'react-icons/fi';
import { getUserRole } from '../../../utils/jwt';
import { Cookies } from 'react-cookie';
import jwt_decode from 'jwt-decode';
import './style.css';

const cookies = new Cookies();

export default function AdminDashboard() {
    const navigate = useNavigate();
    const currentRole = getUserRole();

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
            path: '/admin/upload-game',
            color: '#10b981'
        },
        {
            id: 'edit-game',
            title: '게임 수정',
            description: '등록된 보드게임을 수정합니다',
            icon: <FiEdit className="menu-icon" />,
            path: '/admin/edit-game',
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

    const testJWT = () => {
        try {
            const token = cookies.get('accessToken');
            if (token) {
                const decoded = jwt_decode(token);
                console.log('=== JWT 테스트 결과 ===');
                console.log('토큰:', token);
                console.log('디코딩된 페이로드:', decoded);
                console.log('페이로드 키들:', Object.keys(decoded as object));
                console.log('역할 필드:', (decoded as any).role);
                console.log('역할 타입:', typeof (decoded as any).role);
                console.log('역할이 배열인가:', Array.isArray((decoded as any).role));
                alert(`JWT 테스트 완료! 콘솔을 확인하세요.\n역할: ${(decoded as any).role}`);
            } else {
                alert('토큰이 없습니다!');
            }
        } catch (error) {
            console.error('JWT 테스트 오류:', error);
            alert('JWT 테스트 중 오류가 발생했습니다!');
        }
    };

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <h1 className="dashboard-title">관리자 대시보드</h1>
                <p className="dashboard-subtitle">보드게임 대여 시스템을 관리합니다</p>
                
                {/* 디버깅 정보 */}
                <div style={{ 
                    background: '#f3f4f6', 
                    padding: '1rem', 
                    borderRadius: '8px', 
                    marginTop: '1rem',
                    fontSize: '14px',
                    color: '#374151'
                }}>
                    <strong>디버깅 정보:</strong><br />
                    현재 역할: {currentRole || '없음'}<br />
                    쿠키: {cookies.get('accessToken') ? '존재' : '없음'}<br />
                    <button 
                        onClick={testJWT}
                        style={{
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '4px',
                            marginTop: '0.5rem',
                            cursor: 'pointer'
                        }}
                    >
                        JWT 토큰 테스트
                    </button>
                    <button 
                        onClick={() => {
                            console.log('Current role:', getUserRole());
                            console.log('Cookies:', cookies.get('accessToken'));
                        }}
                        style={{
                            background: '#10b981',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '4px',
                            marginTop: '0.5rem',
                            marginLeft: '0.5rem',
                            cursor: 'pointer'
                        }}
                    >
                        콘솔에 로그 출력
                    </button>
                </div>
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
