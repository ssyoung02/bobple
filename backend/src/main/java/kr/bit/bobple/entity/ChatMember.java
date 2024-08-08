package kr.bit.bobple.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "chat_members")
@Getter
@Setter
public class ChatMember {

    @EmbeddedId
    private ChatMemberId id;

    @ManyToOne
    @MapsId("chatRoomIdx")
    @JoinColumn(name = "chat_room_idx", nullable = false)
    @JsonBackReference
    private ChatRoom chatRoom;

    @ManyToOne
    @MapsId("userIdx")
    @JoinColumn(name = "user_idx", nullable = false)
    @JsonBackReference
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    public enum Role {
        LEADER, MEMBER
    }

    @Embeddable
    public static class ChatMemberId implements Serializable {
        private Long chatRoomIdx;
        private Long userIdx;

        // Constructors, getters, setters, equals, and hashCode methods

        public ChatMemberId() {}

        public ChatMemberId(Long chatRoomIdx, Long userIdx) {
            this.chatRoomIdx = chatRoomIdx;
            this.userIdx = userIdx;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            ChatMemberId that = (ChatMemberId) o;
            return Objects.equals(chatRoomIdx, that.chatRoomIdx) &&
                    Objects.equals(userIdx, that.userIdx);
        }

        @Override
        public int hashCode() {
            return Objects.hash(chatRoomIdx, userIdx);
        }
    }
}
