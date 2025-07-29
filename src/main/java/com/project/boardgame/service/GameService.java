package com.project.boardgame.service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import com.project.boardgame.domain.Game;
import com.project.boardgame.domain.Genre;
import com.project.boardgame.domain.ReservationDetail;
import com.project.boardgame.domain.ReservationStatus;
import com.project.boardgame.domain.SystemType;
import com.project.boardgame.endpoint.request.GameRequest;
import com.project.boardgame.endpoint.request.GameUploadRequest;
import com.project.boardgame.endpoint.response.GameDetailResponse;
import com.project.boardgame.endpoint.response.GameReservationResponse;
import com.project.boardgame.endpoint.response.GameResponse;
import com.project.boardgame.repository.GameRepository;
import com.project.boardgame.repository.GenreRepository;
import com.project.boardgame.repository.ReservationDetailRepository;
import com.project.boardgame.repository.SystemTypeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
@Slf4j
public class GameService {
    private final GameRepository gameRepository;
    private final GenreRepository genreRepository;
    private final SystemTypeRepository systemTypeRepository;
    private final ReservationDetailRepository reservationDetailRepository;

    public List<Game> getAvailableGames() {
//        return gameRepository.findAll().stream()
//                .filter(game -> reservationDetailRepository.countByGameAndStatus(game, ReservationStatus.예약) < game.getTotalQuantity())
//                .collect(Collectors.toList());
        return Collections.emptyList();
    }

    @CacheEvict(value = "games", allEntries = true)
    public GameResponse addGame(GameRequest request) {
        Game game = Game.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();
        Game saveGame = gameRepository.save(game);
        return GameResponse.from(saveGame);
    }

    public void createGame(GameUploadRequest dto, String imageUrl) {
        log.info("[log] createGame : {}, {}", dto.toString(), imageUrl);
        Set<Genre> genres = dto.getGenres().stream()
                .map(name -> genreRepository.findByName(name)
                        .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 장르입니다: " + name)))
                .collect(Collectors.toSet());

        log.info("[log] createGame : {}", genres);
        // ✅ 이름으로 SystemType 엔티티 조회
        Set<SystemType> systems = dto.getSystems().stream()
                .map(name -> systemTypeRepository.findByName(name)
                        .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 시스템입니다: " + name)))
                .collect(Collectors.toSet());
        log.info("[log] createGame : {}", systems);
        Game game = Game.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .minPlayers(dto.getMinPlayers())
                .maxPlayers(dto.getMaxPlayers())
                .age(dto.getAge())
                .time(dto.getTime())
                .genres(genres)
                .systems(systems)
                .barcode(dto.getBarcode())
                .imageUrl(imageUrl)
                .build();

        gameRepository.save(game);
    }

    @Cacheable(value = "games")
    public List<GameResponse> getAllGames() {
        log.info("[log] fetching games from DB");
        List<Game> games = gameRepository.findAllFetchJoin();

        Set<Long> reservedGameIds = reservationDetailRepository.findReservedGameIdsByGameIn(games);

        return games.stream()
                .map(game -> {
                    boolean isReserved = reservedGameIds.contains(game.getId());
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
        List<Game> games = gameRepository.findAllFetchJoin();
        List<GameDetailResponse> response = games.stream()
                .map(GameDetailResponse::from)
                .collect(Collectors.toList());
        return response;
    }
}
