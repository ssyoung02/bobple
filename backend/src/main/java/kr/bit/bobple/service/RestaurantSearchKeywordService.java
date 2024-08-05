package kr.bit.bobple.service;

import kr.bit.bobple.entity.RestaurantSearchKeyword;
import kr.bit.bobple.repository.RestaurantSearchKeywordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RestaurantSearchKeywordService {

    @Autowired
    private RestaurantSearchKeywordRepository restaurantSearchKeywordRepository;

    public void saveKeyword(String keyword) {
        RestaurantSearchKeyword existingKeyword = restaurantSearchKeywordRepository.findByKeyword(keyword);
        if (existingKeyword != null) {
            existingKeyword.setCount(existingKeyword.getCount() + 1);
            restaurantSearchKeywordRepository.save(existingKeyword);
        } else {
            RestaurantSearchKeyword newKeyword = new RestaurantSearchKeyword();
            newKeyword.setKeyword(keyword);
            newKeyword.setCount(1);
            restaurantSearchKeywordRepository.save(newKeyword);
        }
    }

    @Transactional(readOnly = true)
    public List<RestaurantSearchKeyword> getTop10Keywords() {
        return restaurantSearchKeywordRepository.findTop10ByOrderByCountDesc();
    }
}
