package com.project.boardgame.repository;

import java.util.List;
import java.util.Optional;

import com.project.boardgame.domain.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


public interface GameRepository extends JpaRepository<Game, Long> {

    Optional<Game> findByBarcode(String barcode);

    @Query("SELECT DISTINCT g FROM Game g LEFT JOIN FETCH g.genres LEFT JOIN FETCH g.systems")
    List<Game> findAllFetchJoin();
}
