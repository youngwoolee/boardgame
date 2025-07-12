package com.project.boardgame.endpoint.response;

import java.util.List;

import com.project.boardgame.domain.Game;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Builder
@Getter
@NoArgsConstructor
public class GameListResponse extends ResponseDto{

    private List<GameResponse> data;

    @Builder
    public GameListResponse(List<GameResponse> data) {
        super();
        this.data = data;
    }

}
