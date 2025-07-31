package com.project.boardgame.endpoint;

import java.util.List;

import com.project.boardgame.endpoint.response.GameListResponse;
import com.project.boardgame.endpoint.response.GameResponse;
import com.project.boardgame.service.GameService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/v1/games")
@RequiredArgsConstructor
public class GameController {
    private final GameService gameService;

    @GetMapping
    public ResponseEntity<? super GameListResponse> getAllGames() {
        List<GameResponse> games = gameService.getAllGames();
        return GameListResponse.success(games);
    }

}
