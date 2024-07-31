package kr.bit.bobple.service;

import kr.bit.bobple.entity.PointShop;
import kr.bit.bobple.repository.PointShopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PointShopService {
    @Autowired
    private PointShopRepository pointShopRepository;

    public PointShopService(PointShopRepository pointShopRepository) {
        this.pointShopRepository = pointShopRepository;
    }

    public List<PointShop> getAllPointShops() {
        return pointShopRepository.findAll();
    }

    public PointShop getPointShopByProductIdx(Long productIdx) {
        Optional<PointShop> pointShop = pointShopRepository.findById(productIdx);
        return pointShop.orElse(null); // 더 나은 예외 처리를 위해 적절한 예외를 던질 수 있습니다.
    }
}
