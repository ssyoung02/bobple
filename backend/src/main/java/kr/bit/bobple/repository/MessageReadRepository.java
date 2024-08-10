package kr.bit.bobple.repository;

import kr.bit.bobple.entity.MessageRead;
import kr.bit.bobple.entity.Message;
import kr.bit.bobple.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageReadRepository extends JpaRepository<MessageRead, Long> {

    List<MessageRead> findByMessageAndReadAtIsNull(Message message);

    List<MessageRead> findByUserAndMessage(User user, Message message);
}
