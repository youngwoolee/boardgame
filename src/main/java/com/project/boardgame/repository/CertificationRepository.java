package com.project.boardgame.repository;

import java.util.Optional;

import com.project.boardgame.domain.Certification;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;


public interface CertificationRepository extends JpaRepository<Certification, String> {

    Optional<Certification> findByUserId(String userId);

    @Transactional
    void deleteByUserId(String userId);

}
