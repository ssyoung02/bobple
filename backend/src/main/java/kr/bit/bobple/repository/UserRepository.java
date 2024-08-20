package kr.bit.bobple.repository;

import kr.bit.bobple.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

/**
 * UserRepository 인터페이스
 * User 엔티티와 관련된 데이터베이스 작업을 처리하는 JPA 레포지토리입니다.
 * Spring Data JPA의 JpaRepository를 상속하여 기본적인 CRUD 작업을 지원합니다.
 */
public interface UserRepository extends JpaRepository<User, Long> {
    /**
     * 이메일로 사용자를 조회하는 메서드
     *
     * @param email 조회할 사용자의 이메일
     * @return 해당 이메일을 가진 사용자의 Optional 객체
     */
    Optional<User> findByEmail(String email);

    /**
     * 이름으로 사용자를 조회하는 메서드
     *
     * @param name 조회할 사용자의 이름
     * @return 해당 이름을 가진 사용자의 Optional 객체
     */
    Optional<User> findByName(String name);

    /**
     * 사용자명과 이메일로 사용자를 조회하는 메서드
     *
     * @param username 사용자명
     * @param email 이메일
     * @return 해당 사용자명과 이메일을 가진 사용자의 Optional 객체
     */
    Optional<User> findByUsernameAndEmail(String username, String email);


    /**
     * 사용자명으로 사용자를 조회하는 메서드
     *
     * @param name 조회할 사용자명
     * @return 해당 사용자명을 가진 사용자의 Optional 객체
     */
    Optional<User> findByUsername(String name);


    /**
     * 특정 사용자와 그 사용자가 작성한 레시피 목록을 함께 조회하는 메서드
     * 엔티티 그래프를 사용하여 N+1 문제를 방지하고, 사용자와 관련된 레시피 목록을 한번에 가져옵니다.
     *
     * @param userId 조회할 사용자 ID
     * @return 해당 사용자와 그의 레시피 목록을 포함한 Optional 객체
     */
    @EntityGraph(attributePaths = {"recipes"})
    @Query("SELECT u FROM User u WHERE u.userIdx = :userId")
    Optional<User> findUserWithRecipes(@Param("userId") Long userId);

    /**
     * 닉네임으로 사용자를 조회하는 메서드
     *
     * @param nickName 조회할 사용자 닉네임
     * @return 해당 닉네임을 가진 사용자의 Optional 객체
     */
    Optional<User> findByNickName(String nickName);

}