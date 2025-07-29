package com.project.boardgame.domain;

import java.util.Collection;
import java.util.Collections;
import java.util.Map;

import com.project.boardgame.service.OAuth2UserService;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class CustomOAuth2User implements OAuth2User {

    private String userId;
    private boolean isRegistered;
    private String role;

    @Override
    public Map<String, Object> getAttributes() {
        return Collections.emptyMap();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.emptyList();
    }


    @Override
    public String getName() {
        return this.userId;
    }
}
