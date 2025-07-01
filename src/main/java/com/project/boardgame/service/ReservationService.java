package com.project.boardgame.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.project.boardgame.domain.Game;
import com.project.boardgame.domain.ReservationDetail;
import com.project.boardgame.domain.ReservationMaster;
import com.project.boardgame.domain.ReservationStatus;
import com.project.boardgame.endpoint.request.GameReservationRequest;
import com.project.boardgame.endpoint.response.ReservationStatusResponse;
import com.project.boardgame.endpoint.response.ReservationResponse;
import com.project.boardgame.repository.GameRepository;
import com.project.boardgame.repository.ReservationDetailRepository;
import com.project.boardgame.repository.ReservationMasterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationMasterRepository reservationMasterRepository;
    private final ReservationDetailRepository reservationDetailRepository;
    private final GameRepository gameRepository;
    private static final int RESERVATION_DATE = 4;

    public List<ReservationResponse> getMyReservations(String userId) {
        List<ReservationMaster> masters = reservationMasterRepository.findByUserId(userId);
        return masters.stream()
                .map(ReservationResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public ReservationStatusResponse cancelReservation(Long masterId) {
        ReservationMaster master = reservationMasterRepository.findById(masterId)
                .orElseThrow(() -> new IllegalArgumentException("예약 마스터 ID를 찾을 수 없습니다."));

        if (!ReservationStatus.예약.equals(master.getStatus())) {
            throw new IllegalStateException("이미 취소된 예약입니다.");
        }

        master.setStatus(ReservationStatus.취소);
        for (ReservationDetail detail : master.getDetails()) {
            detail.setStatus(ReservationStatus.취소);
        }

        ReservationStatusResponse response = ReservationStatusResponse.builder()
                .reservationId(master.getId())
                .status(master.getStatus().name())
                .message("예약이 취소되었습니다.")
                .build();
        return response;
    }

    @Transactional
    public ReservationStatusResponse returnReservation(Long masterId) {
        ReservationMaster master = reservationMasterRepository.findById(masterId)
                .orElseThrow(() -> new IllegalArgumentException("예약 마스터 ID를 찾을 수 없습니다."));

        if (!ReservationStatus.예약.equals(master.getStatus())) {
            throw new IllegalStateException("이미 반납되었거나 취소된 예약입니다.");
        }

        master.setStatus(ReservationStatus.반납);
        for (ReservationDetail detail : master.getDetails()) {
            detail.setStatus(ReservationStatus.반납);
            detail.setReturnedAt(LocalDateTime.now());
        }
        ReservationStatusResponse response = ReservationStatusResponse.builder()
                .reservationId(master.getId())
                .status(master.getStatus().name())
                .message("반납되었습니다.")
                .build();

        return response;
    }

    @Transactional
    public ReservationResponse reserve(GameReservationRequest request) {
        LocalDateTime now = LocalDateTime.now();

        ReservationMaster master = ReservationMaster.builder()
                .userId(request.getUserId())
                .userNickname(request.getNickname())
                .reservedAt(now)
                .dueDate(now.plusDays(RESERVATION_DATE))
                .status(ReservationStatus.예약)
                .build();

        List<ReservationDetail> details = request.getGameIds().stream()
                .map(gameId -> {
                    Game game = gameRepository.findById(gameId)
                            .orElseThrow(() -> new IllegalArgumentException("게임 ID " + gameId + "를 찾을 수 없습니다."));

                    long reservedCount = reservationDetailRepository.countByGameAndStatus(game, ReservationStatus.예약);
                    if (reservedCount >= game.getTotalQuantity()) {
                        throw new IllegalStateException(game.getName() + " 예약 불가: 수량 부족");
                    }

                    return ReservationDetail.builder()
                            .master(master)
                            .game(game)
                            .status(ReservationStatus.예약)
                            .build();
                })
                .collect(Collectors.toList());

        master.setDetails(details);
        ReservationMaster saveReservationMaster = reservationMasterRepository.save(master);

        return ReservationResponse.from(saveReservationMaster);
    }

    public List<ReservationResponse> getUserReservationDetail(String userId) {
        List<ReservationMaster> masters = reservationMasterRepository.findByUserId(userId);
        List<ReservationResponse> responses = new ArrayList<>();

        for (ReservationMaster master : masters) {
            for (ReservationDetail detail : master.getDetails()) {
                responses.add(ReservationResponse.builder()
                                      .id(detail.getId())
                                      .userId(master.getUserId())
                                      .nickname(master.getUserNickname())
                                      .gameName(detail.getGame().getName())
                                      .reservedAt(master.getReservedAt())
                                      .dueDate(master.getDueDate())
                                      .returnedAt(detail.getReturnedAt())
                                      .status(detail.getStatus().name())
                                      .overdue(detail.getReturnedAt() == null && master.getDueDate().isBefore(LocalDateTime.now()))
                                      .build());
            }
        }

        return responses;
    }
}
