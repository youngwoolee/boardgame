package com.project.boardgame.repository;

import java.util.List;
import java.util.Optional;

import com.project.boardgame.domain.Game;
import org.springframework.data.jpa.repository.JpaRepository;


public interface GameRepository extends JpaRepository<Game, Long> {

    Optional<Game> findByBarcode(String barcode);
}
