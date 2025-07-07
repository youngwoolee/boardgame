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
        String oauthClientName = userRequest.getClientRegistration()
                .getClientName();

//        try{
//            System.out.println(new ObjectMapper().writeValueAsString(oAuth2User.getAttributes()));
//
//        }catch(Exception exception) {
//            exception.printStackTrace();
//        }

        Member member = null;
        String userId = null;
        String email = "email@email.com";

        if(oauthClientName.equals("kakao")){
            userId = "kakao_" + oAuth2User.getAttributes().get("id");
            member = new Member(userId, email, "kakao");
        }

        if(oauthClientName.equals("naver")) {
            Map<String, String> responseMap = (Map<String, String>) oAuth2User.getAttributes()
                    .get("response");
            userId = "naver_" + responseMap.get("id")
                    .substring(0, 14);
            email = responseMap.get("email");
            member = new Member(userId, email, "naver");
        }
        userRepository.save(member);

        return new CustomOAuth2User(userId);
    }
}
