package com.project.boardgame.endpoint.response.admin;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

import com.project.boardgame.domain.Game;
import com.project.boardgame.domain.Genre;
import com.project.boardgame.domain.Member;
import com.project.boardgame.domain.SystemType;
import com.project.boardgame.endpoint.response.GameResponse;
import com.project.boardgame.endpoint.response.ResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;


@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserResponse {
    private Long id;
    private String userId;
    private String name;
    private String email;
    private String type;
    private String role;
    private LocalDateTime createdAt;

    public static AdminUserResponse from(Member member) {
        return AdminUserResponse.builder()
                .id(member.getId())
                .userId(member.getUserId())
                .name(member.getName())
                .email(member.getEmail())
                .type(member.getType())
                .role(member.getRole())
                .createdAt(member.getCreatedAt())
                .build();
    }
}
