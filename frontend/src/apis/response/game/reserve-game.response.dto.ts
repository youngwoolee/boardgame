import ResponseDto from "../response.dto";

export default interface ReserveGameResponseDto extends ResponseDto {
    id: number;                // 예약 상세 ID
    userId: string;
    nickname: string;
    gameName: string;
    reservedAt: string;        // ISO 날짜 문자열
    dueDate: string;           // ISO 날짜 문자열
    returnedAt: string | null; // 반납일시 (없을 수 있음)
    status: string;            // "예약", "취소", "반납"
    overdue: boolean;          // 연체 여부
}
