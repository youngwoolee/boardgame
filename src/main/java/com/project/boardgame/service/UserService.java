package com.project.boardgame.service;

import java.util.List;
import java.util.stream.Collectors;

import com.project.boardgame.domain.Member;
import com.project.boardgame.endpoint.response.admin.AdminUserListResponse;
import com.project.boardgame.endpoint.response.admin.AdminUserResponse;
import com.project.boardgame.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;


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

}
