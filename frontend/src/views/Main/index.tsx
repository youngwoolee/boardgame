import React, {JSX, useEffect, useState} from 'react';
import './style.css';
import {FiBookmark, FiCamera, FiSearch, FiShoppingCart, FiUsers} from 'react-icons/fi';
import GameDetailModal from '../Game/GameDetailModal';
import RentalModal from "../Game/RentalModal";
import BarcodeScanner from "../Game/BarcodeScanner";
import {GameListResponseDto, GameResponseDto} from "../../apis/response/game";
import {getGameListRequest} from "../../apis";
import {ResponseCode} from "../../types/enums";
import {ResponseBody} from "../../types";
import BarcodeManualInputModal from "../Game/BarcodeManualInputModal";
import {useNavigate} from "react-router-dom";
import BottomNavigation from "../../components/BottomNavigation";
import {ClipLoader} from "react-spinners";
import { toast } from 'react-toastify';


interface SelectedGame {
    id: number;
    barcode: string;
    name: string;
    imageUrl: string;
}

export default function Main() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [selectedList, setSelectedList] = useState<SelectedGame[]>([]);
    const [gameList, setGameList] = useState<GameResponseDto[]>([]);
    const [selectedGame, setSelectedGame] = useState<GameResponseDto | null>(null);
    const [showRentalModal, setShowRentalModal] = useState(false);
    const [showScanner, setShowScanner] = useState(false);
    const [showManualInput, setShowManualInput] = useState(false);

    const [genreFilter, setGenreFilter] = useState<string>('');
    const [playerFilter, setPlayerFilter] = useState<string>('');
    const [sortFilter, setSortFilter] = useState<string>('name');

    const playerOptions = ['1', '2', '3', '4', '5', '6+'];

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const response = await getGameListRequest();
            gameListResponseHandler(response, setGameList);
            setLoading(false);
        })();
    }, []);

    const gameListResponseHandler = (
        responseBody: ResponseBody<GameListResponseDto>,
        setGameList: React.Dispatch<React.SetStateAction<GameResponseDto[]>>
    ) => {
        if(!responseBody) return;
        const { code } = responseBody;
        if( code === ResponseCode.DATABASE_ERROR) toast.error('데이터베이스 오류입니다');
        if( code !== ResponseCode.SUCCESS) return;

        const {data} = responseBody as GameListResponseDto;

        if (Array.isArray(data)) {
            setGameList(data);
        }
    };

    const handleBarcodeScanned = (scannedCode: string) => {
        const isAlreadySelected = selectedList.some(game => game.barcode === scannedCode);
        if (isAlreadySelected) {
            toast.warn('이미 대여 목록에 추가된 보드게임입니다.');
            setShowScanner(false);
            return;
        }

        const matched = gameList.find(g => scannedCode === g.barcode);
        if (!matched) {
            toast.error('일치하는 보드게임을 찾을 수 없습니다.');
            setShowScanner(false);
            return;
        }

        // 대여중인 게임인지 확인
        if (!matched.available) {
            toast.error(`'${matched.name}'은(는) 이미 대여중인 보드게임입니다.`);
            setShowScanner(false);
            return;
        }

        const newEntry: SelectedGame = {
            id: matched.id,
            barcode: matched.barcode,
            name: matched.name,
            imageUrl: matched.imageUrl
        };

        setSelectedList(prev => [...prev, newEntry]);
        toast.success(`'${matched.name}'이(가) 대여 목록에 추가되었습니다.`);
        setShowScanner(false);
    };

    const toggleSelectByGame = (name: string) => {
        // 대여중인 게임인지 확인
        const game = gameList.find(g => g.name === name);
        if (game && !game.available) {
            toast.error(`'${name}'은(는) 이미 대여중인 보드게임입니다.`);
            return;
        }
        
        setSelectedList(prev => prev.filter(g => g.name !== name));
    };



    // 필터링 및 정렬 처리
    const filteredGames = gameList
        .filter(game => game.name.toLowerCase().includes(search.toLowerCase()))
        .filter(game =>
            genreFilter
                ? game.genres?.includes(genreFilter)
                : true
        )
        .filter(game => {
            if (!playerFilter) return true;
            const selectedCount = playerFilter === '6+' ? 6 : parseInt(playerFilter, 10);
            return game.minPlayers <= selectedCount && selectedCount <= game.maxPlayers;
        })
        .sort((a, b) => {
            if (sortFilter === 'weight') {
                return (a.weight || 0) - (b.weight || 0); // 난이도 오름차순
            }
            return a.name.localeCompare(b.name); // 기본값: 이름 오름차순
        });

    const allGenres = gameList.flatMap(game => game.genres || []);
    const uniqueGenres = Array.from(new Set(allGenres)).sort();

    const uniqueFilteredGames = Array.from(
        new Map(filteredGames.map(game => [game.name, game])).values()
    );

    return (
        <div className="main-wrapper">
            {/* 상단 검색창 */}
            <div className="main-search-box">
                <div className="main-search-row">
                    <input
                        type="text"
                        placeholder="보드게임 검색..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button className="search-button" type="button">
                        {FiSearch({ size: 20 }) as unknown as JSX.Element}
                    </button>
                    <button className="camera-button" onClick={() => setShowScanner(true)}>
                        {FiCamera({ size: 20 }) as unknown as JSX.Element}
                    </button>
                </div>

                <div className="filter-row">
                    <select value={playerFilter} onChange={(e) => setPlayerFilter(e.target.value)}>
                        <option value=''>전체 인원</option>
                        {playerOptions.map(count => (
                            <option key={count} value={count}>{count}명</option>
                        ))}
                    </select>

                    <select value={genreFilter} onChange={(e) => setGenreFilter(e.target.value)}>
                        <option value=''>전체 장르</option>
                        {uniqueGenres.map(genre => (
                            <option key={genre} value={genre}>
                                {genre}
                            </option>
                        ))}
                    </select>

                    <select value={sortFilter} onChange={(e) => setSortFilter(e.target.value)}>
                        <option value='name'>이름순</option>
                        <option value='weight'>난이도순</option>
                    </select>
                </div>
            </div>


            {/* 게임 목록 */}
            {loading ? (
                <div className="loading-indicator">
                    <ClipLoader color="#007bff" loading={loading} cssOverride={{
                        borderWidth: '5px'
                    }} size={40} />
                </div>
            ) : (
                <div className="main-grid">
                    {uniqueFilteredGames.length > 0 ? (
                        uniqueFilteredGames.map((game) => {
                            const isSelected = selectedList.some(g => g.name === game.name);
                            
                            // 같은 이름의 게임들의 대여 상태 확인
                            const sameNameGames = gameList.filter(g => g.name === game.name);
                            const allRented = sameNameGames.every(g => !g.available);
                                    
                                    let rentalStatus = '';
                                    let isAllRented = false;
                                    if (allRented && sameNameGames.length > 0) {
                                        rentalStatus = '대여 중';
                                        isAllRented = true;
                                    }
                            
                            return (
                                <div
                                    className={`main-card ${isAllRented ? 'rented' : ''}`}
                                    key={game.name}
                                    onClick={() => {
                                        if (isSelected) {
                                            // 이미 선택된 게임이면 선택 해제
                                            toggleSelectByGame(game.name);
                                            return;
                                        }
                                        
                                        // 대여중인 게임은 상세 모달을 열 수 없음
                                        if (!game.available) {
                                            toast.error(`'${game.name}'은(는) 이미 대여중인 보드게임입니다.`);
                                            return;
                                        }
                                        
                                        const sameNameGames = gameList.filter(g => g.name === game.name);
                                        const barcodesWithStatus = sameNameGames.map(g => ({
                                            barcode: g.barcode,
                                            available: g.available
                                        }));
                                            
                                        const gameWithAllBarcodes = {
                                            ...game,
                                            barcodes: barcodesWithStatus,
                                            available: game.available
                                        };
                                        
                                        console.log('GameDetailModal에 전달할 데이터:', gameWithAllBarcodes);
                                        setSelectedGame(gameWithAllBarcodes);
                                    }}
                                >
                                    <div className="main-card-image-wrapper">
                                        <img src={game.imageUrl} alt={game.name} className="main-card-image"
                                             onError={(e) => {
                                                 e.currentTarget.style.display = 'none';
                                             }}/>
                                        {game.tag && (
                                            <span className={`main-tag ${game.tag.toLowerCase()}`}>{game.tag}</span>
                                        )}

                                        {isSelected && (
                                            <button
                                                className="selection-overlay"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleSelectByGame(game.name);
                                                }}
                                                title="클릭하여 선택 해제"
                                            >
                                                <span>선택됨</span>
                                            </button>
                                        )}
                                        
                                        {/* 대여 중 오버레이 */}
                                        {isAllRented && (
                                            <div className="rental-overlay">
                                                <span>대여중</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="main-card-footer">
                                        <div className="main-card-title">
                                            {game.name}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="no-results">
                            검색 결과가 없습니다.
                        </div>
                    )}
                </div>
            )}

            {/* 하단 내비게이션 */}
            <BottomNavigation />


            {/* 플로팅 버튼 */}
            {!showRentalModal && (
            <div className="floating-button" onClick={() => setShowRentalModal(true)}>
                <FiShoppingCart />
                {selectedList.length > 0 && (
                    <div className="badge">{selectedList.length}</div>
                )}
            </div>
            )}

            {/* 상세 모달 */}
            {selectedGame && (
                <GameDetailModal game={selectedGame} onClose={() => setSelectedGame(null)} />
            )}

                        {/* 대여 모달 */}
            {showRentalModal && (
                <RentalModal
                    list={selectedList}
                    onClose={() => setShowRentalModal(false)}
                    onRented={() => setSelectedList([])}  // 예: 대여 후 목록 초기화
                    onRemoveGame={(gameName) => setSelectedList(prev => prev.filter(g => g.name !== gameName))}
                    gameList={gameList}
                />
            )}


            {/* 바코드 스캐너 */}
            {showScanner && (
                <BarcodeScanner
                    onScan={handleBarcodeScanned}
                    onClose={() => setShowScanner(false)}
                    onManualInput={() => {
                        setShowScanner(false);
                        setShowManualInput(true); // 수동입력 모달 열기
                    }}
                />
            )}

            {/* 바코드 수동입력 모달 */}
            {showManualInput && (
                <BarcodeManualInputModal
                    onSubmit={(code: string) => {
                        const isAlreadySelected = selectedList.some(game => game.barcode === code);
                        if (isAlreadySelected) {
                            toast.warn('이미 대여 목록에 추가된 보드게임입니다.');
                            return;
                        }

                        const matched = gameList.find(g => g.barcode === code);
                        if (!matched) {
                            toast.error('일치하는 보드게임을 찾을 수 없습니다.');
                            return;
                        }

                        // 대여중인 게임인지 확인
                        if (!matched.available) {
                            toast.error(`'${matched.name}'은(는) 이미 대여중인 보드게임입니다.`);
                            return;
                        }

                        const newEntry: SelectedGame = {
                            id: matched.id,
                            barcode: matched.barcode,
                            name: matched.name,
                            imageUrl: matched.imageUrl
                        };

                        setSelectedList(prev => [...prev, newEntry]);
                        toast.success(`'${matched.name}'이(가) 대여 목록에 추가되었습니다.`);
                        setShowManualInput(false);
                    }}
                    onClose={() => setShowManualInput(false)}
                />
            )}
        </div>

    );
}
