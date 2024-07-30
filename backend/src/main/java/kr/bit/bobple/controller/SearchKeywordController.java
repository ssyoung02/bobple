package kr.bit.bobple.controller;

import kr.bit.bobple.entity.SearchKeyword;
import kr.bit.bobple.service.SearchKeywordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class SearchKeywordController {

    @Autowired
    private SearchKeywordService searchKeywordService;

    @PostMapping("/PopularSearch")
    public void searchAll(@RequestBody String keyword) {
        searchKeywordService.saveOrUpdateKeyword(keyword);
    }

    @GetMapping("/TopKeywords")
    public List<SearchKeyword> getTopKeywords() {
        return searchKeywordService.getTopKeywords();
    }
}