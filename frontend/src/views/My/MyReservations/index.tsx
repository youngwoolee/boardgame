import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import {
    ReservationMasterListResponseDto,
    ReservationMasterResponseDto
} from "../../../apis/response/reservation/reservation-master.response.dto";
import {
    cancelReservationRequest,
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
import {formatDate} from "../../../utils/date";
import {ClipLoader} from "react-spinners";
import { toast } from 'react-toastify';

export default function MyReservations() {
    const [reservations, setReservations] = useState<ReservationMasterResponseDto[]>([]);
    const navigate = useNavigate();
    const [selectedReservationId, setSelectedReservationId] = useState<number | null>(null);
    const [selectedReservationDetails, setSelectedReservationDetails] = useState<ReservationDetailDto[] | null>(null);
    const [selectedReservationDate, setSelectedReservationDate] = useState<string | null>(null);
    type ReservationFilter = 'ALL' | 'RESERVED' | 'RETURNED' | 'CANCELLED';
    const [filter, setFilter] = useState<ReservationFilter>('RESERVED');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true); // 데이터 요청 시작 시 로딩 상태로 설정
        getMyReservationsRequest()
            .then(handleMyReservationsResponse)
            .finally(() => {
                setLoading(false); // 요청 완료 시 (성공/실패 무관) 로딩 상태 해제
            });
    }, []);

    const filteredReservations = reservations
        .filter((res) => {
            if (filter === 'ALL') return true;
            return res.status === filter;
        })
        .sort((a, b) => new Date(b.reservedAt).getTime() - new Date(a.reservedAt).getTime());

    // 예약 날짜가 오늘이면 true
    const isTodayReservation = (() => {
        if (!selectedReservationDate) return false;

        const today = new Date();
        const reservedDate = new Date(selectedReservationDate);

        return (
            reservedDate.getFullYear() === today.getFullYear() &&
            reservedDate.getMonth() === today.getMonth() &&
            reservedDate.getDate() === today.getDate()
        );
    })();



    const generateReturnMessage = (details: ReservationDetailDto[] | null) => {
        if(!details) return;

        const gameNames = details.map((item) => item.game.name).join(', ');
        const today = new Date().toISOString().split('T')[0];

        return `
📦 [보드게임 반납 알림]

 - 게임명: ${gameNames}
 - 반납일: ${today}
  `.trim();
    };


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

        const matchedReservation = reservations.find(r => r.id === reservationId);
        if (matchedReservation) {
            setSelectedReservationDate(matchedReservation.reservedAt);
        }

        setSelectedReservationDetails(data);
    };

    const handleReturn = async () => {
        if (!selectedReservationId) return;

        const confirmed = window.confirm("이 예약의 모든 게임을 반납하시겠습니까?");
        if (!confirmed) return;

        //TODO: 반납 API호출 복사하고싶지만 실패
        const message = generateReturnMessage(selectedReservationDetails);
        if (message) {
            try {
                await navigator.clipboard.writeText(message);
                toast.success("반납 메시지 복사 완료!");
            } catch (e) {
                toast.error("복사 실패 😥");
                console.error(e);
            }
        }

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

        toast.success("반납이 완료되었습니다.");
        await getMyReservationsRequest().then(handleMyReservationsResponse);
        setSelectedReservationDetails(null);

    };

    if (loading) {
        return (
            <div className="loading-indicator">
                <ClipLoader color="#007bff" loading={loading} cssOverride={{
                    borderWidth: '5px'
                }} size={40} />
            </div>
        );
    }


    const handleCancel = async () => {
        if (!selectedReservationId) return;

        const confirmed = window.confirm("정말로 이 예약을 취소하시겠습니까?");
        if (!confirmed) return;

        const response = await cancelReservationRequest(selectedReservationId);
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
            alert("예약 취소에 실패했습니다.");
            return;
        }

        toast.success("예약이 취소되었습니다.");

        // 새로고침
        getMyReservationsRequest().then(handleMyReservationsResponse);
        setSelectedReservationDetails(null);
    };

    return (
        <>
            <div className="my-reservation-wrapper">
                <div className="reservation-filter-tabs-wrapper">
                    <div className="reservation-filter-tabs">
                        {['ALL', 'RESERVED', 'RETURNED', 'CANCELLED'].map((type) => (
                            <button
                                key={type}
                                className={`filter-tab ${filter === type ? 'active' : ''}`}
                                onClick={() => setFilter(type as ReservationFilter)}
                            >
                                {type === 'ALL' && '전체'}
                                {type === 'RESERVED' && '예약됨'}
                                {type === 'RETURNED' && '반납 완료'}
                                {type === 'CANCELLED' && '취소됨'}
                            </button>
                        ))}
                    </div>
                </div>
                {filteredReservations.length === 0 ? (
                    <div className="reservations-no-results">
                        <p>현재 조건에 맞는 예약이 없습니다.</p>
                    </div>
                ) : (
                    <div className="reservation-grid">
                        {filteredReservations.map((res) => (
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
                                    <div className="reservation-bottom-info">
                                        <div className="reservation-info-row">
                                            <span className="reservation-label">예약일:</span>
                                            <span>{formatDate(res.reservedAt.split('T')[0])}</span>
                                        </div>
                                        {res.status === 'RETURNED' ? (
                                            <div className="reservation-info-row">
                                                <span className="reservation-label">반납일:</span>
                                                <span>{formatDate(res.returnedAt?.split('T')[0])}</span>
                                            </div>
                                        ) : (
                                            <div className="reservation-info-row due">
                                                <span className="reservation-label">반납 예정일:</span>
                                                <span>{formatDate(res.dueDate.split('T')[0])}</span>
                                            </div>
                                        )}
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
                            setSelectedReservationId(null);
                            setSelectedReservationDetails(null);
                        }}
                        onReturn={handleReturn}
                        onCancel={handleCancel}
                        canCancel={isTodayReservation}
                    />
                )}
            </div>
        </>
    );
}
