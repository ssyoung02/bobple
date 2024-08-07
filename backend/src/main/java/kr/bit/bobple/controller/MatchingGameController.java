package kr.bit.bobple.controller;

import kr.bit.bobple.dto.MatchingGameDto;
import kr.bit.bobple.entity.MatchingGame;
import kr.bit.bobple.repository.MatchingGameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;
@RestController
@RequestMapping("/api/matching-game")
@CrossOrigin(origins = "http://localhost:3000")
public class MatchingGameController {
    @Autowired
    private MatchingGameRepository matchingGameRepository;

    @GetMapping("/foods")
    public ResponseEntity<List<MatchingGameDto>> getAllMatchingGames() {
        List<MatchingGame> gameList = matchingGameRepository.findAll();
        List<MatchingGameDto> gameDtoList = gameList.stream()
                .map(MatchingGameDto::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(gameDtoList);
    }

}
