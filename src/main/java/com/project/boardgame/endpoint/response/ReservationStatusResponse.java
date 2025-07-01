package com.project.boardgame.endpoint.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReservationStatusResponse {
    private Long reservationId;
    private String status;
    private String message;
}
