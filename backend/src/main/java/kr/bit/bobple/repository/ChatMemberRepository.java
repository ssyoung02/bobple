package kr.bit.bobple.repository;

import kr.bit.bobple.entity.ChatMember;
import kr.bit.bobple.entity.ChatMember.Status;
import kr.bit.bobple.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMemberRepository extends JpaRepository<ChatMember, ChatMember.ChatMemberId> {
    @Query("SELECT cm.chatRoom.chatRoomIdx FROM ChatMember cm WHERE cm.user.userIdx = :userIdx")
    List<Long> findChatRoomIdsByUserIdx(Long userIdx);

    // 특정 채팅방에 참여한 모든 멤버를 찾는 메서드
    List<ChatMember> findByChatRoomChatRoomIdx(Long chatRoomIdx);

    // 특정 채팅방에서 주어진 상태를 가진 멤버 수를 세는 메서드
    int countByChatRoomChatRoomIdxAndStatus(Long chatRoomIdx, Status status);
}
