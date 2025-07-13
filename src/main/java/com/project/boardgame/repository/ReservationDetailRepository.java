package com.project.boardgame.repository;

import java.util.Optional;

import com.project.boardgame.domain.Game;
import com.project.boardgame.domain.ReservationDetail;
import com.project.boardgame.domain.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ReservationDetailRepository extends JpaRepository<ReservationDetail, Long> {

    boolean existsByGameAndStatus(Game game, ReservationStatus status);
    long countByGameAndStatus(Game game, ReservationStatus status);

    Optional<ReservationDetail> findFirstByGameAndStatus(Game findGame, ReservationStatus 예약);

}
