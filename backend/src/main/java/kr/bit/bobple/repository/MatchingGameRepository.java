package kr.bit.bobple.repository;

import kr.bit.bobple.entity.MatchingGame;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchingGameRepository extends JpaRepository<MatchingGame, Long> {
    List<MatchingGame> findAll();
}
