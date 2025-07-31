package com.project.boardgame.endpoint;

import java.security.Principal;

import com.project.boardgame.domain.Member;
import com.project.boardgame.endpoint.response.UserResponse;
import com.project.boardgame.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<? super UserResponse> getMyProfile(Principal principal) {
        String userId = principal.getName();
        Member member = userRepository.findByUserId(userId);
        if (member == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        return UserResponse.success(member);
    }
}
