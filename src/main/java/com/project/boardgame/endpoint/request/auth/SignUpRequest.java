package com.project.boardgame.endpoint.request.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
public class SignUpRequest {

    @NotBlank
    private String id;

    @NotBlank
    private String password;

    @NotBlank
    private String realName;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String certificationNumber;
}
