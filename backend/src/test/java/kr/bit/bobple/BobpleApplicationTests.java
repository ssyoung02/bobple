package kr.bit.bobple;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")  // 테스트 환경에 맞는 프로파일 설정
class BobpleApplicationTests {

    @Test
    void contextLoads() {
        // 컨텍스트 로드 테스트
        // 여기에서 필요한 빈이 모두 주입되는지 확인할 수 있습니다.
    }

}
