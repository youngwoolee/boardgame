import ResponseDto from "../response.dto";

export interface ReservationMasterResponseDto {
    id: number;
    userId: string;
    userNickname: string;
    reservedAt: string;
    dueDate: string;
    status: 'RESERVED' | 'RETURNED' | 'CANCELLED';
}

export interface ReservationMasterListResponseDto extends ResponseDto {
    data: ReservationMasterResponseDto[];
}