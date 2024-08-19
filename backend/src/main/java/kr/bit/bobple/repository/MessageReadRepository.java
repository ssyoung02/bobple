package kr.bit.bobple.repository;

import jakarta.transaction.Transactional;
import kr.bit.bobple.entity.MessageRead;
import kr.bit.bobple.entity.Message;
import kr.bit.bobple.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageReadRepository extends JpaRepository<MessageRead, Long> {

    List<MessageRead> findByMessageAndReadAtIsNull(Message message);

    List<MessageRead> findByUserAndMessage(User user, Message message);

    // 특정 사용자와 채팅방에 대한 읽음 정보 삭제
    @Modifying
    @Transactional
    @Query("DELETE FROM MessageRead mr WHERE mr.user.userIdx = :userId AND mr.message.chatRoomId = :chatRoomId")
    void deleteByUserIdAndChatRoomId(@Param("userId") Long userId, @Param("chatRoomId") Long chatRoomId);

    @Modifying
    @Transactional
    @Query("DELETE FROM MessageRead mr WHERE mr.message.chatRoomId = :chatRoomId")
    void deleteByChatRoomId(@Param("chatRoomId") Long chatRoomId);
}


