import ResponseDto from "../response.dto";
import { AdminUserResponseDto } from './admin-user.response.dto';

export default interface AdminUserListResponseDto extends ResponseDto {
    data: AdminUserResponseDto[];
}
