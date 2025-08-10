import React from 'react';
import './style.css';

export default function AdminDashboard() {
    return (
        <div className="admin-dashboard">
            <h1>관리자 대시보드</h1>
            
            <div className="admin-menu">
                <div className="menu-card">
                    <h3>사용자 승인</h3>
                    <p>가입 요청 사용자들을 승인합니다</p>
                    <a href="/admin/user-approval" className="menu-link">이동하기</a>
                </div>
                
                <div className="menu-card">
                    <h3>게임 등록</h3>
                    <p>새로운 보드게임을 등록합니다</p>
                    <a href="/admin/upload-game" className="menu-link">이동하기</a>
                </div>
                
                <div className="menu-card">
                    <h3>게임 수정</h3>
                    <p>등록된 보드게임을 수정합니다</p>
                    <a href="/admin/edit-game" className="menu-link">이동하기</a>
                </div>

                <div className="menu-card">
                    <h3>바코드 다운로드</h3>
                    <p>보드게임에 붙일 바코드를 다운로드합니다</p>
                    <a href="/admin/barcode-download" className="menu-link">이동하기</a>
                </div>
            </div>
        </div>
    );
}
