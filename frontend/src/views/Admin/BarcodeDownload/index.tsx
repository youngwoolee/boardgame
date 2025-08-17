import React, { useState, useEffect } from 'react';
import JSZip from 'jszip';
import JsBarcode from 'jsbarcode';
import { getGameListRequest } from '../../../apis';
import { GameResponseDto } from '../../../apis/response/game';
import './style.css';
import { useNavigate } from 'react-router-dom'; // useNavigate 추가
import { FiArrowLeft } from 'react-icons/fi'; // FiArrowLeft 추가

export default function BarcodeDownload() {
    const [gameList, setGameList] = useState<GameResponseDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedGames, setSelectedGames] = useState<Set<number>>(new Set());
    const [downloading, setDownloading] = useState(false);
    const [printLayout, setPrintLayout] = useState<'single' | 'a4'>('a4');
    const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태 추가

    const navigate = useNavigate(); // useNavigate 훅 사용

    // 검색된 게임 목록 계산
    const filteredGameList = gameList.filter(game => 
        game.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
        if (selectedGames.size === filteredGameList.length) {
            setSelectedGames(new Set());
        } else {
            const allGameIds = new Set(filteredGameList.map(game => game.id));
            setSelectedGames(allGameIds);
        }
    };

    const generateBarcodeImage = (barcode: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            try {
                const canvas = document.createElement('canvas');
                JsBarcode(canvas, barcode, {
                    format: "CODE128",
                    width: 1.5,
                    height: 60,
                    displayValue: true, // 바코드 번호를 이미지에 표시
                    fontSize: 16,
                    margin: 5
                });
                
                const dataUrl = canvas.toDataURL('image/png');
                resolve(dataUrl);
            } catch (error) {
                reject(error);
            }
        });
    };

    const generateA4PrintLayout = async (games: GameResponseDto[]) => {
        const zip = new JSZip();
        const gamesPerPage = 8; // 고정: 한 페이지에 8개 (2x4)
        const totalPages = Math.ceil(games.length / gamesPerPage);

        // 고정된 바코드 크기 (mm 단위)
        const barcodeWidthMm = 50;  // 바코드 너비 50mm
        const barcodeHeightMm = 20; // 바코드 높이 20mm (25mm에서 20mm로 더 줄임)
        const textHeightMm = 20;    // 텍스트 영역 높이 20mm (바코드와 겹치지 않도록 조정)
        const spacingMm = 25;       // 바코드 간 간격 25mm (더 넓게)

        for (let pageNum = 0; pageNum < totalPages; pageNum++) {
            const pageGames = games.slice(pageNum * gamesPerPage, (pageNum + 1) * gamesPerPage);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;

            // A4 세로 크기 (210mm x 297mm)를 픽셀로 변환 (300 DPI 기준 - 인쇄 품질 향상)
            const dpi = 300;
            const mmToPixels = dpi / 25.4;
            
            const pageWidth = Math.round(210 * mmToPixels);   // 210mm (고정)
            const pageHeight = Math.round(297 * mmToPixels);  // 297mm (고정)
            
            canvas.width = pageWidth;
            canvas.height = pageHeight;

            // 흰색 배경
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, pageWidth, pageHeight);

            // 고정 2x4 그리드
            const cols = 2;  // 2열
            const rows = 4;  // 4행
            
            // 여백 설정 (20mm)
            const margin = Math.round(20 * mmToPixels);
            const usableWidth = pageWidth - (margin * 2);
            const usableHeight = pageHeight - (margin * 2);
            
            // 고정된 바코드 크기를 픽셀로 변환
            const barcodeWidthPx = Math.round(barcodeWidthMm * mmToPixels);
            const barcodeHeightPx = Math.round(barcodeHeightMm * mmToPixels);
            const textHeightPx = Math.round(textHeightMm * mmToPixels);
            const spacingPx = Math.round(spacingMm * mmToPixels);
            
            // 그리드 셀 크기 계산 (바코드 크기 + 간격 + 텍스트 영역)
            const cellWidth = barcodeWidthPx + spacingPx;
            const cellHeight = barcodeHeightPx + spacingPx + textHeightPx;
            
            // 그리드 시작 위치 계산 (왼쪽 위부터 시작)
            const gridStartX = margin;
            const gridStartY = margin;

            // 각 바코드를 2x4 그리드에 배치 (왼쪽 위부터 채움)
            for (let i = 0; i < Math.min(pageGames.length, 8); i++) {
                const game = pageGames[i];
                const row = Math.floor(i / 2); // 2열 고정
                const col = i % 2;             // 2행 고정
                
                const x = gridStartX + (col * cellWidth);
                const y = gridStartY + (row * cellHeight);

                try {
                    // 바코드 이미지 생성
                    const barcodeImage = await generateBarcodeImage(game.barcode);
                    const img = new Image();
                    
                    await new Promise((resolve, reject) => {
                        img.onload = resolve;
                        img.onerror = reject;
                        img.src = barcodeImage;
                    });

                    // 바코드 위치 계산 (셀 중앙)
                    const barcodeX = x + (cellWidth - barcodeWidthPx) / 2;
                    const barcodeY = y;

                    // 바코드 그리기 (고정 크기)
                    ctx.drawImage(img, barcodeX, barcodeY, barcodeWidthPx, barcodeHeightPx);

                    // 바코드와 바코드 코드를 묶는 가이드선 (바코드 + 바코드 코드 영역)
                    ctx.strokeStyle = '#999';
                    ctx.lineWidth = 2;
                    ctx.setLineDash([]); // 실선
                    const barcodeSetHeight = barcodeHeightPx; // 바코드만 포함 (바코드 번호는 이미지에 포함됨)
                    ctx.strokeRect(barcodeX, y, barcodeWidthPx, barcodeSetHeight);

                    // 게임명 추가 (상자 밖에 배치, 텍스트 길이 제한)
                    ctx.font = `bold ${Math.round(9 * mmToPixels)}px Arial`;
                    const gameName = game.name.length > 10 ? game.name.substring(0, 10) + '...' : game.name;
                    ctx.fillText(gameName, x + cellWidth / 2, y + cellHeight - 5);

                    // 전체 아이템 자르기 가이드선 (점선)
                    ctx.strokeStyle = '#ccc';
                    ctx.lineWidth = 1;
                    ctx.setLineDash([3, 3]);
                    ctx.strokeRect(x, y, cellWidth, cellHeight);
                    ctx.setLineDash([]); // 점선 해제

                } catch (error) {
                    console.error(`바코드 생성 실패 (${game.name}):`, error);
                    
                    // 에러 시 텍스트로 표시
                    ctx.fillStyle = 'red';
                    ctx.font = `bold ${Math.round(14 * mmToPixels)}px Arial`;
                    ctx.textAlign = 'center';
                    ctx.fillText('바코드 생성 실패', x + cellWidth / 2, y + cellHeight / 2);
                }
            }

            // 페이지를 이미지로 변환하여 압축파일에 추가
            const pageImage = canvas.toDataURL('image/png');
            const response = await fetch(pageImage);
            const blob = await response.blob();
            
            const fileName = `barcodes_page_${pageNum + 1}_portrait.png`;
            zip.file(fileName, blob);
        }

        return zip;
    };

    const downloadSelectedBarcodes = async () => {
        if (selectedGames.size === 0) {
            alert('다운로드할 게임을 선택해주세요.');
            return;
        }

        try {
            setDownloading(true);
            const selectedGameList = gameList.filter(game => selectedGames.has(game.id));
            
            let zip: JSZip;
            if (printLayout === 'a4') {
                zip = await generateA4PrintLayout(selectedGameList);
            } else {
                zip = new JSZip();
                for (const game of selectedGameList) {
                    try {
                        const barcodeImage = await generateBarcodeImage(game.barcode);
                        
                        // 고정된 크기의 캔버스 생성
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d')!;
                        
                        // 고정된 바코드 크기 (50mm x 30mm, 300 DPI)
                        const dpi = 300;
                        const mmToPixels = dpi / 25.4;
                        const barcodeWidth = Math.round(50 * mmToPixels);
                        const barcodeHeight = Math.round(30 * mmToPixels);
                        const textHeight = Math.round(15 * mmToPixels);
                        const totalHeight = barcodeHeight + textHeight + 20; // 여백 포함
                        
                        canvas.width = barcodeWidth;
                        canvas.height = totalHeight;
                        
                        // 흰색 배경
                        ctx.fillStyle = 'white';
                        ctx.fillRect(0, 0, barcodeWidth, totalHeight);
                        
                        // 바코드 이미지 로드
                        const img = new Image();
                        await new Promise((resolve, reject) => {
                            img.onload = resolve;
                            img.onerror = reject;
                            img.src = barcodeImage;
                        });
                        
                        // 바코드 그리기 (고정 크기)
                        ctx.drawImage(img, 0, 0, barcodeWidth, barcodeHeight);
                        
                        // 바코드와 바코드 코드를 묶는 가이드선 (바코드만 포함, 번호는 이미지에 포함됨)
                        ctx.strokeStyle = '#999';
                        ctx.lineWidth = 2;
                        ctx.strokeRect(0, 0, barcodeWidth, barcodeHeight);
                        
                        // 게임명 추가 (바코드 세트 아래에 배치, 더 명확하게)
                        ctx.fillStyle = 'black';
                        ctx.font = `bold ${Math.round(14 * mmToPixels)}px Arial`;
                        ctx.textAlign = 'center';
                        const gameName = game.name.length > 12 ? game.name.substring(0, 12) + '...' : game.name;
                        ctx.fillText(gameName, barcodeWidth / 2, barcodeHeight + 35);
                        
                        // 전체 자르기 가이드선 (점선)
                        ctx.strokeStyle = '#ccc';
                        ctx.lineWidth = 1;
                        ctx.setLineDash([3, 3]);
                        ctx.strokeRect(0, 0, barcodeWidth, totalHeight);
                        ctx.setLineDash([]);
                        
                        // 압축파일에 추가
                        const finalImage = canvas.toDataURL('image/png');
                        const response = await fetch(finalImage);
                        const blob = await response.blob();
                        zip.file(`${game.name}_${game.barcode}.png`, blob);
                    } catch (error) {
                        console.error(`바코드 생성 실패 (${game.name}):`, error);
                    }
                }
            }

            // 압축파일 다운로드
            const content = await zip.generateAsync({ type: 'blob' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            
            const layoutText = printLayout === 'a4' ? 'A4_print' : 'individual';
            const orientationText = 'portrait'; // 포트레이트 고정
            link.download = `barcodes_${layoutText}_${orientationText}_${new Date().toISOString().split('T')[0]}.zip`;
            link.click();
            
            // 메모리 정리
            URL.revokeObjectURL(link.href);
            
            const layoutDesc = printLayout === 'a4' ? 'A4 인쇄용 레이아웃' : '개별 바코드';
            const orientationDesc = 'portrait'; // 포트레이트 고정
            alert(`${selectedGames.size}개 게임의 바코드가 ${layoutDesc}(${orientationDesc})으로 압축파일에 저장되었습니다.`);
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
            
            // 고정된 크기의 캔버스 생성
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;
            
            // 고정된 바코드 크기 (50mm x 30mm, 300 DPI)
            const dpi = 300;
            const mmToPixels = dpi / 25.4;
            const barcodeWidth = Math.round(50 * mmToPixels);
            const barcodeHeight = Math.round(30 * mmToPixels);
            const textHeight = Math.round(15 * mmToPixels);
            const totalHeight = barcodeHeight + textHeight + 20; // 여백 포함
            
            canvas.width = barcodeWidth;
            canvas.height = totalHeight;
            
            // 흰색 배경
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, barcodeWidth, totalHeight);
            
            // 바코드 이미지 로드
            const img = new Image();
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = barcodeImage;
            });
            
            // 바코드 그리기 (고정 크기)
            ctx.drawImage(img, 0, 0, barcodeWidth, barcodeHeight);

            // 바코드와 바코드 코드를 묶는 가이드선 (바코드 + 바코드 코드 영역)
            ctx.strokeStyle = '#999';
            ctx.lineWidth = 2;
            ctx.setLineDash([]); // 실선
            const barcodeSetHeight = barcodeHeight; // 바코드만 포함 (바코드 번호는 이미지에 포함됨)
            ctx.strokeRect(0, 0, barcodeWidth, barcodeSetHeight);
            
            // 게임명 추가 (상자 밖에 배치)
            ctx.fillStyle = 'black';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            const gameName = game.name.length > 15 ? game.name.substring(0, 15) + '...' : game.name;
            ctx.fillText(gameName, canvas.width / 2, canvas.height - 15);
            
            // 전체 아이템 자르기 가이드선 (점선)
            ctx.strokeStyle = '#ccc';
            ctx.lineWidth = 1;
            ctx.setLineDash([3, 3]);
            ctx.strokeRect(0, 0, canvas.width, canvas.height);
            ctx.setLineDash([]);
            
            // 다운로드
            const finalImage = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `${game.name}_${game.barcode}.png`;
            link.href = finalImage;
            link.click();
        } catch (error) {
            console.error('바코드 다운로드 실패:', error);
            alert('바코드 다운로드에 실패했습니다.');
        }
    };

    const handleBackClick = () => {
        // 관리자 대시보드로 돌아갈 때는 replace로 처리하여 히스토리 스택을 관리
        navigate('/admin', { replace: true });
    };

    return (
        <div className="barcode-download-page">
            <div className="page-header">
                <button className="back-button" onClick={handleBackClick}>
                    <FiArrowLeft className="back-icon" />
                    뒤로가기
                </button>
                <div className="header-content">
                    <h1>바코드 다운로드</h1>
                    <p>게임별 바코드를 생성하고 다운로드합니다</p>
                </div>
            </div>

            <div className="controls-section">
                <div className="search-controls">
                    <input
                        type="text"
                        placeholder="보드게임 이름으로 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <span className="filtered-count">
                        {filteredGameList.length}개 게임 (전체 {gameList.length}개)
                    </span>
                </div>
                
                <div className="select-controls">
                    <label className="select-all-checkbox">
                        <input
                            type="checkbox"
                            checked={selectedGames.size === filteredGameList.length && filteredGameList.length > 0}
                            onChange={handleSelectAll}
                        />
                        <span>전체 선택</span>
                    </label>
                    <span className="selected-count">
                        {selectedGames.size}개 선택됨
                    </span>
                </div>

                <div className="layout-controls">
                    <div className="layout-option">
                        <label>
                            <input
                                type="radio"
                                name="layout"
                                value="a4"
                                checked={printLayout === 'a4'}
                                onChange={(e) => setPrintLayout(e.target.value as 'single' | 'a4')}
                            />
                            A4 세로 인쇄용 레이아웃 (권장) - 한 페이지에 8개 (2x4)
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="layout"
                                value="single"
                                checked={printLayout === 'single'}
                                onChange={(e) => setPrintLayout(e.target.value as 'single' | 'a4')}
                            />
                            개별 바코드
                        </label>
                    </div>
                    
                    {printLayout === 'a4' && (
                        <div className="barcodes-per-page">
                            <label>
                                페이지당 바코드 수: <strong>8개 (2x4 그리드)</strong>
                            </label>
                            <small className="layout-hint">
                                * A4 세로 용지에 왼쪽 위부터 순서대로 채워집니다
                            </small>
                        </div>
                    )}
                </div>
                
                <div className="action-buttons">
                    
                    <button
                        className="download-selected-btn"
                        onClick={downloadSelectedBarcodes}
                        disabled={selectedGames.size === 0 || downloading}
                    >
                        {downloading ? '다운로드 중...' : `선택된 게임 바코드 다운로드 (${selectedGames.size}개)`}
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="loading">로딩 중...</div>
            ) : (
                <div className="game-list">
                    {filteredGameList.map((game) => (
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