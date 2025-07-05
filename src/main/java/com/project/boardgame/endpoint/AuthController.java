package com.project.boardgame.endpoint;

import com.project.boardgame.endpoint.request.auth.CheckCertificationRequest;
import com.project.boardgame.endpoint.request.auth.EmailCertificationRequest;
import com.project.boardgame.endpoint.request.auth.IdCheckRequest;
import com.project.boardgame.endpoint.request.auth.SignUpRequest;
import com.project.boardgame.endpoint.response.auth.CheckCertificationResponse;
import com.project.boardgame.endpoint.response.auth.EmailCertificationResponse;
import com.project.boardgame.endpoint.response.auth.IdCheckResponse;
import com.project.boardgame.endpoint.response.auth.SignUpResponse;
import com.project.boardgame.repository.UserRepository;
import com.project.boardgame.service.AuthService;
import com.project.boardgame.service.KakaoOAuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/id-check")
    public ResponseEntity<? super IdCheckResponse> idCheck(@RequestBody @Valid IdCheckRequest request) {
        ResponseEntity<? super IdCheckResponse> response = authService.idCheck(request);
        return response;
    }

    @PostMapping("/email-certification")
    public ResponseEntity<? super EmailCertificationResponse> emailCertification(@RequestBody @Valid EmailCertificationRequest request) {
        ResponseEntity<? super EmailCertificationResponse> response = authService.emailCertification(request);
        return response;
    }

    @PostMapping("/check-certification")
    public ResponseEntity<? super CheckCertificationResponse> checkCertification(@RequestBody @Valid CheckCertificationRequest request) {
        ResponseEntity<? super CheckCertificationResponse> response = authService.checkCertification(request);
        return response;
    }

    @PostMapping("/sign-up")
    public ResponseEntity<? super SignUpResponse> signUp(@RequestBody @Valid SignUpRequest request) {
        ResponseEntity<? super SignUpResponse> response = authService.signUp(request);
        return response;
    }
}
