package com.project.boardgame.endpoint;

import java.util.List;
import java.util.Map;

import com.project.boardgame.domain.Game;
import com.project.boardgame.endpoint.request.GameRequest;
import com.project.boardgame.endpoint.response.GameDetailResponse;
import com.project.boardgame.endpoint.response.GameReservationResponse;
import com.project.boardgame.endpoint.response.GameResponse;
import com.project.boardgame.service.GameService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/games")
@RequiredArgsConstructor
public class GameController {
    private final GameService gameService;

    @GetMapping
    public ResponseEntity<List<GameResponse>> getAllGames() {
        List<GameResponse> games = gameService.getAllGames();
        return ResponseEntity.ok(games);
    }

    @GetMapping("/detail")
    public ResponseEntity<List<GameDetailResponse>> getAllGameDetail() {
        List<GameDetailResponse> games = gameService.getAllGamesDetail();
        return ResponseEntity.ok(games);
    }

    @PostMapping
    public ResponseEntity<GameResponse> addGame(@RequestBody GameRequest request) {
        GameResponse response = gameService.addGame(request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<GameResponse> updateGame(@PathVariable Long id, @RequestBody GameRequest request) {
        GameResponse updateGame = gameService.updateGame(id, request);
        return ResponseEntity.ok(updateGame);
    }

    @GetMapping("/available")
    public ResponseEntity<?> getOnlyAvailableGames() {
        List<Game> availableGames = gameService.getAvailableGames();
        return ResponseEntity.ok(availableGames);
    }

    @GetMapping("/{id}/reserve")
    public ResponseEntity<?> getReserveInfo(@PathVariable Long id) {
        GameReservationResponse reserveInfo = gameService.getReserveInfo(id);
        return ResponseEntity.ok(reserveInfo);
    }
}
