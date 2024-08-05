package kr.bit.bobple.repository;

import kr.bit.bobple.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    List<ChatRoom> findByRoomLeaderUserIdx(Long userIdx);
    List<ChatRoom> findByRoomLeaderUserIdxOrRoomLeaderIsNull(Long userIdx);

}
