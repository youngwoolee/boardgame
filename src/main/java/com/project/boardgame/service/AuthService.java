package com.project.boardgame.service;

import java.util.Optional;

import com.project.boardgame.common.CertificationNumber;
import com.project.boardgame.domain.Certification;
import com.project.boardgame.domain.Member;
import com.project.boardgame.endpoint.request.auth.CheckCertificationRequest;
import com.project.boardgame.endpoint.request.auth.EmailCertificationRequest;
import com.project.boardgame.endpoint.request.auth.IdCheckRequest;
import com.project.boardgame.endpoint.request.auth.SignUpRequest;
import com.project.boardgame.endpoint.response.ResponseDto;
import com.project.boardgame.endpoint.response.auth.CheckCertificationResponse;
import com.project.boardgame.endpoint.response.auth.EmailCertificationResponse;
import com.project.boardgame.endpoint.response.auth.IdCheckResponse;
import com.project.boardgame.endpoint.response.auth.SignUpResponse;
import com.project.boardgame.provider.EmailProvider;
import com.project.boardgame.repository.CertificationRepository;
import com.project.boardgame.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final EmailProvider emailProvider;
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

            Certification certification = new Certification(userId, email, certificationNumber);
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
}
