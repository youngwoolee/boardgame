import ResponseDto from "../response.dto";
import GameResponseDto from "./game.response.dto";


export interface GameListResponseDto extends ResponseDto {
    data: GameResponseDto[];
}