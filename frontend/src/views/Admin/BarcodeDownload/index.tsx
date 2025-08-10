import React, { useState, useEffect } from 'react';
import JSZip from 'jszip';
import JsBarcode from 'jsbarcode';
import { getGameListRequest } from '../../../apis';
import { GameResponseDto } from '../../../apis/response/game';
import './style.css';

export default function BarcodeDownload() {
    const [gameList, setGameList] = useState<GameResponseDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedGames, setSelectedGames] = useState<Set<number>>(new Set());
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        fetchGameList();
    }, []);

    const fetchGameList = async () => {
        try {
            setLoading(true);
            const response = await getGameListRequest();
            if (response && 'data' in response && response.data) {
                setGameList(response.data);
            }
        } catch (error) {
            console.error('게임 목록을 불러오는데 실패했습니다:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGameSelect = (gameId: number) => {
        const newSelected = new Set(selectedGames);
        if (newSelected.has(gameId)) {
            newSelected.delete(gameId);
        } else {
            newSelected.add(gameId);
        }
        setSelectedGames(newSelected);
    };

    const handleSelectAll = () => {
        if (selectedGames.size === gameList.length) {
            setSelectedGames(new Set());
        } else {
            setSelectedGames(new Set(gameList.map(game => game.id)));
        }
    };

    const generateBarcodeImage = (barcode: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            try {
                const canvas = document.createElement('canvas');
                JsBarcode(canvas, barcode, {
                    format: "CODE128",
                    width: 2,
                    height: 100,
                    displayValue: true,
                    fontSize: 20,
                    margin: 10
                });
                
                const dataUrl = canvas.toDataURL('image/png');
                resolve(dataUrl);
            } catch (error) {
                reject(error);
            }
        });
    };

    const downloadSelectedBarcodes = async () => {
        if (selectedGames.size === 0) {
            alert('다운로드할 게임을 선택해주세요.');
            return;
        }

        try {
            setDownloading(true);
            const zip = new JSZip();
            const selectedGameList = gameList.filter(game => selectedGames.has(game.id));

            // 각 게임의 바코드 이미지 생성 및 압축파일에 추가
            for (const game of selectedGameList) {
                try {
                    const barcodeImage = await generateBarcodeImage(game.barcode);
                    
                    // Data URL을 Blob으로 변환
                    const response = await fetch(barcodeImage);
                    const blob = await response.blob();
                    
                    // 파일명 생성 (게임명_바코드.png)
                    const fileName = `${game.name}_${game.barcode}.png`;
                    
                    // 압축파일에 추가
                    zip.file(fileName, blob);
                } catch (error) {
                    console.error(`바코드 생성 실패 (${game.name}):`, error);
                }
            }

            // 압축파일 생성 및 다운로드
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(zipBlob);
            link.download = `barcodes_${new Date().toISOString().split('T')[0]}.zip`;
            link.click();
            
            // 메모리 정리
            URL.revokeObjectURL(link.href);
            
            alert(`${selectedGames.size}개 게임의 바코드가 압축파일로 다운로드되었습니다.`);
        } catch (error) {
            console.error('압축파일 생성 실패:', error);
            alert('압축파일 생성에 실패했습니다.');
        } finally {
            setDownloading(false);
        }
    };

    const downloadSingleBarcode = async (game: GameResponseDto) => {
        try {
            const barcodeImage = await generateBarcodeImage(game.barcode);
            const link = document.createElement('a');
            link.download = `${game.name}_${game.barcode}.png`;
            link.href = barcodeImage;
            link.click();
        } catch (error) {
            console.error('바코드 다운로드 실패:', error);
            alert('바코드 다운로드에 실패했습니다.');
        }
    };

    return (
        <div className="barcode-download-page">
            <div className="page-header">
                <h1>바코드 다운로드</h1>
                <p>보드게임에 붙일 바코드를 다운로드하세요</p>
            </div>

            <div className="controls-section">
                <div className="select-controls">
                    <label className="select-all-checkbox">
                        <input
                            type="checkbox"
                            checked={selectedGames.size === gameList.length && gameList.length > 0}
                            onChange={handleSelectAll}
                        />
                        <span>전체 선택</span>
                    </label>
                    <span className="selected-count">
                        {selectedGames.size}개 선택됨
                    </span>
                </div>
                
                <button
                    className="download-selected-btn"
                    onClick={downloadSelectedBarcodes}
                    disabled={selectedGames.size === 0 || downloading}
                >
                    {downloading ? '다운로드 중...' : `선택된 게임 바코드 다운로드 (${selectedGames.size}개)`}
                </button>
            </div>

            {loading ? (
                <div className="loading">로딩 중...</div>
            ) : (
                <div className="game-list">
                    {gameList.map((game) => (
                        <div key={game.id} className="game-item">
                            <div className="game-checkbox">
                                <input
                                    type="checkbox"
                                    checked={selectedGames.has(game.id)}
                                    onChange={() => handleGameSelect(game.id)}
                                />
                            </div>
                            
                            <div className="game-info">
                                <img 
                                    src={game.imageUrl} 
                                    alt={game.name} 
                                    className="game-thumbnail"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                                <div className="game-details">
                                    <h3>{game.name}</h3>
                                    <p className="game-barcode">바코드: {game.barcode}</p>
                                    {game.tag && <span className="game-tag">{game.tag}</span>}
                                </div>
                            </div>
                            
                            <div className="game-actions">
                                <button 
                                    className="download-single-btn"
                                    onClick={() => downloadSingleBarcode(game)}
                                >
                                    개별 다운로드
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
