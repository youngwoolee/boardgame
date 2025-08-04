package com.project.boardgame.repository;

import java.util.List;

import com.project.boardgame.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;


public interface UserRepository extends JpaRepository<Member, String> {

    Member findByUserId(String userId);

    boolean existsByUserId(String userId);

    List<Member> findAllByRole(String role);
}
