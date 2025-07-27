import React from 'react';
import './style.css';
import {reserveGamesRequest} from "../../../apis";
import ReserveGameRequestDto from "../../../apis/request/game/reserve-game.request.dto";
import ReserveGameResponseDto from "../../../apis/response/game/reserve-game.response.dto";
import {ResponseBody} from "../../../types";
import {ResponseCode} from "../../../types/enums";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";


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
    const reserveGameResponse = (responseBody: ResponseBody<ReserveGameResponseDto>) => {
        if(!responseBody) return;
        const { code, message } = responseBody;
        if( code === ResponseCode.DATABASE_ERROR) alert('데이터베이스 오류입니다');
        if( code === ResponseCode.ALREADY_RESERVATION) alert(message);
        if( code !== ResponseCode.SUCCESS) return;

        toast.success('대여가 완료되었습니다.');
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
                    <button className="close-button" onClick={onClose}>×</button>
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

