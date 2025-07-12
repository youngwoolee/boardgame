package com.project.boardgame.endpoint.response;

import com.project.boardgame.domain.Game;
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
    private String players;
    private String age;
    private String time;
    private String genre;
    private String system;
    private String barcode;

    public static GameResponse from(Game game) {
        return GameResponse.builder()
                .id(game.getId())
                .name(game.getName())
                .description(game.getDescription())
                .imageUrl(game.getImageUrl())
                .tag(game.getTag())
                .players(game.getPlayers())
                .age(game.getAge())
                .time(game.getTime())
                .genre(game.getGenre())
                .system(game.getSystem())
                .barcode(game.getBarcode())
                .build();
    }
}
