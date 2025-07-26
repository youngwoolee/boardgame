package com.project.boardgame.repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import com.project.boardgame.domain.Game;
import com.project.boardgame.domain.ReservationDetail;
import com.project.boardgame.domain.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface ReservationDetailRepository extends JpaRepository<ReservationDetail, Long> {

    boolean existsByGameAndStatus(Game game, ReservationStatus status);
    long countByGameAndStatus(Game game, ReservationStatus status);

    Optional<ReservationDetail> findFirstByGameAndStatus(Game findGame, ReservationStatus 예약);

    @Query("SELECT rd.game.id FROM ReservationDetail rd WHERE rd.game IN :games AND rd.status = 'RESERVED'")
    Set<Long> findReservedGameIdsByGameIn(@Param("games") List<Game> games);
}
