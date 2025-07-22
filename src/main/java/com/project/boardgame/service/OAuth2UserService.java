package com.project.boardgame.service;

import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.boardgame.domain.CustomOAuth2User;
import com.project.boardgame.domain.Member;
import com.project.boardgame.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class OAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        String oauthClientName = userRequest.getClientRegistration().getClientName();

        String userId = null;
        String email = null;

        if (oauthClientName.equals("kakao")) {
            userId = "kakao_" + oAuth2User.getAttributes().get("id");
            email = "dummy@email.com"; // Kakao email 비공개일 수 있음
        }

        Member member = userRepository.findByUserId(userId);

        // ✅ 이미 등록된 회원이면 그대로 리턴
        if (member != null && member.isRegistered()) {
            return new CustomOAuth2User(userId, true); // registered=true
        }

        // ✅ 신규 사용자면 임시 객체 리턴
        if (member == null) {
            member = Member.builder().userId(userId).email(email).type(oauthClientName).isRegistered(false)
                    .role("ROLE_ADMIN").build(); // isRegistered=false
            userRepository.save(member); // 임시로 저장
        }

        return new CustomOAuth2User(userId, false); // registered=false
    }
}
