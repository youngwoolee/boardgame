package com.project.boardgame.service;

import java.util.Optional;

import com.project.boardgame.common.CertificationNumber;
import com.project.boardgame.common.ResponseCode;
import com.project.boardgame.domain.Certification;
import com.project.boardgame.domain.Member;
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
import com.project.boardgame.provider.EmailProvider;
import com.project.boardgame.provider.JwtProvider;
import com.project.boardgame.repository.CertificationRepository;
import com.project.boardgame.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final EmailProvider emailProvider;
    private final JwtProvider jwtProvider;
    private final CertificationRepository certificationRepository;
    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public ResponseEntity<? super IdCheckResponse> idCheck(IdCheckRequest request) {
        try {

            String userId= request.getId();
            boolean isExistId = userRepository.existsByUserId(userId);
            if(isExistId) return IdCheckResponse.duplicateId();

        } catch(Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }

        return IdCheckResponse.success();
    }

    public ResponseEntity<? super EmailCertificationResponse> emailCertification(EmailCertificationRequest request) {
        try {
            String userId = request.getId();
            String email = request.getEmail();

            boolean isExistId = userRepository.existsByUserId(userId);
            if(isExistId) return IdCheckResponse.duplicateId();

            String certificationNumber = CertificationNumber.getCertificationNumber();
            boolean isSuccess = emailProvider.sendCertificationMail(email, certificationNumber);
            if(!isSuccess) return EmailCertificationResponse.mailSendFail();

            Certification certification = Certification.builder()
                    .userId(userId)
                    .email(email)
                    .certificationNumber(certificationNumber).build();
            certificationRepository.save(certification);

        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return EmailCertificationResponse.success();
    }

    public ResponseEntity<? super CheckCertificationResponse> checkCertification(CheckCertificationRequest request) {
        try {
            String userId = request.getId();
            String email = request.getEmail();
            String certificationNumber = request.getCertificationNumber();

            Certification certification = certificationRepository.findByUserId(userId);
            if(certification == null) return CheckCertificationResponse.certificationFail();

            boolean isMatched = certification.getEmail().equals(email) && certification.getCertificationNumber().equals(certificationNumber);
            if(!isMatched) return CheckCertificationResponse.certificationFail();

        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return CheckCertificationResponse.success();
    }


    public ResponseEntity<? super SignUpResponse> signUp(SignUpRequest request) {
        try {
            String userId = request.getId();

            boolean isExistId = userRepository.existsByUserId(userId);
            if(isExistId) return SignUpResponse.duplicateId();

            String email = request.getEmail();
            String certificationNumber = request.getCertificationNumber();

            Certification certification = certificationRepository.findByUserId(userId);

            boolean isMatched = certification.getEmail().equals(email) &&
                    certification.getCertificationNumber().equals(certificationNumber);
            if(!isMatched) return SignUpResponse.certificationFail();

            String password = request.getPassword();
            String encodedPassword = passwordEncoder.encode(password);
            request.setPassword(encodedPassword);

            Member member = new Member(request);
            userRepository.save(member);

            certificationRepository.deleteByUserId(userId);

        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return SignUpResponse.success();
    }

    public ResponseEntity<? super SignInResponse> signIn(SignInRequest request) {
        String token = null;
        try {

            String userId = request.getId();

            Member member = userRepository.findByUserId(userId);
            if(member == null) return SignInResponse.signInFail();

            String password = request.getPassword();
            String encodedPassword = member.getPassword();

            boolean isMatched = passwordEncoder.matches(password, encodedPassword);
            if(!isMatched) return SignInResponse.signInFail();

            token = jwtProvider.create(userId);

        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return SignInResponse.success(token);
    }

    @Transactional
    public ResponseEntity<ResponseDto> completeSignUp(String realName) {
        try {
            Authentication authentication = SecurityContextHolder.getContext()
                    .getAuthentication();
            String userId = (String) authentication.getPrincipal(); // 또는 UserDetails 캐스팅 방식

            Member member = userRepository.findByUserId(userId);
            if (member == null) return ResponseDto.validationFail();

            member.setRealName(realName);
            member.setRegistered(true); // 가입 완료

            return ResponseEntity.ok()
                    .body(new ResponseDto(ResponseCode.SUCCESS, "가입 완료"));
        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
    }
}
