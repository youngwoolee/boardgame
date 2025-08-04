package com.project.boardgame.endpoint.response.admin;

import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import com.project.boardgame.domain.Game;
import com.project.boardgame.domain.Genre;
import com.project.boardgame.domain.SystemType;
import com.project.boardgame.endpoint.response.ResponseDto;
import com.project.boardgame.endpoint.response.auth.CheckCertificationResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;


@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AdminGameResponse extends ResponseDto {

    private Long id;
    private String name;
    private String description;
    private int totalQuantity;
    private String imageUrl;
    private String tag;
    private int minPlayers;
    private int maxPlayers;
    private int bestPlayers;
    private int age;
    private double weight;
    private int minPlayTime;
    private int maxPlayTime;
    private Set<String> genres;
    private Set<String> systems;
    private String barcode;
    private boolean available;

    public static AdminGameResponse from(Game game) {
        return AdminGameResponse.builder()
                .id(game.getId())
                .name(game.getName())
                .description(game.getDescription())
                .imageUrl(game.getImageUrl())
                .tag(game.getTag())
                .minPlayers(game.getMinPlayers())
                .maxPlayers(game.getMaxPlayers())
                .bestPlayers(game.getBestPlayers())
                .age(game.getAge())
                .minPlayTime(game.getMinPlayTime())
                .maxPlayTime(game.getMaxPlayTime())
                .weight(game.getWeight())
                .genres(game.getGenres().stream().map(Genre::getName).collect(Collectors.toSet()))
                .systems(game.getSystems().stream().map(SystemType::getName).collect(Collectors.toSet()))
                .barcode(game.getBarcode())
                .build();
    }

    public static AdminGameResponse from(Game game, boolean available) {
        return AdminGameResponse.builder()
                .id(game.getId())
                .name(game.getName())
                .description(game.getDescription())
                .imageUrl(game.getImageUrl())
                .tag(game.getTag())
                .minPlayers(game.getMinPlayers())
                .maxPlayers(game.getMaxPlayers())
                .bestPlayers(game.getBestPlayers())
                .age(game.getAge())
                .minPlayTime(game.getMinPlayTime())
                .maxPlayTime(game.getMaxPlayTime())
                .weight(game.getWeight())
                .genres(game.getGenres().stream().map(Genre::getName).collect(Collectors.toSet()))
                .systems(game.getSystems().stream().map(SystemType::getName).collect(Collectors.toSet()))
                .barcode(game.getBarcode())
                .available(available)
                .build();
    }

    public static ResponseEntity<? super AdminGameResponse> success(Game game) {
        AdminGameResponse responseBody = AdminGameResponse.from(game);
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }
}
