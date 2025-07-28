export default interface UploadRequestDto {
    name: string;
    description: string;
    minPlayers: number;
    maxPlayers: number;
    age: number;
    time: number;
    genres: string[];
    systems: string[];
    barcode: string;
    imageUrl: string;
}