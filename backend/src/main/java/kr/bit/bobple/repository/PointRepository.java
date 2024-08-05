package kr.bit.bobple.repository;

import kr.bit.bobple.entity.Point;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PointRepository extends JpaRepository<Point, Long> {
        List<Point> findByUserIdx(Long userIdx);
}
