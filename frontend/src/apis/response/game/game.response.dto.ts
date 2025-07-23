export default interface GameResponseDto {
    id: number;
    name: string;
    description: string;
    totalQuantity: number;
    imageUrl: string;
    tag: string | null;
    minPlayers: number;
    maxPlayers: number;
    age: string;
    time: string;
    genres: string[];
    systems: string[];
    barcode: string;
    available: boolean;
}