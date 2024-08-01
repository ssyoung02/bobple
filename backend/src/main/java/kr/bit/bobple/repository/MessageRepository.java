package kr.bit.bobple.repository;

import kr.bit.bobple.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByChatRoomId(Long chatRoomId);
}
