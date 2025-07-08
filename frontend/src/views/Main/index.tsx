import React, {JSX, useState} from 'react';
import './style.css';
import { FiSearch } from 'react-icons/fi';


const dummyGames = [
    { id: 1, name: '아발론', imageUrl: '/assets/아발론.webp', tag: 'new'},
    { id: 2, name: '스플렌더', imageUrl: '/assets/스플렌더.webp', tag: 'hot'},
    { id: 3, name: '티켓 투 라이드', imageUrl: '/assets/티켓 투 라이드.webp', tag: 'new'},
    { id: 4, name: '도블', imageUrl: '/assets/dobble.jpg', tag: null},
    { id: 5, name: '모자가 아니잖아', imageUrl: '/assets/dobble.jpg', tag: null},
    { id: 6, name: '언락1', imageUrl: '/assets/dobble.jpg', tag: null},
    { id: 7, name: '언락2', imageUrl: '/assets/dobble.jpg', tag: null},
    { id: 8, name: '언락2', imageUrl: '/assets/dobble.jpg', tag: null},
    { id: 9, name: '사보타지', imageUrl: '/assets/dobble.jpg', tag: null},
    { id: 10, name: '뱅', imageUrl: '/assets/dobble.jpg', tag: null},
];

export default function Main() {
    const [search, setSearch] = useState('');

    const filteredGames = dummyGames.filter((game) =>
        game.name.toLowerCase().includes(search.toLowerCase())
    );

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
            </div>

            {/* 보드게임 목록 */}
            <div className="main-grid">
                {filteredGames.map((game) => (
                    <div className="main-card" key={game.id}>
                        <img src={game.imageUrl} alt={game.name} className="main-card-image" />
                        <div className="main-card-title">
                            <span>{game.name}</span>
                            {game.tag && <span className={`main-tag ${game.tag.toLowerCase()}`}>{game.tag}</span>}
                        </div>
                    </div>
                ))}
            </div>

            {/* 하단 내비게이션 고정 */}
            <div className="bottom-nav">
                <div className="nav-item active">대여</div>
                <div className="nav-item">순위</div>
                <div className="nav-item">나의 정보</div>
            </div>
        </div>
    );
}