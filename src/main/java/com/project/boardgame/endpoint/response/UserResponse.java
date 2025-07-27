package com.project.boardgame.endpoint.response;

import com.project.boardgame.domain.Member;
import lombok.AllArgsConstructor;
import lombok.Getter;


@Getter
@AllArgsConstructor
public class UserResponse extends ResponseDto{
    private String userId;
    private String name;
    private String email;

    public static UserResponse from(Member member) {
        return new UserResponse(member.getUserId(), member.getName(), member.getEmail());
    }
}
