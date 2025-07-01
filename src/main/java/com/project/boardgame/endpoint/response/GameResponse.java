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

    private String name;
    private String description;
    private int totalQuantity;

    public static GameResponse from(Game game) {
        return GameResponse.builder()
                .name(game.getName())
                .description(game.getDescription())
                .totalQuantity(game.getTotalQuantity())
                .build();
    }
}
