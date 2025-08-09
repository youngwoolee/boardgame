import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPendingUsers, approveUser } from '../../../apis';
import { getUserRole } from '../../../utils/jwt';
import { getAccessTokenHeader } from '../../../utils/token';
import { toast } from 'react-toastify';
import './style.css';
import {AdminUserResponseDto} from "../../../apis/response/admin/admin-user.response.dto";

const UserApproval: React.FC = () => {
    const [pendingUsers, setPendingUsers] = useState<AdminUserResponseDto[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // 어드민 권한 확인
    useEffect(() => {
        const userRole = getUserRole();
        const tokenHeader = getAccessTokenHeader();
        
        console.log('User role:', userRole);
        console.log('Token header:', tokenHeader);
        
        if (userRole !== 'ROLE_ADMIN') {
            toast.error('어드민 권한이 필요합니다.');
            navigate('/');
            return;
        }
        
        if (!tokenHeader.Authorization) {
            toast.error('로그인이 필요합니다.');
            navigate('/auth/sign-in');
            return;
        }
    }, [navigate]);

    const fetchPendingUsers = async () => {
        try {
            const response = await getPendingUsers();
            console.log('Pending users response:', response); // 디버깅용 로그
            
            if (response && 'data' in response && response.data) {
                setPendingUsers(response.data || []);
            } else {
                setPendingUsers([]);
            }
        } catch (error) {
            console.error('Failed to fetch pending users:', error);
            toast.error('대기 중인 사용자 목록을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleApproveUser = async (userId: number) => {
        try {
            const response = await approveUser(userId);
            console.log('Approve user response:', response); // 디버깅용 로그
            
            if (response && response.code === 'SU') {
                toast.success('사용자 승인이 완료되었습니다.');
                fetchPendingUsers(); // 목록 새로고침
            } else {
                toast.error(response?.message || '사용자 승인에 실패했습니다.');
            }
        } catch (error) {
            console.error('Failed to approve user:', error);
            toast.error('사용자 승인에 실패했습니다.');
        }
    };

    useEffect(() => {
        const userRole = getUserRole();
        if (userRole === 'ROLE_ADMIN') {
            fetchPendingUsers();
        }
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('ko-KR');
    };

    if (loading) {
        return (
            <div className="user-approval-container">
                <div className="loading">로딩 중...</div>
            </div>
        );
    }

    return (
        <div className="user-approval-container">
            <div className="header">
                <button className="back-btn" onClick={() => navigate('/admin')}>
                    ← 뒤로가기
                </button>
                <h2>사용자 승인 관리</h2>
            </div>
            
            {pendingUsers.length === 0 ? (
                <div className="no-users">
                    <p>승인 대기 중인 사용자가 없습니다.</p>
                </div>
            ) : (
                <div className="users-list">
                    {pendingUsers.map((user) => (
                        <div key={user.id} className="user-card">
                            <div className="user-info">
                                <div className="user-header">
                                    <h3>{user.name || '이름 없음'}</h3>
                                    <span className="user-type">{user.type}</span>
                                </div>
                                <div className="user-details">
                                    <p><strong>아이디:</strong> {user.userId}</p>
                                    <p><strong>이메일:</strong> {user.email}</p>
                                    <p><strong>가입일:</strong> {formatDate(user.createdAt)}</p>
                                </div>
                            </div>
                            <div className="user-actions">
                                <button 
                                    className="approve-btn"
                                    onClick={() => handleApproveUser(user.id)}
                                >
                                    승인
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserApproval;
