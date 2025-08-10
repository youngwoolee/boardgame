package com.project.boardgame.service;

import java.util.List;
import java.util.stream.Collectors;

import com.project.boardgame.common.ResponseCode;
import com.project.boardgame.common.ResponseMessage;
import com.project.boardgame.domain.Member;
import com.project.boardgame.endpoint.response.ResponseDto;
import com.project.boardgame.endpoint.response.admin.AdminUserListResponse;
import com.project.boardgame.endpoint.response.admin.AdminUserResponse;
import com.project.boardgame.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public List<AdminUserResponse> getPendingUsers() {
        List<Member> pendingMembers = userRepository.findAllByRole("ROLE_PENDING");
        List<AdminUserResponse> adminUserResponseList = pendingMembers.stream()
                .map(AdminUserResponse::from)
                .collect(Collectors.toList());
        return adminUserResponseList;
    }

    @Transactional
    public ResponseEntity<ResponseDto> approveUser(Long userId, String role) {
        try {
            Member member = userRepository.findById(userId).orElse(null);
            if (member == null) {
                return ResponseEntity.badRequest()
                        .body(new ResponseDto(ResponseCode.VALIDATION_FAIL, "사용자를 찾을 수 없습니다."));
            }
            
            if (!"ROLE_PENDING".equals(member.getRole())) {
                return ResponseEntity.badRequest()
                        .body(new ResponseDto(ResponseCode.VALIDATION_FAIL, "이미 승인된 사용자입니다."));
            }
            
            // 역할 검증
            if (!"ROLE_USER".equals(role) && !"ROLE_ADMIN".equals(role)) {
                return ResponseEntity.badRequest()
                        .body(new ResponseDto(ResponseCode.VALIDATION_FAIL, "유효하지 않은 역할입니다."));
            }
            
            member.approveUser(role);
            userRepository.save(member);
            
            return ResponseEntity.ok()
                    .body(new ResponseDto(ResponseCode.SUCCESS, "사용자 승인이 완료되었습니다."));
        } catch (Exception exception) {
            log.error("[log] approve user error : {}", exception);
            return ResponseEntity.internalServerError()
                    .body(new ResponseDto(ResponseCode.DATABASE_ERROR, "사용자 승인 중 오류가 발생했습니다."));
        }
    }
}
