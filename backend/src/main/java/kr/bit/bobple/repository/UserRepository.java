package kr.bit.bobple.repository;

import kr.bit.bobple.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByName(String name);
    Optional<User> findByUsernameAndEmail(String username, String email);


//    @EntityGraph(attributePaths = {"recipes"})
//    @Query("SELECT u FROM User u WHERE u.userIdx = :userId")
//    Optional<User> findUserWithRecipes(@Param("userId") Long userId);

    @EntityGraph(attributePaths = {"recipes"})
    @Query("SELECT u FROM User u WHERE u.userIdx = :userId")
    Optional<User> findUserWithRecipes(@Param("userId") Long userId);
}
