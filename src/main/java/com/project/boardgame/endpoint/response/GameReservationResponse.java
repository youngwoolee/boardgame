package com.project.boardgame.endpoint.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GameReservationResponse {
    private String userId;
    private String userName;

    private static GameReservationResponse EMPTY = new GameReservationResponse();

    public static GameReservationResponse empty() {
        return GameReservationResponse.EMPTY;
    }

}
