package kr.bit.bobple.auth;

import kr.bit.bobple.entity.User;
import kr.bit.bobple.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class AuthenticationFacade {

    private final UserRepository userRepository;

    public AuthenticationFacade(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            Object principal = authentication.getPrincipal();
            System.out.println("Principal: " + principal); // 로그 추가
            if (principal instanceof User) {
                return (User) principal;
            } else if (principal instanceof UserDetails) {
                UserDetails userDetails = (UserDetails) principal;
                System.out.println("UserDetails: " + userDetails.getUsername()); // 로그 추가
                return userRepository.findByUsername(userDetails.getUsername()).orElse(null);
            }
        } else {
            System.out.println("Authentication is null or not authenticated"); // 로그 추가
        }
        return null;
    }
}
