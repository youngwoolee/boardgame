package com.project.boardgame.endpoint.response.admin;

import java.util.List;

import com.project.boardgame.endpoint.response.ResponseDto;
import com.project.boardgame.endpoint.response.UserResponse;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;


@Builder
@Getter
@NoArgsConstructor
public class AdminUserListResponse extends ResponseDto {
    private List<AdminUserResponse> data;

    @Builder
    public AdminUserListResponse(List<AdminUserResponse> data) {
        super();
        this.data = data;
    }

    public static ResponseEntity<AdminUserListResponse> success(List<AdminUserResponse> data) {
        AdminUserListResponse responseBody = new AdminUserListResponse(data);
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }
}
