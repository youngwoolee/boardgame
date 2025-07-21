package com.project.boardgame.service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.project.boardgame.domain.Game;
import com.project.boardgame.domain.ReservationDetail;
import com.project.boardgame.domain.ReservationStatus;
import com.project.boardgame.endpoint.request.GameRequest;
import com.project.boardgame.endpoint.response.GameDetailResponse;
import com.project.boardgame.endpoint.response.GameReservationResponse;
import com.project.boardgame.endpoint.response.GameResponse;
import com.project.boardgame.repository.GameRepository;
import com.project.boardgame.repository.ReservationDetailRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class GameService {
    private final GameRepository gameRepository;
    private final ReservationDetailRepository reservationDetailRepository;

    public List<Game> getAvailableGames() {
//        return gameRepository.findAll().stream()
//                .filter(game -> reservationDetailRepository.countByGameAndStatus(game, ReservationStatus.예약) < game.getTotalQuantity())
//                .collect(Collectors.toList());
        return Collections.emptyList();
    }

    public GameResponse addGame(GameRequest request) {
        Game game = Game.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();
        Game saveGame = gameRepository.save(game);
        return GameResponse.from(saveGame);
    }

    public List<GameResponse> getAllGames() {
        List<Game> games = gameRepository.findAll();
        return games.stream()
                .map(game -> {
                    boolean isReserved = reservationDetailRepository.existsByGameAndStatus(game, ReservationStatus.RESERVED);
                    boolean isAvailable = !isReserved;
                    return GameResponse.from(game, isAvailable);
                })
                .collect(Collectors.toList());
    }

    public GameReservationResponse getReserveInfo(Long id) {
        Game findGame = gameRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 게임이 없습니다."));

        Optional<ReservationDetail> findReservation = reservationDetailRepository
                .findFirstByGameAndStatus(findGame, ReservationStatus.RESERVED);

        if (findReservation.isPresent()) {
            ReservationDetail reservation = findReservation.get();
            return GameReservationResponse.builder()
                    .userId(reservation.getMaster().getUserId())
                    .userName(reservation.getMaster().getUserNickname())
                    .build();
        }

        return GameReservationResponse.empty();
    }

    @Transactional
    public GameResponse updateGame(Long id, GameRequest request) {
        Game game = gameRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 게임이 존재하지 않습니다."));

        game.setName(request.getName());
        game.setDescription(request.getDescription());

        return GameResponse.from(game);
    }

    public List<GameDetailResponse> getAllGamesDetail() {
        List<Game> games = gameRepository.findAll();
        List<GameDetailResponse> response = games.stream()
                .map(GameDetailResponse::from)
                .collect(Collectors.toList());
        return response;
    }
}
