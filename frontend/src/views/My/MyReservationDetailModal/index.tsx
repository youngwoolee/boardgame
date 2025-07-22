import {
    ReservationDetailDto
} from "../../../apis/response/reservation/reservation-detail.response.dto";
import {useEffect} from "react";
import {FiX} from "react-icons/fi";
import './style.css'

interface Props {
    details: ReservationDetailDto[];
    onClose: () => void;
    onReturn: () => void;
    onCancel: () => void;
    canCancel: boolean;
}

export default function MyReservationDetailModal({ details, onClose, onReturn, onCancel,
                                                     canCancel }: Props) {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const isCompleted = details.every(
        (item) => item.status === 'RETURNED' || item.status === 'CANCELLED'
    );

    return (
        <div className="rental-modal-overlay" onClick={onClose}>
            <div className="rental-modal" onClick={e => e.stopPropagation()}>
                <div className="rental-modal-header">
                    예약 상세
                    <button className="close-button" onClick={onClose}>×</button>
                </div>

                <div className="rental-modal-body">
                    {details.length === 0 ? (
                        <div className="empty">예약된 보드게임이 없습니다.</div>
                    ) : (
                        <ul className="rental-list">
                            {details.map((item) => (
                                <li key={item.id} className="rental-item">
                                    <img src={item.game.imageUrl} alt={item.game.name} />
                                    <div className="detail-info">
                                        <span>{item.game.name}</span>
                                        <span className="barcode">{item.game.barcode}</span>
                                        <span className="status">상태: {item.status}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {!isCompleted && (
                    <div className="rental-modal-footer">
                        {canCancel ? (
                            <div className="action-buttons">
                                <button className="cancel-button" onClick={onCancel}>취소하기</button>
                                <button className="return-button" onClick={onReturn}>반납하기</button>
                            </div>
                        ) : (
                            <button className="return-button full" onClick={onReturn}>반납하기</button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}