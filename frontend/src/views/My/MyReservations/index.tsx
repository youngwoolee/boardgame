import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import {
    ReservationMasterListResponseDto,
    ReservationMasterResponseDto
} from "../../../apis/response/reservation/reservation-master.response.dto";
import {
    getMyReservationsRequest,
    getReservationDetailRequest,
    returnReservationRequest
} from "../../../apis";
import {ResponseCode} from "../../../types/enums";
import {ResponseBody} from "../../../types";
import {GameListResponseDto} from "../../../apis/response/game";
import BottomNavigation from "../../../components/BottomNavigation";
import './style.css'
import MyReservationDetailModal from "../MyReservationDetailModal";
import {
    ReservationDetailDto, ReservationDetailListResponseDto
} from "../../../apis/response/reservation/reservation-detail.response.dto";

export default function MyReservations() {
    const [reservations, setReservations] = useState<ReservationMasterResponseDto[]>([]);
    const navigate = useNavigate();
    const [selectedReservationId, setSelectedReservationId] = useState<number | null>(null);
    const [selectedReservationDetails, setSelectedReservationDetails] = useState<ReservationDetailDto[] | null>(null);

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

    const fetchReservationDetails = async (reservationId: number) => {
        const response = await getReservationDetailRequest(reservationId);
        if (!response) return;

        const { code } = response;
        if (code === ResponseCode.DATABASE_ERROR) {
            alert("데이터베이스 오류입니다.");
            return;
        }
        if (code !== ResponseCode.SUCCESS) return;

        const {data} = response as ReservationDetailListResponseDto;


        setSelectedReservationDetails(data);
    };

    const handleReturn = async () => {
        if (!selectedReservationId) return;

        const confirmed = window.confirm("이 예약의 모든 게임을 반납하시겠습니까?");
        if (!confirmed) return;

        const response = await returnReservationRequest(selectedReservationId);
        if (!response) {
            alert("서버 응답이 없습니다.");
            return;
        }

        const { code } = response;

        if (code === ResponseCode.DATABASE_ERROR) {
            alert("데이터베이스 오류입니다.");
            return;
        }

        if (code !== ResponseCode.SUCCESS) {
            alert("반납에 실패했습니다.");
            return;
        }

        alert("반납이 완료되었습니다.");

        // 새로고침
        getMyReservationsRequest().then(handleMyReservationsResponse);
        setSelectedReservationDetails(null);
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
                                onClick={() => {
                                    setSelectedReservationId(res.id);
                                    fetchReservationDetails(res.id);
                                }}
                            >
                                <div className="reservation-card-content">
                                    <div className="reservation-status-badge" data-status={res.status}>
                                        {res.status === 'RESERVED' && '예약됨'}
                                        {res.status === 'RETURNED' && '반납 완료'}
                                        {res.status === 'CANCELLED' && '취소됨'}
                                    </div>
                                    <div className="reservation-game-name">{res.gameName}</div>
                                    <div className="reservation-info-row">
                                        <span className="reservation-label">예약일:</span>
                                        <span>{res.reservedAt.split('T')[0]}</span>
                                    </div>
                                    <div className="reservation-info-row due">
                                        <span className="reservation-label">반납 예정일:</span>
                                        <span>{res.dueDate.split('T')[0]}</span>
                                    </div>
                                    {res.overdue && <div className="overdue-text">⚠ 연체됨</div>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {selectedReservationDetails && (
                    <MyReservationDetailModal
                        details={selectedReservationDetails}
                        onClose={() => {
                            setSelectedReservationId(null); // <- 추가
                            setSelectedReservationDetails(null);
                        }}
                        onReturn={handleReturn}
                    />
                )}
            </div>
        </>
    );
}
