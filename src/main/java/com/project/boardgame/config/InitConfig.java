package com.project.boardgame.config;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.IntStream;

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
            List<Game> games = new ArrayList<>();

            games.addAll(createGames("스플렌더", "보석 상인이 되어 보석을 수집하고, 카드와 귀족을 구매해 점수를 얻는 전략형 보드게임입니다.",
                                     "/assets/스플렌더.webp", "hot", "2~4명", "만 10세+", "30분 내외",
                                     "전략 게임", "셋 컬렉션, 카드 구매", "SPLEND", 1));

            games.addAll(createGames("아발론", "아발론은 선과 악의 세력이 대결하는 정체 은닉 기반의 심리전 게임입니다.",
                                     "/assets/아발론.webp", "new", "5~10명", "만 14세+", "30~60분",
                                     "추리, 팀플레이", "정체 은닉, 토론", "AVALON", 5));

            games.addAll(createGames("티켓 투 라이드", "미국 전역의 기차 노선을 연결하며 점수를 얻는 게임입니다.",
                                     "/assets/티켓 투 라이드.webp", "new", "2~5명", "만 8세+", "30~60분",
                                     "가족 게임", "노선 연결, 셋 컬렉션", "TTRIDE", 2));

            games.addAll(createGames("도블", "카드에 그려진 그림을 빠르게 매칭하는 게임입니다.",
                                     "/assets/dobble.jpg", null, "2~8명", "만 6세+", "15분 내외",
                                     "파티 게임", "반응 속도, 관찰력", "DOBBLE", 4));

            games.addAll(createGames("루미큐브", "숫자 타일을 이용해 조합을 만드는 전략 퍼즐 게임입니다.",
                                     "/assets/rummikub.jpg", "hot", "2~4명", "만 7세+", "30분 내외",
                                     "전략, 퍼즐", "타일 조합, 순발력", "RUMIKU", 3));

            games.addAll(createGames("한밤의 늑대인간", "정체를 숨기고 토론을 통해 적을 찾아내는 정체 은닉 게임입니다.",
                                     "/assets/werewolf.jpg", "new", "3~10명", "만 10세+", "10~15분",
                                     "파티 게임", "정체 은닉, 토론", "WEREWO", 4));

            games.addAll(createGames("스컬킹", "카드를 예측해 베팅하고 점수를 얻는 트릭테이킹 카드 게임입니다.",
                                     "/assets/skullking.jpg", null, "2~6명", "만 10세+", "30분 내외",
                                     "카드 게임", "트릭테이킹, 예측", "SKULLK", 2));

            games.addAll(createGames("사보타지", "광부와 사보타지 팀이 대결하는 협력 및 방해 게임입니다.",
                                     "/assets/sabotage.jpg", "hot", "3~10명", "만 8세+", "30분 내외",
                                     "전략, 팀플레이", "협력, 정체 숨기기", "SABOTA", 3));

            games.addAll(createGames("부루마블", "부동산 거래로 자산을 모아 경쟁하는 전통 보드게임입니다.",
                                     "/assets/blue-marble.jpg", null, "2~6명", "만 6세+", "60분 이상",
                                     "가족 게임", "자산 운영, 주사위", "BLUMAR", 5));

            games.addAll(createGames("스파이폴", "한 명의 스파이를 찾기 위한 질문 게임입니다.",
                                     "/assets/spyfall.jpg", "new", "3~8명", "만 12세+", "10~15분",
                                     "추리, 파티", "정체 은닉, 질문", "SPYFAL", 3));

            gameRepository.saveAll(games);
        };
    }


    private List<Game> createGames(String name, String description, String imageUrl, String tag,
                                   String players, String age, String time, String genre,
                                   String system, String baseBarcode, int quantity) {
        List<Game> result = new ArrayList<>();
        IntStream.rangeClosed(1, quantity).forEach(i -> {
            result.add(Game.builder()
                               .name(name)
                               .description(description)
                               .imageUrl(imageUrl)
                               .tag(tag)
                               .players(players)
                               .age(age)
                               .time(time)
                               .genre(genre)
                               .system(system)
                               .barcode(baseBarcode + String.format("-%02d", i))
                               .build());
        });
        return result;
    }
}
