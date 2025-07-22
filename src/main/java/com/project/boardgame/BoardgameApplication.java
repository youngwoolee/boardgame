package com.project.boardgame;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication
public class BoardgameApplication {

    public static void main(String[] args) {
        String profile = System.getProperty("spring.profiles.active");

        if ("local".equals(profile)) {
            Dotenv dotenv = Dotenv.load();
            System.setProperty("GITHUB_TOKEN", dotenv.get("GITHUB_TOKEN"));
        }

        SpringApplication.run(BoardgameApplication.class, args);
    }

}
