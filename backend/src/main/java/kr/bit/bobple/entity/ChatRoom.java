package kr.bit.bobple.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_rooms")
@Getter
@Setter
public class ChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long chatRoomIdx;

    @Column(nullable = false, length = 100)
    private String chatRoomTitle;

    @Column(length = 255)
    private String description;

    @Column(length = 100)
    private String location;

    @Column(nullable = false)
    private int roomPeople;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = true)
    private String roomImage;

    @ManyToOne
    @JoinColumn(name = "room_leader", nullable = false)
    @JsonBackReference
    private User roomLeader;
}