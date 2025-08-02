import ResponseDto from "../response.dto";

export default interface GeneratedGameInfoResponseDto extends ResponseDto {
    description: string;
    minPlayers: number;
    maxPlayers: number;
    bestPlayers: number;
    age: number;
    minPlayTime: number;
    maxPlayTime: number;
    weight: number;
    genres: string[];
    systems: string[];
    imageUrl: string;
}