package com.project.boardgame.endpoint.response;

import com.project.boardgame.domain.Member;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;


@Getter
@AllArgsConstructor
public class UserResponse extends ResponseDto{
    private String userId;
    private String name;
    private String email;

    public UserResponse(Member member) {
        super();
        this.userId = member.getUserId();
        this.name = member.getName();
        this.email= member.getEmail();
    }

    public static ResponseEntity<UserResponse> success(Member member) {
        UserResponse responseBody = new UserResponse(member);
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }
}
