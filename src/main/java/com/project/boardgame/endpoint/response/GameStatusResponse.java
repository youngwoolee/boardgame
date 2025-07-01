package com.project.boardgame.endpoint.response;

import com.project.boardgame.domain.Game;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GameStatusResponse {
    private Long gameId;
    private String status;
    private String message;
}
