package com.project.boardgame.endpoint;

import java.util.HashMap;
import java.util.Map;

import com.project.boardgame.endpoint.request.auth.CheckCertificationRequest;
import com.project.boardgame.endpoint.request.auth.EmailCertificationRequest;
import com.project.boardgame.endpoint.request.auth.IdCheckRequest;
import com.project.boardgame.endpoint.request.auth.SignInRequest;
import com.project.boardgame.endpoint.request.auth.SignUpRequest;
import com.project.boardgame.endpoint.response.ResponseDto;
import com.project.boardgame.endpoint.response.auth.CheckCertificationResponse;
import com.project.boardgame.endpoint.response.auth.EmailCertificationResponse;
import com.project.boardgame.endpoint.response.auth.IdCheckResponse;
import com.project.boardgame.endpoint.response.auth.SignInResponse;
import com.project.boardgame.endpoint.response.auth.SignUpResponse;
import com.project.boardgame.provider.JwtProvider;
import com.project.boardgame.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtProvider jwtProvider;

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

    @PostMapping("/sign-in")
    public ResponseEntity<? super SignInResponse> signIn(@RequestBody @Valid SignInRequest request, HttpServletResponse response) {
        return authService.signIn(request, response);
    }

    @PostMapping("/complete-signup")
    public ResponseEntity<ResponseDto> completeSignup(@RequestBody Map<String, String> body) {
        return authService.completeSignUp(body.get("realName"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshAccessToken(@CookieValue(name = "refreshToken", required = false) String refreshToken) {
        if (refreshToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh Token not found");
        }

        // 1. Refresh Token 검증
        String userId = jwtProvider.validate(refreshToken);
        if (userId == null) {
            // 리프레시 토큰이 유효하지 않으면 401 Unauthorized 응답
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Refresh Token");
        }

        // 2. 새로운 Access Token 생성
        String newAccessToken = jwtProvider.createAccessToken(userId);

        // 3. 새로운 Access Token과 만료 시간을 응답 본문에 담아 전달
        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("accessToken", newAccessToken);
        responseBody.put("expirationTime", 3600); // 1시간 (초 단위)

        return ResponseEntity.ok(responseBody);
    }
}
