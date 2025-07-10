import React from 'react';
import './index.css';


type Game = {
    id: number;
    name: string;
    imageUrl: string;
};

type Props = {
    list: Game[];
    onClose: () => void;
};

export default function RentalModal({ list, onClose }: Props) {
    return (
        <div className="rental-modal-overlay" onClick={onClose}>
            <div className="rental-modal" onClick={(e) => e.stopPropagation()}>
                <div className="rental-modal-header">
                    대여 목록
                    <button className="close-button" onClick={onClose}>×</button>
                </div>

                <div className="rental-modal-body">
                    {list.length === 0 ? (
                        <div className="empty">선택한 보드게임이 없습니다.</div>
                    ) : (
                        <ul className="rental-list">
                            {list.map((game) => (
                                <li className="rental-item" key={game.id}>
                                    <img src={game.imageUrl} alt={game.name} />
                                    <span>{game.name}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="rental-modal-footer">
                    <button className="rent-submit-button">
                        대여하기 ({list.length}개)
                    </button>
                </div>
            </div>
        </div>
    );
}

