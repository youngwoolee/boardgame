package com.project.boardgame.endpoint.response;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.project.boardgame.domain.Game;
import com.project.boardgame.domain.ReservationDetail;
import com.project.boardgame.domain.ReservationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class GameDetailResponse {

    private String name;
    private String description;
    private int totalQuantity;
    private int availableQuantity;

    private List<ReservationUser> reservationUsers = new ArrayList<>();

    public static GameDetailResponse from(Game game) {
        List<ReservationUser> reservationUsers = game.getReservations().stream()
                .filter(r -> r.getStatus() == ReservationStatus.RESERVED)
                .map(ReservationUser::from)
                .collect(Collectors.toList());

        return GameDetailResponse.builder()
                .name(game.getName())
                .description(game.getDescription())
                .reservationUsers(reservationUsers)
                .build();
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    private static final class ReservationUser {
        private String userId;
        private String userName;

        private static ReservationUser from(ReservationDetail reservationDetail) {
            return ReservationUser.builder()
                    .userId(reservationDetail.getMaster()
                                    .getUserId())
                    .userName(reservationDetail.getMaster().getUserNickname())
                    .build();
        }
    }
}
