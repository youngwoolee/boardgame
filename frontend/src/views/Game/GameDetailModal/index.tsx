import React, {JSX, useEffect } from 'react';
import './style.css';
import {
    FiUsers,
    FiHeart,
    FiClock,
    FiTag,
    FiSettings, FiStar, FiTrendingUp,
    FiHash
} from 'react-icons/fi';

type Game = {
    id: number;
    name: string;
    imageUrl: string;
    barcodes?: Array<{barcode: string; available: boolean}>;
    available?: boolean;  // 대여 가능 여부
    tag?: string | null;
    minPlayers?: number;
    maxPlayers?: number;
    bestPlayers?: number;
    age?: number;
    minPlayTime?: number;
    maxPlayTime?: number;
    weight?: number;
    genres?: string[];
    systems?: string[];
    description?: string;
};

type Props = {
    game: Game;
    onClose: () => void;
};


export default function GameDetailModal({ game, onClose }: Props) {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const formatPlayTime = (min?: number, max?: number) => {
        if (!min || !max) return '정보 없음';
        if (min === max) return `${min}분 이내`;
        return `${min} ~ ${max}분`;
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <span>{game.name}</span>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    <div className="modal-info">
                        <img src={game.imageUrl} alt={game.name}
                             className="modal-thumbnail"
                             onError={(e) => {
                                 e.currentTarget.style.display = 'none';
                             }}/>
                        <div className="modal-attributes">
                            <div className="attribute barcode-attribute">
                                <FiHash className='icon' />
                                <div>
                                    <div className="label">
                                        바코드
                                        {game.barcodes && game.barcodes.some(b => !b.available) && (
                                            <span className="rented-status"> (일부 대여중)</span>
                                        )}
                                    </div>
                                    <div className="value">
                                        {game.barcodes && game.barcodes.length > 0 ? (
                                            <div className="barcode-list">
                                                {game.barcodes.map((barcodeInfo, index) => (
                                                    <span 
                                                        key={index} 
                                                        className={`barcode-item ${!barcodeInfo.available ? 'rented' : ''}`}
                                                    >
                                                        {barcodeInfo.barcode}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            '정보 없음'
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="attribute">
                                <FiUsers className='icon' />
                                <div>
                                    <div className="label">인원</div>
                                    <div className="value">
                                        {game.minPlayers && game.maxPlayers
                                            ? `${game.minPlayers} ~ ${game.maxPlayers}명`
                                            : '정보 없음'}
                                    </div>
                                </div>
                            </div>
                            <div className="attribute">
                                <FiStar className='icon' />
                                <div>
                                    <div className="label">베스트 인원</div>
                                    <div className="value">{game.bestPlayers ? `${game.bestPlayers}명` : '정보 없음'}</div>
                                </div>
                            </div>
                            <div className="attribute">
                                <FiHeart className='icon' />
                                <div>
                                    <div className="label">연령</div>
                                    <div className="value">만 {game.age}세 이상</div>
                                </div>
                            </div>
                            <div className="attribute">
                                <FiClock className='icon' />
                                <div>
                                    <div className="label">소요시간</div>
                                    <div className="value">{formatPlayTime(game.minPlayTime, game.maxPlayTime)}</div>
                                </div>
                            </div>
                            <div className="attribute">
                                <FiTrendingUp className='icon' />
                                <div>
                                    <div className="label">난이도</div>
                                    <div className="value">{game.weight ? `${game.weight.toFixed(1)} / 5.0` : '정보 없음'}</div>
                                </div>
                            </div>
                            <div className="attribute">
                                <FiTag className='icon' />
                                <div>
                                    <div className="label">장르</div>
                                    <div className="value">{game.genres?.length ? game.genres.join(', ') : '정보 없음'}</div>
                                </div>
                            </div>
                            <div className="attribute">
                                <FiSettings className='icon' />
                                <div>
                                    <div className="label">시스템</div>
                                    <div className="value">{game.systems?.length ? game.systems.join(', ') : '정보 없음'}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal-description">
                        {game.description || '이 보드게임은 다양한 인원과 함께 즐길 수 있는 게임입니다. 게임 설명은 여기에 표시됩니다.'}
                    </div>
                </div>
            </div>
        </div>
    );
}

