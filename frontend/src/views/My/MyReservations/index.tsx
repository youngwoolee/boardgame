import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import {
    ReservationMasterListResponseDto,
    ReservationMasterResponseDto
} from "../../../apis/response/reservation/reservation-master.response.dto";
import {getMyReservationsRequest} from "../../../apis";
import {ResponseCode} from "../../../types/enums";
import {ResponseBody} from "../../../types";
import {GameListResponseDto} from "../../../apis/response/game";
import BottomNavigation from "../../../components/BottomNavigation";
import './style.css'

export default function MyReservations() {
    const [reservations, setReservations] = useState<ReservationMasterResponseDto[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        getMyReservationsRequest().then(handleMyReservationsResponse);
    }, []);

    const handleMyReservationsResponse = (
        responseBody: ResponseBody<ReservationMasterListResponseDto>
    ) => {
        if (!responseBody) return;
        const { code } = responseBody;
        if (code === ResponseCode.DATABASE_ERROR) alert('데이터베이스 오류입니다');
        if (code !== ResponseCode.SUCCESS) return;

        const { data } = responseBody as ReservationMasterListResponseDto;
        setReservations(data);
    };

    return (
        <>
            <div className="my-reservation-wrapper">
                {reservations.length === 0 ? (
                    <p>현재 예약한 보드게임이 없습니다.</p>
                ) : (
                    <div className="reservation-grid">
                        {reservations.map((res) => (
                            <div
                                className="reservation-card"
                                key={res.id}
                                onClick={() => navigate(`/reservations/${res.id}`)}
                            >
                                <div className="reservation-card-content">
                                    <div className="reservation-game-name">{res.gameName}</div>
                                    <div>예약자: {res.nickname}</div>
                                    <div>예약일: {res.reservedAt.split('T')[0]}</div>
                                    <div>반납일: {res.dueDate.split('T')[0]}</div>
                                    <div>상태: {res.status}</div>
                                    {res.overdue && <div className="overdue-text">⚠ 연체됨</div>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}