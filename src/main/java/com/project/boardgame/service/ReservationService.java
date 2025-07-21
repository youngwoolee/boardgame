package com.project.boardgame.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.project.boardgame.domain.Game;
import com.project.boardgame.domain.Member;
import com.project.boardgame.domain.ReservationDetail;
import com.project.boardgame.domain.ReservationMaster;
import com.project.boardgame.domain.ReservationStatus;
import com.project.boardgame.endpoint.request.GameReservationRequest;
import com.project.boardgame.endpoint.response.GameResponse;
import com.project.boardgame.endpoint.response.reservation.ReservationMasterResponse;
import com.project.boardgame.endpoint.response.reservation.ReservationStatusResponse;
import com.project.boardgame.endpoint.response.reservation.ReservationResponse;
import com.project.boardgame.endpoint.response.reservation.ReservationDetailResponse;
import com.project.boardgame.repository.GameRepository;
import com.project.boardgame.repository.ReservationDetailRepository;
import com.project.boardgame.repository.ReservationMasterRepository;
import com.project.boardgame.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationMasterRepository reservationMasterRepository;
    private final ReservationDetailRepository reservationDetailRepository;
    private final GameRepository gameRepository;
    private final UserRepository userRepository;
    private static final int RESERVATION_DATE = 4;

    public List<ReservationMasterResponse> getMyReservations(String userId) {
        List<ReservationMaster> reservationMasterList = reservationMasterRepository.findByUserId(userId);
        return reservationMasterList.stream().map(ReservationMasterResponse::from).collect(Collectors.toList());
    }

    public List<ReservationResponse> getReservations(String userId) {
        List<ReservationMaster> reservationMasterList = reservationMasterRepository.findByUserId(userId);
        return reservationMasterList.stream().map(ReservationResponse::from).collect(Collectors.toList());
    }

    @Transactional
    public ReservationStatusResponse cancelReservation(Long masterId) {
        ReservationMaster master = reservationMasterRepository.findById(masterId)
                .orElseThrow(() -> new IllegalArgumentException("예약 마스터 ID를 찾을 수 없습니다."));

        if (!ReservationStatus.RESERVED.equals(master.getStatus())) {
            throw new IllegalStateException("이미 취소된 예약입니다.");
        }

        master.setStatus(ReservationStatus.CANCELLED);
        for (ReservationDetail detail : master.getDetails()) {
            detail.setStatus(ReservationStatus.CANCELLED);
        }

        ReservationStatusResponse response = ReservationStatusResponse.builder()
                .reservationId(master.getId())
                .status(master.getStatus().name())
                .build();
        return response;
    }

    @Transactional
    public ReservationStatusResponse returnReservation(Long masterId) {
        ReservationMaster master = reservationMasterRepository.findById(masterId)
                .orElseThrow(() -> new IllegalArgumentException("예약 마스터 ID를 찾을 수 없습니다."));

        if (!ReservationStatus.RESERVED.equals(master.getStatus())) {
            throw new IllegalStateException("이미 반납되었거나 취소된 예약입니다.");
        }

        master.setStatus(ReservationStatus.RETURNED);
        master.setReturnedAt(LocalDateTime.now());
        for (ReservationDetail detail : master.getDetails()) {
            detail.setStatus(ReservationStatus.RETURNED);
            detail.setReturnedAt(LocalDateTime.now());
        }
        ReservationStatusResponse response = ReservationStatusResponse.builder()
                .reservationId(master.getId())
                .status(master.getStatus().name())
                .build();

        return response;
    }

    @Transactional
    public ResponseEntity<? super ReservationResponse> reserve(String userId, GameReservationRequest request) {
        Member member = userRepository.findByUserId(userId);
        LocalDateTime now = LocalDateTime.now();

        ReservationMaster master = ReservationMaster.builder()
                .userId(userId)
                .userNickname(member.getName())
                .reservedAt(now)
                .dueDate(now.plusDays(RESERVATION_DATE))
                .status(ReservationStatus.RESERVED)
                .build();

        List<ReservationDetail> details = new ArrayList<>();

        for (String barcode : request.getBarcodes()) {
            Game game = gameRepository.findByBarcode(barcode)
                    .orElseThrow(() -> new IllegalArgumentException("해당 바코드 [" + barcode + "] 를 찾을 수 없습니다."));

            // ✅ 이미 예약 중인 게임인지 확인
            boolean alreadyReserved = reservationDetailRepository.existsByGameAndStatus(game, ReservationStatus.RESERVED);
            if (alreadyReserved) {
                return ReservationResponse.alreadyReservation(game.getName() + "는 이미 대여된 게임입니다");
            }

            ReservationDetail detail = ReservationDetail.builder()
                    .master(master)
                    .game(game)
                    .status(ReservationStatus.RESERVED)
                    .build();

            details.add(detail);
        }

        master.setDetails(details);
        ReservationMaster saved = reservationMasterRepository.save(master);
        return ReservationResponse.success(saved);
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

    public List<ReservationDetailResponse> getReservationDetails(Long reservationId) {
        ReservationMaster master = reservationMasterRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("해당 예약이 존재하지 않습니다."));

        return master.getDetails().stream()
                .map(detail -> ReservationDetailResponse.builder()
                        .id(detail.getId())
                        .status(detail.getStatus())
                        .returnedAt(detail.getReturnedAt())
                        .game(GameResponse.builder()
                                      .id(detail.getGame().getId())
                                      .name(detail.getGame().getName())
                                      .imageUrl(detail.getGame().getImageUrl())
                                      .barcode(detail.getGame().getBarcode())
                                      .build())
                        .build())
                .collect(Collectors.toList());
    }
}
