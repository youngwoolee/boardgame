package com.project.boardgame.config;

import java.util.List;

import com.project.boardgame.domain.Game;
import com.project.boardgame.repository.GameRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class InitConfig {

    @Bean
    CommandLineRunner init(GameRepository gameRepository) {
        return args -> {
            gameRepository.saveAll(List.of(
                    new Game(null, "스플렌더", "보석 거래 게임", 1),
                    new Game(null, "아발론", "정체 추리 게임", 2),
                    new Game(null, "티켓 투 라이드", "철도 연결 게임", 1)
            ));
        };
    }
}
