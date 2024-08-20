package kr.bit.bobple.auth;

import kr.bit.bobple.entity.User;
import kr.bit.bobple.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;


@Component
public class AuthenticationFacade {

    private final UserRepository userRepository;

    // 생성자를 통해 UserRepository를 주입받아 사용
    public AuthenticationFacade(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * 현재 인증된 사용자의 정보를 가져오는 메서드
     *
     * @return User 객체 또는 null (인증되지 않은 경우)
     */
    public User getCurrentUser() {
        // 현재 SecurityContextHolder에서 인증 정보를 가져옴
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // 인증 정보가 존재하고 사용자가 인증되었을 경우에만 처리
        if (authentication != null && authentication.isAuthenticated()) {
            // 인증된 사용자의 정보를 principal 객체로 받음
            Object principal = authentication.getPrincipal();

            // principal이 User 객체일 경우 (사용자 정보가 직접 User 객체로 존재)
            System.out.println("Principal: " + principal); // 로그 추가
            if (principal instanceof User) {
                return (User) principal;
            }
            // principal이 UserDetails 객체일 경우 (스프링 시큐리티가 제공하는 UserDetails 구현체로 존재)
            else if (principal instanceof UserDetails) {
                UserDetails userDetails = (UserDetails) principal;
                System.out.println("UserDetails: " + userDetails.getUsername()); // 로그 추가
                // userDetails에서 얻은 username을 바탕으로 데이터베이스에서 사용자 정보를 조회
                return userRepository.findByUsername(userDetails.getUsername()).orElse(null);
            }
        } else {
            System.out.println("Authentication is null or not authenticated"); // 인증 정보가 없거나 인증되지 않은 경우 로그 추가
        }
        // 인증되지 않았거나 사용자 정보를 찾지 못했을 경우 null 반환
        return null;
    }
}
