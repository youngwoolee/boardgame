import ResponseDto from "../response.dto";
import GameResponseDto from "../game/game.response.dto";

export interface ReservationDetailDto {
    id: number;
    status: 'RESERVED' | 'RETURNED' | 'CANCELLED';
    returnedAt: string | null;
    game: GameResponseDto;
}

export interface ReservationDetailListResponseDto extends ResponseDto {
    data: ReservationDetailDto[];
}