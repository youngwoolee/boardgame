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
        if( code === ResponseCode.DATABASE_ERROR) alert('데이터베이스 오류입니다');
        if( code !== ResponseCode.SUCCESS) return;

        const {data} = responseBody as ReservationMasterListResponseDto;


        setReservations(data);
    };

    return (
        <div className="my-reservation-wrapper">
            <h2>나의 예약 목록</h2>
            {reservations.length === 0 && <p>현재 예약된 보드게임이 없습니다.</p>}
            <ul className="reservation-list">
                {reservations.map((res) => (
                    <li key={res.id} onClick={() => navigate(`/reservations/${res.id}`)}>
                        <div>예약자: {res.userNickname}</div>
                        <div>예약일: {res.reservedAt}</div>
                        <div>상태: {res.status}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
}