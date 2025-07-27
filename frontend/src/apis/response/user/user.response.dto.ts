import ResponseDto from "../response.dto";

export default interface UserResponseDto extends ResponseDto {

    userId: string;
    name: number;
    email: number;
}