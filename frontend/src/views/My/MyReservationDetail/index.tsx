import {useParams} from "react-router-dom";
import {
    ReservationDetailDto, ReservationDetailListResponseDto
} from "../../../apis/response/reservation/reservation-detail.response.dto";
import {useEffect, useState} from "react";
import {getReservationDetailRequest, returnReservationRequest} from "../../../apis";
import {ResponseCode} from "../../../types/enums";
import {ResponseBody} from "../../../types";
import {
    ReservationMasterListResponseDto
} from "../../../apis/response/reservation/reservation-master.response.dto";

export default function MyReservationDetail() {
    const { reservationId } = useParams();
    const [details, setDetails] = useState<ReservationDetailDto[]>([]);

    useEffect(() => {
        if (!reservationId) return;
        getReservationDetailRequest(parseInt(reservationId)).then(handleReservationDetailResponse);
    }, [reservationId]);

    // ✅ 응답 핸들러 함수 분리
    const handleReservationDetailResponse = (
        responseBody: ResponseBody<ReservationDetailListResponseDto>
    ) => {
        if (!responseBody) return;
        const { code } = responseBody;
        if( code === ResponseCode.DATABASE_ERROR) alert('데이터베이스 오류입니다');
        if( code !== ResponseCode.SUCCESS) return;

        const {data} = responseBody as ReservationDetailListResponseDto;

        setDetails(data);
    };

    const onReturnHandler = async () => {
        const confirmed = window.confirm('이 예약의 모든 게임을 반납하시겠습니까?');
        if (!confirmed || !reservationId) return;

        const response = await returnReservationRequest(parseInt(reservationId));
        if (!response) {
            alert('서버 응답이 없습니다.');
            return;
        }

        const { code } = response;

        if (code === ResponseCode.DATABASE_ERROR) {
            alert('데이터베이스 오류입니다.');
            return;
        }

        if (code !== ResponseCode.SUCCESS) {
            alert('반납에 실패했습니다.');
            return;
        }

        alert('반납 완료되었습니다.');
        window.location.reload();
    };

    return (
        <div className="reservation-detail-wrapper">
            <h2>예약 상세</h2>
            <ul className="game-list">
                {details.map((item) => (
                    <li key={item.id}>
                        <img src={item.game.imageUrl} alt={item.game.name} />
                        <div>{item.game.name}</div>
                        <div>상태: {item.status}</div>
                    </li>
                ))}
            </ul>
            <button onClick={onReturnHandler} className="primary-button">반납하기</button>
        </div>
    );
}