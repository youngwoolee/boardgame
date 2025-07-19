export default function MyProfile() {
    const nickname = '이영우'; // 실제 로그인 사용자 정보 바인딩 필요

    return (
        <div className="my-profile-wrapper">
            <p>닉네임: {nickname}</p>
            {/* 필요 시 수정 버튼, 로그아웃 등 추가 */}
        </div>
    );
}