package com.project.boardgame.domain;

import com.project.boardgame.endpoint.request.auth.SignUpRequest;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
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
public class Member extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String userId;

    private String name;
    private String password;
    private String email;
    private String type;
    private String role;

    boolean isRegistered;

    public Member(SignUpRequest request) {
        this.userId = request.getId();
        this.password = request.getPassword();
        this.email = request.getEmail();
        this.name = request.getRealName();
        this.type = "app";
        this.role = "ROLE_PENDING";
    }

    public Member(String userId, String email, String type) {
        this.userId = userId;
        this.password = "Passw0rd";
        this.email = email;
        this.type = type;
        this.role = "ROLE_USER";
    }

    public void setRealName(String realName) {
        this.name = realName;
    }

    public void setRegistered(boolean registered) {
        this.isRegistered = registered;
    }
}
