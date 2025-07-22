package com.project.boardgame.endpoint.response.reservation;

import java.time.LocalDateTime;

import com.project.boardgame.domain.ReservationStatus;
import com.project.boardgame.endpoint.response.GameResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservationDetailResponse {
    private Long id;
    private ReservationStatus status;
    private LocalDateTime returnedAt;
    private GameResponse game;
}
