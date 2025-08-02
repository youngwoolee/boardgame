export default interface UploadRequestDto {
    name: string;
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
    quantity: number;
}