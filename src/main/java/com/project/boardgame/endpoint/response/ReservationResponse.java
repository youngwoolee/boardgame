package com.project.boardgame.endpoint.response;

import java.time.LocalDateTime;
import java.util.List;

import com.project.boardgame.domain.ReservationDetail;
import com.project.boardgame.domain.ReservationMaster;
import com.project.boardgame.domain.ReservationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservationResponse {
    private Long id;
    private String userId;
    private String nickname;
    private String gameName;
    private LocalDateTime reservedAt;
    private LocalDateTime dueDate;
    private LocalDateTime returnedAt;
    private String status;
    private boolean overdue; // 연체 여부

    public static ReservationResponse from(ReservationMaster master) {
        List<ReservationDetail> details = master.getDetails();
        String firstGameName = details.get(0)
                .getGame()
                .getName();
        int count = details.size();

        String gameName = (count == 1)
                ? firstGameName
                : firstGameName + " 외 " + (count - 1) + "개";

        return ReservationResponse.builder()
                .id(master.getId())
                .userId(master.getUserId())
                .nickname(master.getUserNickname())
                .gameName(gameName)
                .reservedAt(master.getReservedAt())
                .dueDate(master.getDueDate())
                .status(master.getStatus()
                                .name())
                .overdue(master.getStatus() == ReservationStatus.예약
                                 && master.getDueDate()
                        .isBefore(LocalDateTime.now()))
                .build();
    }
}
