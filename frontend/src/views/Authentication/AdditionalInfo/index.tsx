import {ChangeEvent, KeyboardEvent, useEffect, useRef, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import InputBox from "../../../components/InputBox";
import useTokenHandler from '../../../hooks/useTokenHandler';


export default function AdditionalInfo() {
    const [realName, setRealName] = useState<string>('');
    const [isRealNameError, setRealNameError] = useState<boolean>(false);
    const [realNameMessage, setRealNameMessage] = useState<string>('');
    const { token, expirationTime } = useParams();

    const realNameRef = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate();
    const handleTokenAndRedirect = useTokenHandler();

    useEffect(() => {
        if (!token || !expirationTime) {
            alert("토큰이 만료되었거나 로그인 정보가 없습니다.");
            navigate('/auth/sign-in');
        }
    },  [token, expirationTime]);

    const onRealNameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setRealName(value);
        setRealNameMessage('');
        setRealNameError(false);
    };

    const onRealNameKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== 'Enter') return;
        onSubmitHandler();
    };

    const onSubmitHandler = async () => {
        if (!token || !realName || !expirationTime) {
            setRealNameError(true);
            setRealNameMessage("실명을 입력해주세요.");
            return;
        }

        try {
            await axios.post(
                'http://localhost:8080/api/v1/auth/complete-signup',
                { realName },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            alert("가입이 완료되었습니다.");
            handleTokenAndRedirect(token, expirationTime);
        } catch (error) {
            alert("가입 실패");
        }
    };

    return (
        <div id={"sign-up-wrapper"}>
            <div className={"sign-up-container"}>
                <div className={"sign-up-box"}>
                    <div className={"sign-up-title"}>{"추가 정보 입력"}</div>
                    <div className={"sign-up-content-box"}>
                        <div className={"sign-up-content-input-box"}>
                            <InputBox
                                ref={realNameRef}
                                title={"실명"}
                                placeholder={"예: 홍길동"}
                                type="text"
                                value={realName}
                                onChange={onRealNameChangeHandler}
                                onKeyDown={onRealNameKeyDownHandler}
                                isErrorMessage={isRealNameError}
                                message={realNameMessage}
                            />
                        </div>
                        <div className={"sign-up-content-button-box"}>
                            <div className={`primary-button-lg full-width`} onClick={onSubmitHandler}>
                                {"가입 완료"}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
