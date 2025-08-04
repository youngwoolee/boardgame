import ResponseDto from "../response.dto";

export default interface AdminGameResponseDto extends ResponseDto {
    id: number;
    name: string;
    description: string;
    totalQuantity: number;
    imageUrl: string;
    tag: string | null;
    minPlayers: number;
    maxPlayers: number;
    bestPlayers: number;
    age: number;
    minPlayTime: number;
    maxPlayTime: number;
    weight: number;
    genres: string[];
    systems: string[];
    barcode: string;
    available: boolean;
}