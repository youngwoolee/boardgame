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
    const [selectedRoles, setSelectedRoles] = useState<{ [key: number]: string }>({});
    const navigate = useNavigate();

    // 어드민 권한 확인
    useEffect(() => {
        const userRole = getUserRole();
        const tokenHeader = getAccessTokenHeader();

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
            const selectedRole = selectedRoles[userId] || 'ROLE_USER';
            const response = await approveUser(userId, selectedRole);

            if (response && response.code === 'SU') {
                toast.success('사용자 승인이 완료되었습니다.');
                fetchPendingUsers(); // 목록 새로고침
                // 선택된 역할 초기화
                setSelectedRoles(prev => {
                    const newRoles = { ...prev };
                    delete newRoles[userId];
                    return newRoles;
                });
            } else {
                toast.error(response?.message || '사용자 승인에 실패했습니다.');
            }
        } catch (error) {
            console.error('Failed to approve user:', error);
            toast.error('사용자 승인에 실패했습니다.');
        }
    };

    const handleRoleChange = (userId: number, role: string) => {
        setSelectedRoles(prev => ({
            ...prev,
            [userId]: role
        }));
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
                                <select
                                    className="role-select"
                                    value={selectedRoles[user.id] || 'ROLE_USER'}
                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                >
                                    <option value="ROLE_USER">일반 사용자</option>
                                    <option value="ROLE_ADMIN">관리자</option>
                                </select>
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
