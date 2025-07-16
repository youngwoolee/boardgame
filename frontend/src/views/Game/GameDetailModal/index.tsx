import React, {JSX, useEffect } from 'react';
import './index.css';
import {
    FiUsers,
    FiHeart,
    FiClock,
    FiTag,
    FiSettings
} from 'react-icons/fi';

type Game = {
    id: number;
    name: string;
    imageUrl: string;
    tag?: string | null;
    minPlayers?: number;
    maxPlayers?: number;
    age?: string;
    time?: string;
    genre?: string;
    system?: string;
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

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <span>{game.name}</span>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    <div className="modal-info">
                        <img src={game.imageUrl} alt={game.name} className="modal-thumbnail" />
                        <div className="modal-attributes">
                            <div className="attribute">
                                <FiUsers className='icon' />
                                <div>
                                    <div className="label">인원</div>
                                    <div className="value">
                                        {game.minPlayers && game.maxPlayers
                                            ? game.minPlayers === game.maxPlayers
                                                ? `${game.minPlayers}명`
                                                : `${game.minPlayers} ~ ${game.maxPlayers}명`
                                            : '정보 없음'}
                                    </div>
                                </div>
                            </div>
                            <div className="attribute">
                                <FiHeart className='icon' />

                                <div>
                                    <div className="label">연령</div>
                                    <div className="value">{game.age}</div>
                                </div>
                            </div>
                            <div className="attribute">
                                <FiClock className='icon' />
                                <div>
                                    <div className="label">소요시간</div>
                                    <div className="value">{game.time}</div>
                                </div>
                            </div>
                            <div className="attribute">
                                <FiTag className='icon' />
                                <div>
                                    <div className="label">장르</div>
                                    <div className="value">{game.genre}</div>
                                </div>
                            </div>
                            <div className="attribute">
                                <FiSettings className='icon' />
                                <div>
                                    <div className="label">시스템</div>
                                    <div className="value">{game.system}</div>
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
