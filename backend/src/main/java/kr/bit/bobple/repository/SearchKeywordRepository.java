package kr.bit.bobple.repository;

import kr.bit.bobple.entity.SearchKeyword;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SearchKeywordRepository extends JpaRepository<SearchKeyword, Long> {
    SearchKeyword findByKeyword(String keyword);
    List<SearchKeyword> findTop10ByOrderByCountDescSearchTimeDesc();
}
