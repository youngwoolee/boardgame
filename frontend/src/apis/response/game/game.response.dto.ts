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
    genre: string;
    system: string;
    barcode: string;
    available: boolean;
}