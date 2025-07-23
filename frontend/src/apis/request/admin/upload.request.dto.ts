export default interface UploadRequestDto {
    name: string;
    description: string;
    imageUrl: string;
    minPlayers: number;
    maxPlayers: number;
    age: string;
    time: string;
    genres: string[];
    systems: string[];
    barcode: string;
}