package kr.bit.bobple.controller;

import kr.bit.bobple.dto.FoodWorldcupDto;
import kr.bit.bobple.entity.FoodWorldcup;
import kr.bit.bobple.repository.FoodWorldcupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;
@RestController
@RequestMapping("/api/foodWorldcup")
@CrossOrigin(origins = "http://localhost:3000")
public class FoodWorldcupController {
    @Autowired
    private FoodWorldcupRepository foodWorldcupRepository;

    @GetMapping("/foods")
    public ResponseEntity<List<FoodWorldcupDto>> getAllFoods() {
        List<FoodWorldcup> foodList = foodWorldcupRepository.findAll();
        List<FoodWorldcupDto> foodDtoList = foodList.stream()
                .map(FoodWorldcupDto::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(foodDtoList);
    }
}
