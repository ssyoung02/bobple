package kr.bit.bobple.service;

import kr.bit.bobple.entity.Point;
import kr.bit.bobple.entity.User;
import kr.bit.bobple.repository.PointRepository;
import kr.bit.bobple.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Date;

@Service
public class PointService {
    @Autowired
    private PointRepository pointRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Point> getPointHistory(Long userIdx) {
        return pointRepository.findByUserIdxOrderByCreatedAtDesc(userIdx);
    }

    public Optional<Integer> getCurrentPoints(Long userIdx) {
        Optional<User> user = userRepository.findById(userIdx);
        return user.map(User::getPoint);
    }

    public Optional<String> getUserNickName(Long userIdx) {
        Optional<User> user = userRepository.findById(userIdx);
        return user.map(User::getNickName);
    }

    @Transactional
    public void recordTransaction(Long userIdx, long pointValue, Point.PointState pointState, String comment) {
        // Retrieve the current user's point information
        Optional<User> userOptional = userRepository.findById(userIdx);
        if (!userOptional.isPresent()) {
            throw new IllegalArgumentException("User not found");
        }

        User user = userOptional.get();

        // Calculate the new balance based on the transaction type
        int currentBalance = user.getPoint();
        int newBalance = (pointState == Point.PointState.M) ?
                currentBalance - (int) pointValue :
                currentBalance + (int) pointValue;

        // Debug log for checking balance calculation
        System.out.println("User ID: " + userIdx);
        System.out.println("Transaction: " + (pointState == Point.PointState.M ? "-" : "+") + pointValue);
        System.out.println("Current Balance: " + currentBalance);
        System.out.println("New Balance: " + newBalance);

        // Ensure the new balance is not negative
        if (newBalance < 0) {
            throw new IllegalArgumentException("Insufficient balance for the transaction");
        }

        // Create a new point transaction
        Point newPoint = new Point();
        newPoint.setUserIdx(userIdx);
        newPoint.setPointValue(pointValue);
        newPoint.setPointState(pointState);
        newPoint.setPointComment(comment);
        newPoint.setCreatedAt(new Date());
        newPoint.setPointBalance(newBalance);

        // Save the point transaction to the repository
        pointRepository.save(newPoint);

        // Update the user's total points in the users table
        user.setPoint(newBalance);
        userRepository.save(user);
    }

}
