package com.project.boardgame.endpoint.request;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GameReservationRequest {
    private String userId;
    private String nickname;
    private List<Long> gameIds;
}
