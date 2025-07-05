package com.project.boardgame.service;

import java.util.Map;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;


@Service
@RequiredArgsConstructor
public class KakaoOAuthService {

    private final WebClient webClient = WebClient.builder().baseUrl("https://kapi.kakao.com").build();

    public String getKakaoId(String accessToken) {
        Map<String, Object> response = webClient.get()
                .uri("/v2/user/me")
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        return String.valueOf(response.get("id"));
    }

    public String getKakaoNickname(String accessToken) {
        Map<String, Object> response = webClient.get()
                .uri("/v2/user/me")
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        Map<String, Object> properties = (Map<String, Object>) response.get("properties");
        return (String) properties.get("nickname");
    }
}

