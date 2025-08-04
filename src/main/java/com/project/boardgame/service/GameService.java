package com.project.boardgame.service;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.NoSuchElementException;
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
import com.project.boardgame.endpoint.response.ResponseDto;
import com.project.boardgame.endpoint.response.admin.AdminGameResponse;
import com.project.boardgame.provider.BarcodeGenerator;
import com.project.boardgame.repository.GameRepository;
import com.project.boardgame.repository.GenreRepository;
import com.project.boardgame.repository.ReservationDetailRepository;
import com.project.boardgame.repository.SystemTypeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;


@Service
@RequiredArgsConstructor
@Slf4j
public class GameService {
    private final GameRepository gameRepository;
    private final GenreRepository genreRepository;
    private final SystemTypeRepository systemTypeRepository;
    private final ReservationDetailRepository reservationDetailRepository;
    private final BarcodeGenerator barcodeGenerator;
    private final ImageService imageService;

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

    @CacheEvict(value = "games", allEntries = true)
    public void createGame(GameUploadRequest dto, String imageUrl) {
        log.info("[log] createGame : {}, {}", dto.toString(), imageUrl);
        Set<Genre> genres = dto.getGenres().stream()
                .map(name -> genreRepository.findByName(name)
                        .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 장르입니다: " + name)))
                .collect(Collectors.toSet());

        log.info("[log] createGame : {}", genres);
        //이름으로 SystemType 엔티티 조회
        Set<SystemType> systems = dto.getSystems().stream()
                .map(name -> systemTypeRepository.findByName(name)
                        .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 시스템입니다: " + name)))
                .collect(Collectors.toSet());
        log.info("[log] createGame : {}", systems);

        List<String> barcodes = barcodeGenerator.generateUniqueBarcodes(dto.getQuantity());

        for (String barcode : barcodes) {
            Game game = Game.builder()
                            .name(dto.getName())
                            .description(dto.getDescription())
                            .minPlayers(dto.getMinPlayers())
                            .maxPlayers(dto.getMaxPlayers())
                            .age(dto.getAge())
                            .bestPlayers(dto.getBestPlayers())
                            .minPlayTime(dto.getMinPlayTime())
                            .maxPlayTime(dto.getMaxPlayTime())
                            .weight(Math.round(dto.getWeight() * 10.0) / 10.0)
                            .genres(genres)
                            .systems(systems)
                            .barcode(barcode)
                            .imageUrl(imageUrl)
                            .build();

            gameRepository.save(game);
        }
    }

    @Cacheable(value = "games")
    public List<Game> getAllGamesRaw() {
        log.info("[log] fetching games from DB");
        return gameRepository.findAllFetchJoin();
    }

    public List<GameResponse> getAllGames() {
        List<Game> games = getAllGamesRaw();

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
    @CacheEvict(value = "games", allEntries = true)
    public String updateGame(String barcode, GameUploadRequest dto, MultipartFile image) throws Exception {
        Game game = gameRepository.findByBarcode(barcode)
                .orElseThrow(() -> new NoSuchElementException("Game not found with barcode: " + barcode));

        String newImageUrl = game.getImageUrl();
        if (image != null && !image.isEmpty()) {
            newImageUrl = imageService.uploadImage(image);
        } else if (dto.getImageUrl() != null && !dto.getImageUrl().isEmpty()) {
            newImageUrl = dto.getImageUrl();
        }

        Set<Genre> genres = dto.getGenres().stream()
                .map(name -> genreRepository.findByName(name).orElseThrow(/* ... */))
                .collect(Collectors.toSet());

        Set<SystemType> systems = dto.getSystems().stream()
                .map(name -> systemTypeRepository.findByName(name).orElseThrow(/* ... */))
                .collect(Collectors.toSet());

        double roundedWeight = Math.round(dto.getWeight() * 10.0) / 10.0;

        // Update the existing game entity
        game.setName(dto.getName());
        game.setDescription(dto.getDescription());
        game.setMinPlayers(dto.getMinPlayers());
        game.setMaxPlayers(dto.getMaxPlayers());
        game.setBestPlayers(dto.getBestPlayers());
        game.setAge(dto.getAge());
        game.setMinPlayTime(dto.getMinPlayTime());
        game.setMaxPlayTime(dto.getMaxPlayTime());
        game.setWeight(roundedWeight);
        game.setGenres(genres);
        game.setSystems(systems);
        game.setImageUrl(newImageUrl);

        gameRepository.save(game);
        return newImageUrl;
    }

    public List<GameDetailResponse> getAllGamesDetail() {
        List<Game> games = gameRepository.findAllFetchJoin();
        List<GameDetailResponse> response = games.stream()
                .map(GameDetailResponse::from)
                .collect(Collectors.toList());
        return response;
    }

    public ResponseEntity<? super AdminGameResponse> getGameByBarcode(String barcode) {
        Optional<Game> game = gameRepository.findByBarcode(barcode);
        if(game.isEmpty()) {
            return ResponseDto.validationFail();
        }
        return AdminGameResponse.success(game.get());
    }

}
