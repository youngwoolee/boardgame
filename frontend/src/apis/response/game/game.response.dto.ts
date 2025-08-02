export default interface GameResponseDto {
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
    time: number;
    minPlayTime: number;
    maxPlayTime: number;
    weight: number;
    genres: string[];
    systems: string[];
    barcode: string;
    available: boolean;
}