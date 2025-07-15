import React, {useEffect, useRef, useState} from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import './index.css';
import BarcodeManualInputModal from "../BarcodeManualInputModal";

type Props = {
    onScan: (code: string) => void;
    onClose: () => void;
};

export default function BarcodeScanner({ onScan, onClose }: Props) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
    const [showManualInput, setShowManualInput] = useState(false);
    const [activeStream, setActiveStream] = useState<MediaStream | null>(null);


    useEffect(() => {
        const reader = new BrowserMultiFormatReader();
        codeReaderRef.current = reader;

        const scan = async () => {
            try {
                const devices = await BrowserMultiFormatReader.listVideoInputDevices();
                const selectedDeviceId = devices[0]?.deviceId;
                if (!selectedDeviceId || !videoRef.current) return;

                await reader.decodeFromVideoDevice(
                    selectedDeviceId,
                    videoRef.current,
                    (result) => {
                        if (result) {
                            onScan(result.getText());
                        }
                    }
                );

                const stream = videoRef.current?.srcObject as MediaStream;
                if (stream) {
                    setActiveStream(stream);
                }
            } catch (e) {
                console.error('Camera error:', e);
            }
        };

        if (!showManualInput) {
            scan();
        }

        return () => {
            // cleanup
            if (activeStream) {
                activeStream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [onScan, showManualInput]);

    return (
        <>
            {!showManualInput && (
                <div className="scanner-overlay">
                    <div className="scanner-container">
                        <video ref={videoRef} className="scanner-video" />
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