package kr.bit.bobple.repository;

import jakarta.transaction.Transactional;
import kr.bit.bobple.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByChatRoomId(Long chatRoomId);

    @Modifying
    @Transactional
    @Query("DELETE FROM Message m WHERE m.chatRoomId = :chatRoomId")
    void deleteByChatRoomId(@Param("chatRoomId") Long chatRoomId);
}
