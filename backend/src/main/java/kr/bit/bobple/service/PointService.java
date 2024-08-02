package kr.bit.bobple.service;

import kr.bit.bobple.entity.Point;
import kr.bit.bobple.entity.User;
import kr.bit.bobple.repository.PointRepository;
import kr.bit.bobple.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PointService {
    @Autowired
    private PointRepository pointRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Point> getPointHistory(Long userIdx) {
        return pointRepository.findByUserIdx(userIdx);
    }

    public Optional<Integer> getCurrentPoints(Long userIdx) {
        Optional<User> user = userRepository.findById(userIdx);
        return user.map(User::getPoint);
    }

    // 사용자 닉네임을 가져오는 메서드 추가
    public Optional<String> getUserNickName(Long userIdx) {
        Optional<User> user = userRepository.findById(userIdx);
        return user.map(User::getNickName);
    }
}
