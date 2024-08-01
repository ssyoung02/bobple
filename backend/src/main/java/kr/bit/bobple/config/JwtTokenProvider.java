package kr.bit.bobple.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.Map;

@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.token-validity}")
    private long tokenValidity;

    // 토큰 생성
    public String createToken(Long userIdx, String username, Map<String, Object> claims) {
        Claims jwtClaims = Jwts.claims().setSubject(username);
        jwtClaims.putAll(claims);
        jwtClaims.put("user_idx", userIdx);  // user_idx 추가
        Date now = new Date();
        Date validity = new Date(now.getTime() + tokenValidity);

        return Jwts.builder()
                .setClaims(jwtClaims)
                .setIssuedAt(now)
                .setExpiration(validity)
                .signWith(SignatureAlgorithm.HS256, secretKey.getBytes())  // secretKey를 바이트 배열로 변환
                .compact();
    }

    // 토큰에서 클레임 추출
    public Claims getClaims(String token) {
        return Jwts.parser()
                .setSigningKey(secretKey.getBytes())  // secretKey를 바이트 배열로 변환
                .parseClaimsJws(token)
                .getBody();
    }

    // 토큰에서 사용자 이름 추출
    public String getUsername(String token) {
        return getClaims(token).getSubject();
    }

    // 토큰 유효성 검사
    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(secretKey.getBytes()).parseClaimsJws(token);  // secretKey를 바이트 배열로 변환
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
