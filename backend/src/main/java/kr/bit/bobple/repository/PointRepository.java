package kr.bit.bobple.repository;

import kr.bit.bobple.entity.Point;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import org.springframework.data.domain.Sort;

@Repository
public interface PointRepository extends JpaRepository<Point, Long> {
        // 정렬을 위한 메서드 추가
        List<Point> findByUserIdx(Long userIdx, Sort sort);

        // 주어진 사용자 ID에 대해 최신순으로 정렬된 포인트 내역을 가져오기 위한 메서드
        List<Point> findByUserIdxOrderByCreatedAtDesc(Long userIdx);
}
