import ResponseDto from "../response.dto";

export interface ReservationMasterResponseDto {
    id: number;
    userId: string;
    nickname: string;              // ✅ userNickname → nickname 으로 변경
    gameName: string;              // ✅ 추가: 게임 이름 요약 (e.g. "도블 외 1개")
    reservedAt: string;
    dueDate: string;
    returnedAt: string | null;     // ✅ 추가: 반납일 (nullable)
    status: 'RESERVED' | 'RETURNED' | 'CANCELLED';
    overdue: boolean;              // ✅ 추가: 연체 여부
}

export interface ReservationMasterListResponseDto extends ResponseDto {
    data: ReservationMasterResponseDto[];
}