package com.project.boardgame.endpoint.response;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import com.project.boardgame.domain.Game;
import com.project.boardgame.domain.Genre;
import com.project.boardgame.domain.SystemType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class GameResponse {

    private Long id;
    private String name;
    private String description;
    private int totalQuantity;
    private String imageUrl;
    private String tag;
    private int minPlayers;
    private int maxPlayers;
    private String age;
    private String time;
    private Set<String> genres;
    private Set<String> systems;
    private String barcode;
    private boolean available;

    public static GameResponse from(Game game) {
        return GameResponse.builder()
                .id(game.getId())
                .name(game.getName())
                .description(game.getDescription())
                .imageUrl(game.getImageUrl())
                .tag(game.getTag())
                .minPlayers(game.getMinPlayers())
                .maxPlayers(game.getMaxPlayers())
                .age(game.getAge())
                .time(game.getTime())
                .genres(game.getGenres().stream().map(Genre::getName).collect(Collectors.toSet()))
                .systems(game.getSystems().stream().map(SystemType::getName).collect(Collectors.toSet()))
                .barcode(game.getBarcode())
                .build();
    }

    public static GameResponse from(Game game, boolean available) {
        return GameResponse.builder()
                .id(game.getId())
                .name(game.getName())
                .description(game.getDescription())
                .imageUrl(game.getImageUrl())
                .tag(game.getTag())
                .minPlayers(game.getMinPlayers())
                .maxPlayers(game.getMaxPlayers())
                .age(game.getAge())
                .time(game.getTime())
                .genres(game.getGenres().stream().map(Genre::getName).collect(Collectors.toSet()))
                .systems(game.getSystems().stream().map(SystemType::getName).collect(Collectors.toSet()))
                .barcode(game.getBarcode())
                .available(available)
                .build();
    }
}
