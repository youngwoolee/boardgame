import React from 'react';
import './style.css';
import {reserveGamesRequest} from "../../../apis";
import ReserveGameRequestDto from "../../../apis/request/game/reserve-game.request.dto";
import ReserveGameResponseDto from "../../../apis/response/game/reserve-game.response.dto";
import {ResponseBody} from "../../../types";
import {ResponseCode} from "../../../types/enums";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {SignInResponseDto} from "../../../apis/response/auth";


interface SelectedGame {
    id: number;
    barcode: string;
    name: string;
    imageUrl: string;
}

interface Props {
    list: SelectedGame[];
    onClose: () => void;
    onRented: () => void;  // 대여 후 selectedList 초기화를 위한 콜백
}

export default function RentalModal({ list, onClose, onRented }: Props) {
    const navigate = useNavigate();

    const copyRentalMessage = (data: ReserveGameResponseDto) => {
        const gameNames = data.gameNames.join(', ');
        const rentalDate = data.reservedAt.split('T')[0];
        const dueDate = data.dueDate.split('T')[0];

        const message = `
🔔 [보드게임 대여 알림]

 - 게임명: ${gameNames}
 - 대여자: ${data.nickname}
 - 대여일: ${rentalDate}
 - 반납예정일: ${dueDate}
        `.trim();

        navigator.clipboard.writeText(message)
            .then(() => {
                console.log("알림 메시지가 복사되었습니다. 카카오톡에서 붙여넣어 보내세요!");
            })
            .catch((err) => {
                console.error("클립보드 복사 실패:", err);
            });
    };

    const reserveGameResponse = (responseBody: ResponseBody<ReserveGameResponseDto>) => {
        if(!responseBody) return;
        const { code, message} = responseBody;
        if( code === ResponseCode.DATABASE_ERROR) alert('데이터베이스 오류입니다');
        if( code === ResponseCode.ALREADY_RESERVATION) alert(message);
        if( code !== ResponseCode.SUCCESS) return;

        const data = responseBody as ReserveGameResponseDto;

        copyRentalMessage(data); // ✅ 복사 메시지 추가
        toast.success('대여가 완료되었습니다. 알림 복사 완료!');
        setTimeout(() => {
            onRented();     // 선택 목록 초기화
            onClose();      // 모달 닫기
            window.location.reload();
        }, 1000);
    };

    const handleSubmit = async () => {
        if (list.length === 0) {
            toast.warn('대여할 보드게임이 없습니다.');
            return;
        }

        const barcodes = list.map((game) => game.barcode);

        const requestBody: ReserveGameRequestDto = {barcodes};
        console.log(requestBody);
        reserveGamesRequest(requestBody).then(reserveGameResponse);
    };

    return (
        <div className="rental-modal-overlay" onClick={onClose}>
            <div className="rental-modal" onClick={(e) => e.stopPropagation()}>
                <div className="rental-modal-header">
                    대여 목록
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <div className="rental-modal-body">
                    {list.length === 0 ? (
                        <div className="empty">선택한 보드게임이 없습니다.</div>
                    ) : (
                        <ul className="rental-list">
                            {list.map((game) => (
                                <li className="rental-item" key={game.barcode}>
                                    <img src={game.imageUrl} alt={game.name} />
                                    <span>{game.name}</span>
                                    <span className="barcode">{game.barcode}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="rental-modal-footer">
                    <button className="rent-submit-button" onClick={handleSubmit}>
                        대여하기 ({list.length}개)
                    </button>
                </div>
            </div>
        </div>
    );
}

