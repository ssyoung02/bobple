package kr.bit.bobple.service;

import kr.bit.bobple.entity.SearchKeyword;
import kr.bit.bobple.repository.SearchKeywordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SearchKeywordService {

    @Autowired
    private SearchKeywordRepository searchKeywordRepository;

    public void saveOrUpdateKeyword(String keyword) {
        SearchKeyword existingKeyword = searchKeywordRepository.findByKeyword(keyword);
        if (existingKeyword != null) {
            existingKeyword.setCount(existingKeyword.getCount() + 1);
            existingKeyword.setSearchTime(LocalDateTime.now());
            searchKeywordRepository.save(existingKeyword);
        } else {
            SearchKeyword newKeyword = new SearchKeyword();
            newKeyword.setKeyword(keyword);
            newKeyword.setCount(1);
            newKeyword.setSearchTime(LocalDateTime.now());
            searchKeywordRepository.save(newKeyword);
        }
    }

    public List<SearchKeyword> getTopKeywords() {
        return searchKeywordRepository.findTop10ByOrderByCountDescSearchTimeDesc();
    }
}