package kr.bit.bobple.repository;

import kr.bit.bobple.entity.ChatMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMemberRepository extends JpaRepository<ChatMember, ChatMember.ChatMemberId> {
    List<ChatMember> findByIdUserIdx(Long userIdx);
}
