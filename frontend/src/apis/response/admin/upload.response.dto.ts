import ResponseDto from "../response.dto";

export default interface UploadResponseDto extends ResponseDto {
    url: string;
}