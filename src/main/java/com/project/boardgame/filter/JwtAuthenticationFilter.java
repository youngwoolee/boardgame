package com.project.boardgame.filter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;

import com.project.boardgame.domain.Member;
import com.project.boardgame.provider.JwtProvider;
import com.project.boardgame.repository.UserRepository;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;


@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;
    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            String token = parseBearerToken(request);
            if(token == null) {
                log.warn("[log] Missing token");
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Missing token");
                return;
            }

            Claims claims = jwtProvider.validate(token);
            if(claims == null) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token validation failed");
                return;
            }

            String userId = claims.getSubject();
            String role = claims.get("role", String.class); // Get role from claims

            if (userId == null || role == null) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token content");
                return;
            }

            if ("ROLE_PENDING".equals(role)) {
                String requestPath = request.getRequestURI();
                if (!"/api/v1/auth/complete-signup".equals(requestPath)) {
                    log.warn("Access denied for PENDING user '{}' attempting to access '{}'", userId, requestPath);
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401 에러 반환
                    response.setContentType("application/json");
                    response.getWriter().write("{\"code\": \"NA\", \"message\": \"Not Approved.\"}");
                    return;
                }
            }

            List<GrantedAuthority> authorities = new ArrayList<>();
            authorities.add(new SimpleGrantedAuthority(role));

            SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
            AbstractAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userId, null, authorities);
            authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            securityContext.setAuthentication(authenticationToken);
            SecurityContextHolder.setContext(securityContext);

        }catch (Exception exception) {
            log.error("[log] exception : {}", exception.getMessage());
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authentication error");
            return;
        }
        filterChain.doFilter(request, response);
    }

    private String parseBearerToken(HttpServletRequest request) {
        String authorization = request.getHeader("Authorization");
        boolean hasAuthorization = StringUtils.hasText(authorization);
        if(!hasAuthorization) return null;

        boolean isBearer = authorization.startsWith("Bearer");
        if(!isBearer) return null;

        String token = authorization.substring(7);
        return token;


    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        String[] excludedPaths = {
                "/h2-console/**",
                "/api/v1/admin/cache/evict-all",
                "/api/v1/auth/id-check",
                "/api/v1/auth/email-certification",
                "/api/v1/auth/check-certification",
                "/api/v1/auth/sign-up",
                "/api/v1/auth/sign-in"
        };

        for (String excludedPath : excludedPaths) {
            if (pathMatcher.match(excludedPath, path)) {
                return true;
            }
        }

        return false;
    }
}
