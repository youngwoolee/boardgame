import React, { useEffect, useRef, useState } from 'react';
import './index.css';
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';
import BarcodeManualInputModal from '../BarcodeManualInputModal';

type Props = {
    onScan: (code: string) => void;
    onClose: () => void;
};

export default function BarcodeScanner({ onScan, onClose }: Props) {
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const scanId = 'reader';
    const [showManualInput, setShowManualInput] = useState(false);

    useEffect(() => {
        const element = document.getElementById(scanId);
        if (element) element.innerHTML = '';

        if (!scannerRef.current) {
            scannerRef.current = new Html5Qrcode(scanId);
        }

        const scanner = scannerRef.current;

        const startScanner = async () => {
            try {
                const state = scanner.getState();
                if (state !== Html5QrcodeScannerState.NOT_STARTED) return;

                await scanner.start(
                    { facingMode: 'environment' },
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                        aspectRatio: 1.0,
                    },
                    (decodedText) => {
                        console.log('📦 Scanned:', decodedText);
                        onScan(decodedText);
                    },
                    () => {}
                );
            } catch (err) {
                console.error('Camera start error:', err);
            }
        };

        if (!showManualInput) {
            startScanner();
        }

        return () => {
            if (scannerRef.current) {
                const state = scannerRef.current.getState();
                if (state === Html5QrcodeScannerState.SCANNING) {
                    scannerRef.current
                        .stop()
                        .then(() => {
                            try {
                                scannerRef.current?.clear();
                            } catch (e) {
                                console.warn("Clear failed:", e);
                            }
                        })
                        .catch((err) => {
                            console.warn("Stop error:", err);
                        });
                } else {
                    try {
                        scannerRef.current.clear();
                    } catch (e) {
                        console.warn("Clear error:", e);
                    }
                }
            }
        };
    }, [showManualInput]);

    return (
        <>
            {!showManualInput && (
                <div className="scanner-overlay">
                    <div className="scanner-container">
                        <div id={scanId} />
                        <button className="close-button" onClick={onClose}>×</button>
                        <button
                            className="manual-input-button"
                            onClick={() => setShowManualInput(true)}
                        >
                            바코드 수동 입력
                        </button>
                    </div>
                </div>
            )}

            {showManualInput && (
                <BarcodeManualInputModal
                    onSubmit={(code) => {
                        onScan(code);
                        setShowManualInput(false);
                    }}
                    onClose={() => setShowManualInput(false)}
                />
            )}
        </>
    );
}