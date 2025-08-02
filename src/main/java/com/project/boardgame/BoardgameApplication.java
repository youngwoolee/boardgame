package com.project.boardgame;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;


@EnableCaching
@EnableJpaAuditing
@SpringBootApplication
public class BoardgameApplication {

    public static void main(String[] args) {
        String profile = System.getProperty("spring.profiles.active");

        if ("local".equals(profile)) {
            Dotenv dotenv = Dotenv.load();
            System.setProperty("GMAIL_USERNAME", dotenv.get("GMAIL_USERNAME"));
            System.setProperty("GMAIL_PASSWORD", dotenv.get("GMAIL_PASSWORD"));
            System.setProperty("KAKAO_CLIENT_ID", dotenv.get("KAKAO_CLIENT_ID"));
            System.setProperty("KAKAO_CLIENT_SECRET", dotenv.get("KAKAO_CLIENT_SECRET"));
            System.setProperty("SECRET_KEY", dotenv.get("SECRET_KEY"));
            System.setProperty("GITHUB_TOKEN", dotenv.get("GITHUB_TOKEN"));
            System.setProperty("DB_URL", dotenv.get("DB_URL"));
            System.setProperty("DB_USERNAME", dotenv.get("DB_USERNAME"));
            System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));
            System.setProperty("FRONTEND_URL", dotenv.get("FRONTEND_URL"));
            System.setProperty("OPENAI_API_KEY", dotenv.get("OPENAI_API_KEY"));
        }

        SpringApplication.run(BoardgameApplication.class, args);
    }

}
