import React, { useEffect, useRef, useState } from 'react';
import './style.css';

type Props = {
    onSubmit: (code: string) => void;
    onClose: () => void;
};

export default function BarcodeManualInputModal({ onSubmit, onClose }: Props) {
    const [inputs, setInputs] = useState<string[]>(Array(8).fill(''));
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        // 모달 열릴 때 스크롤 막기
        document.body.style.overflow = 'hidden';

        return () => {
            // 모달 닫힐 때 원복
            document.body.style.overflow = 'auto';
        };
    }, []);

    useEffect(() => {
        // ✅ 마운트 시 카메라 스트림 해제
        const stopCameraStream = () => {
            const videoElements = document.querySelectorAll('video');
            videoElements.forEach((video) => {
                const stream = (video as HTMLVideoElement).srcObject as MediaStream | null;
                if (stream) {
                    stream.getTracks().forEach((track) => track.stop());
                    (video as HTMLVideoElement).srcObject = null;
                }
            });
        };

        stopCameraStream();

        // ✅ 첫 번째 input 자동 포커스
        setTimeout(() => {
            inputsRef.current[0]?.focus();
        }, 50);
    }, []);

    const handleChange = (index: number, value: string) => {
        const updated = [...inputs];

        // 앞 6자리는 영문 대문자만 허용
        if (index < 6) {
            const upper = value.toUpperCase();
            if (!/^[A-Z]?$/.test(upper)) return;
            updated[index] = upper;
        } else {
            // 뒤 2자리는 숫자만 허용
            if (!/^\d?$/.test(value)) return;
            updated[index] = value;
        }

        setInputs(updated);

        // 다음 칸으로 자동 이동
        if (value && index < inputs.length - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Backspace' && !inputs[index] && index > 0) {
            const updated = [...inputs];
            updated[index - 1] = '';
            setInputs(updated);
            inputsRef.current[index - 1]?.focus();
        }
        // ✅ 엔터 키 입력 시 제출
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSubmit();
        }
    };

    const handleSubmit = () => {
        const code = inputs.join('');
        if (code.length !== 8) {
            alert('총 8자리를 정확히 입력해주세요.');
            return;
        }
        const finalCode = code.slice(0, 6) + '-' + code.slice(6);
        onSubmit(finalCode);
    };

    return (
        <div className="manual-input-overlay">
            <div className="manual-input-modal">
                <h3>바코드 수동 입력</h3>
                <div className="input-group">
                    {inputs.map((char, i) => (
                        <React.Fragment key={i}>
                            {i === 6 && <span className="hyphen">-</span>}
                            <input
                                type="text"
                                value={char}
                                maxLength={1}
                                ref={(el) => {
                                    inputsRef.current[i] = el;
                                }}
                                className="barcode-input"
                                onChange={(e) => handleChange(i, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(i, e)}
                            />
                        </React.Fragment>
                    ))}
                </div>
                <div className="button-group">
                    <button className="cancel-button" onClick={onClose}>취소</button>
                    <button className="submit-button" onClick={handleSubmit}>입력</button>
                </div>
            </div>
        </div>
    );
}