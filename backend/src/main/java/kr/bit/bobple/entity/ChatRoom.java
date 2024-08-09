package kr.bit.bobple.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "chat_rooms")
@Getter
@Setter
public class ChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long chatRoomIdx;

    @ManyToOne
    @JoinColumn(name = "room_leader", nullable = false)
    @JsonBackReference
    private User roomLeader;

    @Column(nullable = false, length = 100)
    private String chatRoomTitle;

    @Column(length = 255)
    private String description;

    @Column(length = 100)
    private String location;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private int roomPeople;

    @Column(nullable = false)
    private int currentParticipants;

    @Column(nullable = true)
    private String roomImage;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.RECRUITING;

    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<ChatMember> chatMembers;

    public enum Status {
        RECRUITING, CLOSED
    }

    public void updateStatus() {
        if (this.currentParticipants >= this.roomPeople) {
            this.status = Status.CLOSED;
        } else {
            this.status = Status.RECRUITING;
        }
    }
}
