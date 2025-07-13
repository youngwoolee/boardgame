import React, {JSX, useEffect, useState} from 'react';
import './style.css';
import {FiBookmark, FiCamera, FiSearch, FiShoppingCart, FiUsers} from 'react-icons/fi';
import GameDetailModal from '../Game/GameDetailModal';
import RentalModal from "../Game/GameRentalModal";
import BarcodeScanner from "../Game/BarcodeScanner";
import {GameListResponseDto, GameResponseDto} from "../../apis/response/game";
import {getGameListRequest} from "../../apis";
import {ResponseCode} from "../../types/enums";
import {ResponseBody} from "../../types";


interface SelectedGame {
    id: number;
    barcode: string;
    name: string;
    imageUrl: string;
}

export default function Main() {
    const [search, setSearch] = useState('');
    const [selectedList, setSelectedList] = useState<SelectedGame[]>([]);
    const [gameList, setGameList] = useState<GameResponseDto[]>([]);
    const [selectedGame, setSelectedGame] = useState<GameResponseDto | null>(null);
    const [showRentalModal, setShowRentalModal] = useState(false);
    const [showScanner, setShowScanner] = useState(false);

    const [genreFilter, setGenreFilter] = useState<string>('');
    const [playerFilter, setPlayerFilter] = useState<string>('');
    const [rentalStatusFilter, setRentalStatusFilter] = useState<string>('');

    useEffect(() => {
        (async () => {
            const response = await getGameListRequest();
            gameListResponseHandler(response, setGameList);
        })();
    }, []);

    const gameListResponseHandler = (
        responseBody: ResponseBody<GameListResponseDto>,
        setGameList: React.Dispatch<React.SetStateAction<GameResponseDto[]>>
    ) => {
        if(!responseBody) return;
        const { code } = responseBody;
        if( code === ResponseCode.DATABASE_ERROR) alert('데이터베이스 오류입니다');
        if( code !== ResponseCode.SUCCESS) return;

        const {data} = responseBody as GameListResponseDto;

        console.log(data);
        if (Array.isArray(data)) {
            setGameList(data);
        }
    };

    const handleBarcodeScanned = (scannedCode: string) => {
        const isAlreadySelected = selectedList.some(game => game.barcode === scannedCode);
        if (isAlreadySelected) {
            alert('이미 대여 목록에 추가된 보드게임입니다.');
            setShowScanner(false);
            return;
        }

        const matched = gameList.find(g => scannedCode === g.barcode);
        if (!matched) {
            alert('일치하는 보드게임을 찾을 수 없습니다.');
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
        alert(`'${matched.name}'이(가) 대여 목록에 추가되었습니다.`);
        setShowScanner(false);
    };

    const toggleSelectByGame = (name: string) => {
        setSelectedList(prev => prev.filter(g => g.name !== name));
    };



    // 필터링 및 정렬 처리
    const filteredGames = gameList
        .filter(game => game.name.toLowerCase().includes(search.toLowerCase()))
        .filter(game => genreFilter ? game.genre === genreFilter : true)
        .filter(game => playerFilter ? game.players.includes(playerFilter) : true)
        .filter(game => {
            if (rentalStatusFilter === 'available') return game.available;
            if (rentalStatusFilter === 'rented') return !game.available;
            return true;
        })
        .sort((a, b) => a.name.localeCompare(b.name));
    const genres = Array.from(new Set(gameList.map(game => game.genre))).sort();
    const playerCounts = Array.from(new Set(gameList.map(game => game.players))).sort();

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
                        {playerCounts.map(count => (
                            <option key={count} value={count}>{count}</option>
                        ))}
                    </select>

                    <select value={genreFilter} onChange={(e) => setGenreFilter(e.target.value)}>
                        <option value=''>전체 장르</option>
                        {genres.map(genre => (
                            <option key={genre} value={genre}>{genre}</option>
                        ))}
                    </select>

                    <select value={rentalStatusFilter} onChange={(e) => setRentalStatusFilter(e.target.value)}>
                        <option value=''>전체</option>
                        <option value='available'>대여 가능</option>
                        <option value='rented'>대여 중</option>
                    </select>
                </div>
            </div>



            {/* 게임 목록 */}
            <div className="main-grid">
                {uniqueFilteredGames.map((game) => {
                    const isSelected = selectedList.some(g => g.name === game.name);
                    return (
                        <div className={`main-card ${isSelected ? 'selected' : ''}`} key={game.name}>
                            <div
                                className="main-card-image-wrapper"
                                onClick={() => setSelectedGame(game)}
                            >
                                <img src={game.imageUrl} alt={game.name} className="main-card-image" />
                            </div>
                            <div className="main-card-footer">
                                <div className="main-card-title">
                                    {game.name}
                                    {game.tag && (
                                        <span className={`main-tag ${game.tag.toLowerCase()}`}>{game.tag}</span>
                                    )}
                                </div>
                                {isSelected && (
                                    <button
                                        className="rent-button"
                                        onClick={() => toggleSelectByGame(game.name)}
                                    >
                                        선택됨
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 하단 내비게이션 */}
            <div className="bottom-nav">
                <div className="nav-item active">대여</div>
                <div className="nav-item">순위</div>
                <div className="nav-item">나의 정보</div>
            </div>

            {/* 플로팅 버튼 */}
            <div className="floating-button" onClick={() => setShowRentalModal(true)}>
                {FiShoppingCart as unknown as JSX.Element}
                {selectedList.length > 0 && <div className="badge">{selectedList.length}</div>}
            </div>

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
                />
            )}

            {/* 바코드 스캐너 */}
            {showScanner && (
                <BarcodeScanner
                    onScan={handleBarcodeScanned}
                    onClose={() => setShowScanner(false)}
                />
            )}
        </div>
    );
}
