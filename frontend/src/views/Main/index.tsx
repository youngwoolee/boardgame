import React, {JSX, useState} from 'react';
import './style.css';
import {FiBookmark, FiCamera, FiSearch, FiShoppingCart, FiUsers} from 'react-icons/fi';
import GameDetailModal from '../Game/GameDetailModal';
import RentalModal from "../Game/GameRentalModal";
import BarcodeScanner from "../Game/BarcodeScanner";

type Game = {
    id: number;
    name: string;
    imageUrl: string;
    tag: string | null;
    players: string;
    age: string;
    time: string;
    genre: string;
    system: string;
    description: string;
};

const dummyGames = [
    {
        id: 1,
        name: '아발론',
        imageUrl: '/assets/아발론.webp',
        tag: 'new',
        players: '5~10명',
        age: '만 14세+',
        time: '30~60분',
        genre: '추리, 팀플레이',
        system: '정체 은닉, 토론',
        description: '아발론은 선과 악의 세력이 대결하는 정체 은닉 기반의 심리전 게임입니다. 플레이어는 자신의 역할을 숨긴 채 미션을 성공 또는 실패시키며 상대 진영을 이기기 위해 협업과 추리를 펼칩니다.',
        barcode: 'AVALON2025'

    },
    {
        id: 2,
        name: '스플렌더',
        imageUrl: '/assets/스플렌더.webp',
        tag: 'hot',
        players: '2~4명',
        age: '만 10세+',
        time: '30분 내외',
        genre: '전략 게임',
        system: '셋 컬렉션, 카드 구매',
        description: '보석 상인이 되어 보석을 수집하고, 카드와 귀족을 구매해 점수를 얻는 전략형 보드게임입니다. 직관적인 규칙과 빠른 전개로 인기가 높습니다.',
        barcode: 'SPLEND2025'
    },
    {
        id: 3,
        name: '티켓 투 라이드',
        imageUrl: '/assets/티켓 투 라이드.webp',
        tag: 'new',
        players: '2~5명',
        age: '만 8세+',
        time: '30~60분',
        genre: '가족 게임',
        system: '노선 연결, 셋 컬렉션',
        description: '미국 전역의 기차 노선을 연결하며 점수를 얻는 게임입니다. 단순하면서도 전략적인 재미로 전 세계에서 사랑받는 가족용 보드게임입니다.',
        barcode: 'TTRIDE2025'
    },
    {
        id: 4,
        name: '도블',
        imageUrl: '/assets/dobble.jpg',
        tag: null,
        players: '2~8명',
        age: '만 6세+',
        time: '15분 내외',
        genre: '파티 게임',
        system: '반응 속도, 관찰력',
        description: '카드에 그려진 그림을 빠르게 매칭하는 게임입니다. 쉽고 빠르게 즐길 수 있어 남녀노소 모두에게 인기 있는 파티형 보드게임입니다.',
        barcode: 'DOBBLE2025'
    }
];

export default function Main() {
    const [search, setSearch] = useState('');
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const [selectedList, setSelectedList] = useState<Game[]>([]);
    const [showRentalModal, setShowRentalModal] = useState(false);
    const [showScanner, setShowScanner] = useState(false);

    const handleBarcodeScanned = (scannedCode: string) => {
        const foundGame = dummyGames.find((game) => game.barcode === scannedCode);

        if (!foundGame) {
            alert("일치하는 보드게임을 찾을 수 없습니다.");
            setShowScanner(false);
            return;
        }

        const alreadyInList = selectedList.some((g) => g.id === foundGame.id);
        if (alreadyInList) {
            alert("이미 대여 목록에 추가된 보드게임입니다.");
            setShowScanner(false);
            return;
        }

        setSelectedList((prev) => [...prev, foundGame]);
        alert(`'${foundGame.name}'이(가) 대여 목록에 추가되었습니다.`);
        setShowScanner(false);
    };

    const filteredGames = dummyGames.filter((game) =>
        game.name.toLowerCase().includes(search.toLowerCase())
    );

    const toggleSelect = (game: Game) => {
        if (selectedList.find((g) => g.id === game.id)) {
            setSelectedList((prev) => prev.filter((g) => g.id !== game.id));
        } else {
            setSelectedList((prev) => [...prev, game]);
        }
    };


    return (
        <div className="main-wrapper">
            {/* 상단 검색창 고정 */}
            <div className="main-search-box">
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

            {/* 보드게임 목록 */}
            <div className="main-grid">
                {filteredGames.map((game) => {
                    const isSelected = selectedList.find((g) => g.id === game.id);
                    return (
                        <div
                            className={`main-card ${isSelected ? 'selected' : ''}`}
                            key={game.id}
                        >
                            <div
                                className="main-card-image-wrapper"
                                onClick={() => setSelectedGame(game)}
                            >
                                <img
                                    src={game.imageUrl}
                                    alt={game.name}
                                    className="main-card-image"
                                />
                            </div>
                            <div className="main-card-footer">
                                <div className="main-card-title">
                                    {game.name}
                                    {game.tag && <span className={`main-tag ${game.tag.toLowerCase()}`}>{game.tag}</span>}
                                </div>
                                <button className="rent-button" onClick={() => toggleSelect(game)}>
                                    {isSelected ? '선택됨' : '대여하기'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 하단 내비게이션 고정 */}
            <div className="bottom-nav">
                <div className="nav-item active">대여</div>
                <div className="nav-item">순위</div>
                <div className="nav-item">나의 정보</div>
            </div>

            {/* 플로팅 버튼 */}
            <div className="floating-button" onClick={() => setShowRentalModal(true)}>
                {FiShoppingCart as unknown as JSX.Element}
                {selectedList.length > 0 && (
                    <div className="badge">{selectedList.length}</div>
                )}
            </div>

            {/* 상세 모달 */}
            {selectedGame && (
                <GameDetailModal game={selectedGame} onClose={() => setSelectedGame(null)} />
            )}

            {/* 대여 모달 */}
            {showRentalModal && (
                <RentalModal list={selectedList} onClose={() => setShowRentalModal(false)} />
            )}

            {/* 스캐너 */}
            {showScanner && (
                <BarcodeScanner
                    onScan={handleBarcodeScanned}
                    onClose={() => setShowScanner(false)}
                />
            )}

        </div>
    );
}