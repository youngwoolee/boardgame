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
}

export default function MyReservationDetailModal({ details, onClose, onReturn }: Props) {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

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

                <div className="rental-modal-footer">
                    <button className="rent-submit-button" onClick={onReturn}>반납하기</button>
                </div>
            </div>
        </div>
    );
}