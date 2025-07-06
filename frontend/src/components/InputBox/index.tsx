import {ChangeEvent, KeyboardEvent, forwardRef} from "react";
import './style.css';
interface Props {

    title: string;
    placeholder: string;
    type: 'text' | 'password';
    value: string;
    isErrorMessage?: boolean;
    buttonTitle?: string;
    message?: string;
    buttonDisabled?: boolean; // ✅ 추가
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
    onButtonClick?: () => void;

}
const InputBox = forwardRef<HTMLInputElement, Props>((props: Props, ref) => {

    const {title, placeholder, type, value, isErrorMessage, buttonTitle, message, buttonDisabled = false, onChange, onKeyDown, onButtonClick } = props;

    const buttonClass = value === '' || buttonDisabled ? 'input-box-button-disable' : 'input-box-button';
    const messageClass = isErrorMessage? 'input-box-message-error' : 'input-box-message';

    return (
        <div className='input-box'>
            <div className='input-box-title'>{title}</div>
            <div className='input-box-content'>
                <div className='input-box-body'>
                    <input ref={ref} className='input-box-input' placeholder={placeholder} type={type} value = {value} onChange={onChange} onKeyDown={onKeyDown}/>
                    {buttonTitle !== undefined && onButtonClick !== undefined && <div className={buttonClass} onClick={!buttonDisabled ? onButtonClick : undefined}>{buttonTitle}</div>}
                </div>
                {message !== undefined && <div className={messageClass}>{message}</div>}
            </div>
        </div>
    );
});

export default InputBox;