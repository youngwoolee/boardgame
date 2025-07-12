package com.project.boardgame.domain;

import com.project.boardgame.endpoint.request.auth.SignUpRequest;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Member {
    @Id
    private String userId;
    private String name;
    private String password;
    private String email;
    private String type;
    private String role;

    public Member(SignUpRequest request) {
        this.userId = request.getId();
        this.password = request.getPassword();
        this.email = request.getEmail();
        this.type = "app";
        this.role = "ROLE_USER";

    }

    public Member(String userId, String email, String type) {
        this.userId = userId;
        this.password = "Passw0rd";
        this.email = email;
        this.type = type;
        this.role = "ROLE_USER";
    }
}
