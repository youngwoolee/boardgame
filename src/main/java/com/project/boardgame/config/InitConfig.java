package com.project.boardgame.config;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import com.project.boardgame.domain.Game;
import com.project.boardgame.domain.Genre;
import com.project.boardgame.domain.SystemType;
import com.project.boardgame.repository.GameRepository;
import com.project.boardgame.repository.GenreRepository;
import com.project.boardgame.repository.SystemTypeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;


@Profile("local")
@Configuration
public class InitConfig {

    @Bean
    CommandLineRunner init(GameRepository gameRepository, GenreRepository genreRepository, SystemTypeRepository systemTypeRepository) {
        return args -> {

            List<String> genreNames = Arrays.asList("전략", "파티", "가족게임", "추리", "협력", "경쟁", "심리전", "퍼즐", "카드게임", "어린이", "교육", "블러핑", "협상", "팀플레이");
            genreNames.forEach(name -> {
                if (genreRepository.findByName(name).isEmpty()) {
                    genreRepository.save(new Genre(name));
                }
            });

            List<String> systemTypeNames = Arrays.asList("셋컬렉션", "정체은닉", "트릭테이킹", "카드드래프트", "타일배치", "노선연결", "주사위굴리기", "자원관리", "협력플레이", "액션포인트", "핸드관리", "주사위조합", "타일조합", "질문추론", "블러핑눈치", "토론", "반응속도", "관찰력", "순발력", "예측", "자산관리");
            systemTypeNames.forEach(name -> {
                if (systemTypeRepository.findByName(name).isEmpty()) {
                    systemTypeRepository.save(new SystemType(name));
                }
            });

            List<Game> games = new ArrayList<>();

            games.addAll(createGames("스플렌더", "보석 상인이 되어 보석을 수집하고, 카드와 귀족을 구매해 점수를 얻는 전략형 보드게임입니다.",
                                     "https://raw.githubusercontent.com/youngwoolee/boardgame-image/main/images/b56fa977-695e-47b1-9d5b-f861663f152a.webp", "hot", 2, 4,  4, 10, 30, 30,2.0,
                                     Arrays.asList("전략"), Arrays.asList("셋컬렉션", "카드드래프트"), "SPLEND", 1, genreRepository, systemTypeRepository));

            games.addAll(createGames("아발론", "아발론은 선과 악의 세력이 대결하는 정체 은닉 기반의 심리전 게임입니다.",
                                     "https://raw.githubusercontent.com/youngwoolee/boardgame-image/main/images/3405d1e3-f9c3-4469-b5dc-020efcfb8c4b.webp", "new", 5, 10, 6, 14, 30, 60, 3.1,
                                     Arrays.asList("추리", "심리전", "파티"), Arrays.asList("정체은닉", "토론"), "AVALON", 5, genreRepository, systemTypeRepository));

            games.addAll(createGames("티켓 투 라이드", "미국 전역의 기차 노선을 연결하며 점수를 얻는 게임입니다.",
                                     "https://raw.githubusercontent.com/youngwoolee/boardgame-image/main/images/e069910f-33ce-4a10-8a56-780d9bc92a52.webp", "new", 2, 5, 4, 8, 30, 60, 2.5,
                                     Arrays.asList("가족게임", "전략"), Arrays.asList("노선연결", "셋컬렉션"), "TTRIDE", 2, genreRepository, systemTypeRepository));

            games.addAll(createGames("도블", "카드에 그려진 그림을 빠르게 매칭하는 게임입니다.",
                                     "https://raw.githubusercontent.com/youngwoolee/boardgame-image/main/images/f31fbb2d-6e43-468b-97ef-b378fe8b9005.png", null, 2, 8,6, 6, 15, 15, 3.0,
                                     Arrays.asList("파티"), Arrays.asList("반응속도", "관찰력"), "DOBBLE", 4, genreRepository, systemTypeRepository));

            games.addAll(createGames("한밤의 늑대인간", "정체를 숨기고 토론을 통해 적을 찾아내는 정체 은닉 게임입니다.",
                                     "https://raw.githubusercontent.com/youngwoolee/boardgame-image/main/images/aa3b8d2b-c9f7-4a03-a983-c459e8f25302.png", "new", 3, 10, 6,10, 10, 15, 4.0,
                                     Arrays.asList("파티"), Arrays.asList("정체은닉", "토론"), "WEREWO", 4, genreRepository, systemTypeRepository));

            games.addAll(createGames("스컬킹", "카드를 예측해 베팅하고 점수를 얻는 트릭테이킹 카드 게임입니다.",
                                     "https://raw.githubusercontent.com/youngwoolee/boardgame-image/main/images/ef27caf3-c84f-42f3-89a4-5d14d1cbc3fa.jpeg", null, 2, 6, 4, 10, 30, 30, 1.0,
                                     Arrays.asList("카드게임"), Arrays.asList("트릭테이킹", "예측"), "SKULLK", 2, genreRepository, systemTypeRepository));

            games.addAll(createGames("사보타지", "광부와 사보타지 팀이 대결하는 협력 및 방해 게임입니다.",
                                     "https://raw.githubusercontent.com/youngwoolee/boardgame-image/main/images/01d7d24a-b7d9-43a4-8a90-ea85fbe93e87.jpeg", "hot", 3, 10, 8, 8, 30, 30, 4.5,
                                     Arrays.asList("전략", "팀플레이"), Arrays.asList("협력플레이", "정체은닉"), "SABOTA", 3, genreRepository, systemTypeRepository));

            gameRepository.saveAll(games);
        };
    }

    private List<Game> createGames(String name, String description, String imageUrl, String tag,
                                   int minPlayers, int maxPlayers, int bestPlayers, int age, int minPlayTime, int maxPlayTime,
                                   double weight, List<String> genreNames, List<String> systemNames,
                                   String baseBarcode, int quantity, GenreRepository genreRepository, SystemTypeRepository systemTypeRepository) {

        Set<Genre> genres = genreNames.stream()
                .map(genreName -> genreRepository.findByName(genreName)
                        .orElseThrow(() -> new RuntimeException("존재하지 않는 장르: " + genreName)))
                .collect(Collectors.toSet());

        Set<SystemType> systems = systemNames.stream()
                .map(systemName -> systemTypeRepository.findByName(systemName)
                        .orElseThrow(() -> new RuntimeException("존재하지 않는 시스템: " + systemName)))
                .collect(Collectors.toSet());

        List<Game> result = new ArrayList<>();
        IntStream.rangeClosed(1, quantity).forEach(i -> {
            result.add(Game.builder()
                               .name(name)
                               .description(description)
                               .imageUrl(imageUrl)
                               .tag(tag)
                               .minPlayers(minPlayers)
                               .maxPlayers(maxPlayers)
                               .bestPlayers(bestPlayers)
                               .age(age)
                               .minPlayTime(minPlayTime)
                               .maxPlayTime(maxPlayTime)
                               .weight(weight)
                               .genres(genres)
                               .systems(systems)
                               .barcode(baseBarcode + String.format("-%02d", i))
                               .build());
        });

        return result;
    }
}
