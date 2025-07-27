import ResponseDto from "../response.dto";

export default interface GeneratedGameInfoResponseDto extends ResponseDto {
    description: string;
    minPlayers: number;
    maxPlayers: number;
    age: number;
    time: number;
    genres: string[];
    systems: string[];
}