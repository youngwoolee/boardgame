package com.project.boardgame.service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

import com.project.boardgame.endpoint.response.admin.GeneratedGameInfoResponse;
import com.project.boardgame.service.dto.GeneratedGameDto;
import lombok.RequiredArgsConstructor;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;


@Service
@RequiredArgsConstructor
public class AiService {

    private final ChatClient openAiChatClient;

    public GeneratedGameDto generate(String text) {
        String systemContent = "당신은 보드게임 전문가 AI입니다. 사용자가 보드게임 이름을 제공하면, 해당 게임의 상세 정보를 JSON 형식으로 출력해야 합니다. 응답은 반드시 한국어로 작성하세요.";

        String userContent = "보드게임 이름 '" + text + "'의 상세 정보를 분석하여 아래 JSON 형식에 맞춰 응답하세요.\n" +
                "description: 1~5문장 요약. minPlayers: 최소 인원(숫자). maxPlayers: 최대 인원(숫자). age: 권장 연령('10'처럼 숫자만). time: 플레이 시간('30'처럼 숫자만). " +
                "genres: ['전략', '파티', '가족게임', '추리', '협력', '경쟁', '심리전', '퍼즐', '카드게임', '어린이', '교육', '블러핑', '협상', '팀플레이'] 중에서 2~3개 선택. " +
                "systems: ['셋컬렉션', '정체은닉', '트릭테이킹', '카드드래프트', '타일배치', '노선연결', '주사위굴리기', '자원관리', '협력플레이', '액션포인트', '핸드관리', '주사위조합', '타일조합', '질문추론', '블러핑눈치'] 중에서 2~3개 선택.";


        SystemMessage systemMessage = new SystemMessage(systemContent);
        UserMessage userMessage = new UserMessage(userContent);
        AssistantMessage assistantMessage = new AssistantMessage("");

        OpenAiChatOptions options = OpenAiChatOptions.builder()
                .model("gpt-4.1-mini")
                .temperature(0.7)
                .build();

        Prompt prompt = new Prompt(List.of(systemMessage, userMessage, assistantMessage), options);

        GeneratedGameDto result = openAiChatClient.prompt(prompt).call().entity(GeneratedGameDto.class);

        String imageUrl = fetchBoardGameImageUrl(text);
        result.setImageUrl(imageUrl);

        return result;
    }

    private String fetchBoardGameImageUrl(String gameName) {
        try {
            // 1. 검색 페이지 접속
            String searchUrl = "https://boardgamegeek.com/search/boardgame?q=" + URLEncoder.encode(gameName, StandardCharsets.UTF_8);
            Document searchDoc = Jsoup.connect(searchUrl)
                    .userAgent("Mozilla/5.0")
                    .get();

            // 2. 첫 번째 검색 결과 링크 추출
            Element firstLink = searchDoc.selectFirst("a.primary");
            if (firstLink == null) return null;

            String detailPageUrl = "https://boardgamegeek.com" + firstLink.attr("href");

            // 3. 상세 페이지 접속
            Document detailDoc = Jsoup.connect(detailPageUrl)
                    .userAgent("Mozilla/5.0")
                    .get();

            // 4. preload 이미지 태그 전체 수집
            Elements preloadLinks = detailDoc.select("link[rel=preload][as=image]");

            if (!preloadLinks.isEmpty()) {
                if (preloadLinks.size() >= 2) {
                    return preloadLinks.get(1).attr("href");
                } else {
                    return preloadLinks.get(0).attr("href");
                }
            }

        } catch (Exception e) {
            System.err.println("썸네일 추출 실패: " + e.getMessage());
        }

        return null;
    }

    public Mono<GeneratedGameInfoResponse> generateGameInfo(String boardGameName) {
        return Mono.empty();
    }


}
