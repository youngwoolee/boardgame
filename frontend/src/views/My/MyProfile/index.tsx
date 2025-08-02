import {useEffect, useState} from "react";
import {UserResponseDto} from "../../../apis/response/user";
import {useNavigate} from "react-router-dom";
import {getMyProfileRequest} from "../../../apis";
import {ResponseBody} from "../../../types";
import { ResponseCode } from '../../../types/enums';
import './style.css';
import { toast } from 'react-toastify';
import {useCookies} from "react-cookie";

export default function MyProfile() {
    const [profile, setProfile] = useState<UserResponseDto>();
    const [cookies, setCookie, removeCookie] = useCookies();
    const navigate = useNavigate();

    useEffect(() => {
        getMyProfileRequest().then(handleProfileResponse);
    }, []);

    const handleProfileResponse = (responseBody: ResponseBody<UserResponseDto>) => {
        if (!responseBody) return;
        if (responseBody.code !== ResponseCode.SUCCESS) {
            toast.error(responseBody.message);
            navigate('/auth/sign-in');
            return;
        }
        setProfile(responseBody as UserResponseDto);
    };

    const handleLogout = () => {
        // Access Token 쿠키 삭제
        removeCookie('accessToken', { path: '/' });
        // 로그인 페이지로 이동
        navigate('/auth/sign-in');
    };

    if (!profile) {
        // 로딩 상태를 간단히 표시 (스피너 등으로 대체 가능)
        return <div className="my-profile-wrapper">로딩 중...</div>;
    }

    return (
        <div className="my-profile-wrapper">
            <div className="profile-info">
                <div className="profile-label">이름</div>
                <div className="profile-value">{profile.name || '미설정'}</div>
            </div>
            <div className="profile-info">
                <div className="profile-label">아이디</div>
                <div className="profile-value">{profile.userId}</div>
            </div>
            <div className="profile-info">
                <div className="profile-label">이메일</div>
                <div className="profile-value">{profile.email}</div>
            </div>

            <button className="logout-button" onClick={handleLogout}>
                로그아웃
            </button>
        </div>
    );
}