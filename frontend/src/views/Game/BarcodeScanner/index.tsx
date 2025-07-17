import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';
import './style.css';

type Props = {
    onScan: (code: string) => void;
    onClose: () => void;
    onManualInput: () => void;
};

export default function BarcodeScanner({ onScan, onClose, onManualInput }: Props) {
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const scanId = 'reader';
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // 모달 열릴 때 스크롤 막기
        document.body.style.overflow = 'hidden';

        return () => {
            // 모달 닫힐 때 원복
            document.body.style.overflow = 'auto';
        };
    }, []);

    useEffect(() => {
        const element = document.getElementById(scanId);
        if (element) element.innerHTML = '';

        const scanner = new Html5Qrcode(scanId);
        scannerRef.current = scanner;

        // 딜레이 후 시작 (렌더링 보장)
        timeoutRef.current = setTimeout(async () => {
            try {
                await scanner.start(
                    { facingMode: 'environment' },
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                        aspectRatio: 1.0,
                        disableFlip: true
                    },
                    (decodedText) => {
                        console.log('📦 Scanned:', decodedText);
                        onScan(decodedText);
                    },
                    () => {}
                );
                setIsLoading(false); // ✅ 로딩 완료
            } catch (err) {
                console.error('Camera start error:', err);
                setIsLoading(false); // 실패해도 버튼 열어줌
            }
        }, 300);

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);

            const stopAndClear = async () => {
                try {
                    const current = scannerRef.current;
                    if (!current) return;

                    const state = current.getState?.();
                    if (state === Html5QrcodeScannerState.SCANNING) {
                        await current.stop();
                    }

                    setTimeout(() => {
                        try {
                            current.clear();
                        } catch (e) {
                            console.warn('clear() error:', e);
                        }
                    }, 100);
                } catch (err) {
                    console.warn('stop() error:', err);
                }
            };

            stopAndClear();
        };
    }, [onScan]);

    return (
        <div className="scanner-overlay">
            <div className="scanner-container">
                <div id={scanId} />

                <button
                    className="close-button"
                    onClick={onClose}
                    disabled={isLoading}
                    style={{
                        opacity: isLoading ? 0.4 : 1,
                        pointerEvents: isLoading ? 'none' : 'auto',
                    }}
                >
                    ×
                </button>

                {isLoading && <div className="loading-spinner" />}

                {/* ✅ 수동입력 버튼 추가 */}
                {!isLoading && (
                    <button className="manual-input-button" onClick={onManualInput}>
                        수동 입력
                    </button>
                )}
            </div>
        </div>
    );
}