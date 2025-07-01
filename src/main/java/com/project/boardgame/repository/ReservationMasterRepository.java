package com.project.boardgame.repository;

import java.util.List;

import com.project.boardgame.domain.ReservationMaster;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ReservationMasterRepository extends JpaRepository<ReservationMaster, Long> {

    List<ReservationMaster> findByUserId(String userId);

}
