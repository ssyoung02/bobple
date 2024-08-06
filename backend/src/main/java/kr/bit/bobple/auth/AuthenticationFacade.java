// src/main/java/kr/bit/bobple/auth/AuthenticationFacade.java
package kr.bit.bobple.auth;

import kr.bit.bobple.entity.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class AuthenticationFacade {
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        if (principal instanceof User) {
            return (User) principal;
        }
//        if (authentication != null && authentication.isAuthenticated()) {
//            return (User) authentication.getPrincipal();
//        }
        return null;
    }
}
