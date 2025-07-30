package com.project.boardgame.endpoint.response.reservation;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.project.boardgame.common.ResponseCode;
import com.project.boardgame.domain.ReservationDetail;
import com.project.boardgame.domain.ReservationMaster;
import com.project.boardgame.domain.ReservationStatus;
import com.project.boardgame.endpoint.response.ResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;


@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservationResponse extends ResponseDto {
    private Long id;
    private String userId;
    private String nickname;
    private List<String> gameNames;
    private LocalDateTime reservedAt;
    private LocalDateTime dueDate;
    private LocalDateTime returnedAt;
    private String status;
    private boolean overdue; // 연체 여부

    public static ReservationResponse from(ReservationMaster master) {
        List<ReservationDetail> details = master.getDetails();
        List<String> gameNames = details.stream().map(detail -> detail.getGame().getName())
                .collect(Collectors.toList());

        return ReservationResponse.builder()
                .id(master.getId())
                .userId(master.getUserId())
                .nickname(master.getUserNickname())
                .gameNames(gameNames)
                .reservedAt(master.getReservedAt())
                .dueDate(master.getDueDate())
                .status(master.getStatus()
                                .name())
                .overdue(master.getStatus() == ReservationStatus.RESERVED
                                 && master.getDueDate()
                        .isBefore(LocalDateTime.now()))
                .build();
    }

    public static ResponseEntity<ReservationResponse> success(ReservationMaster response) {
        ReservationResponse responseBody = ReservationResponse.from(response);
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }

    public static ResponseEntity<ResponseDto> alreadyReservation(String message) {
        ResponseDto responseBody = new ResponseDto(ResponseCode.ALREADY_RESERVATION, message);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseBody);
    }
}
