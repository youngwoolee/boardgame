import React, { useEffect, useRef } from 'react';
import './index.css';

type Props = {
    onSubmit: (code: string) => void;
    onClose: () => void;
};

export default function BarcodeManualInputModal({ onSubmit, onClose }: Props) {
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    const isCharValid = (index: number, char: string) => {
        if (index < 6) return /^[a-zA-Z0-9]$/.test(char); // 문자/숫자
        return /^[0-9]$/.test(char); // 숫자만
    };

    const handleChange = (index: number, value: string) => {
        if (!isCharValid(index, value)) return;

        inputsRef.current[index]!.value = value;

        if (value && index < 7) {
            const nextInput = inputsRef.current[index + (index === 5 ? 2 : 1)];
            nextInput?.focus();
        }

        const code = getBarcode();
        if (code.length === 9) onSubmit(code);
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !inputsRef.current[index]?.value && index > 0) {
            const prevInput = inputsRef.current[index - (index === 7 ? 2 : 1)];
            prevInput?.focus();
        }
    };

    const getBarcode = () => {
        const parts = inputsRef.current.map((input) => input?.value || '');
        return `${parts.slice(0, 6).join('')}-${parts.slice(6).join('')}`;
    };

    useEffect(() => {
        inputsRef.current[0]?.focus();
    }, []);

    return (
        <div className="barcode-modal-overlay">
            <div className="barcode-modal">
                <h3>바코드 수동 입력</h3>
                <div className="barcode-input-container">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <input
                            key={i}
                            maxLength={1}
                            className="barcode-input"
                            ref={(el) => {
                                inputsRef.current[i] = el;
                            }}
                            onChange={(e) => handleChange(i, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(i, e)}
                        />
                    ))}
                    <span className="barcode-hyphen">-</span>
                    {Array.from({ length: 2 }).map((_, i) => (
                        <input
                            key={i}
                            maxLength={1}
                            className="barcode-input"
                            ref={(el: HTMLInputElement | null) => {
                                inputsRef.current[i] = el;
                            }}
                            onChange={(e) => handleChange(i, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(i, e)}
                        />
                    ))}
                </div>
                <div className="barcode-buttons">
                    <button onClick={() => onSubmit(getBarcode())}>확인</button>
                    <button onClick={onClose}>취소</button>
                </div>
            </div>
        </div>
    );
}