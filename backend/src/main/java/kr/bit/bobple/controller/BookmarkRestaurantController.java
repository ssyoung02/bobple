package kr.bit.bobple.controller;

import kr.bit.bobple.entity.BookmarkRestaurant;
import kr.bit.bobple.repository.BookmarkRestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookmarks/restaurants")
public class BookmarkRestaurantController {

    @Autowired
    private BookmarkRestaurantRepository bookmarkRestaurantRepository;

    @PostMapping
    public ResponseEntity<Void> addOrRemoveBookmark(@RequestBody BookmarkRestaurant bookmarkRestaurant) {

        if (bookmarkRestaurantRepository.existsByUserIdxAndRestaurantId(
                bookmarkRestaurant.getUserIdx(), bookmarkRestaurant.getRestaurantId())) {
            // 이미 북마크된 경우 삭제
            bookmarkRestaurantRepository.deleteByUserIdxAndRestaurantId(
                    bookmarkRestaurant.getUserIdx(), bookmarkRestaurant.getRestaurantId());
            return ResponseEntity.noContent().build();
        } else {
            // 북마크되지 않은 경우 추가
            BookmarkRestaurant savedBookmark = bookmarkRestaurantRepository.save(bookmarkRestaurant);
            return ResponseEntity.ok().build(); // 200 OK 응답만 반환
        }
    }


    @GetMapping("/{userIdx}")
    public ResponseEntity<List<BookmarkRestaurant>> getBookmarks(@PathVariable Long userIdx) {
        List<BookmarkRestaurant> bookmarks = bookmarkRestaurantRepository.findByUserIdx(userIdx);

        return ResponseEntity.ok(bookmarks);
    }

    @DeleteMapping("/{restaurantId}")
    @Transactional
    public ResponseEntity<Void> deleteBookmark(@PathVariable String restaurantId, @RequestBody Map<String, Long> requestBody) {
        Long userIdx = requestBody.get("userIdx");
        bookmarkRestaurantRepository.deleteByUserIdxAndRestaurantId(userIdx, restaurantId);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/count")
    public ResponseEntity<Map<String, Integer>> getBookmarkCounts(@RequestParam List<String> restaurantIds) {
        List<Object[]> results = bookmarkRestaurantRepository.countByRestaurantIdIn(restaurantIds);
        Map<String, Integer> bookmarkCounts = results.stream()
                .collect(Collectors.toMap(
                        result -> (String) result[0],
                        result -> ((Long) result[1]).intValue()
                ));
        return ResponseEntity.ok(bookmarkCounts);
    }


}

