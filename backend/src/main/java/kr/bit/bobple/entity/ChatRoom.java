package kr.bit.bobple.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_rooms")
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

    // Getters and Setters

    public Long getChatRoomIdx() {
        return chatRoomIdx;
    }

    public void setChatRoomIdx(Long chatRoomIdx) {
        this.chatRoomIdx = chatRoomIdx;
    }

    public String getChatRoomTitle() {
        return chatRoomTitle;
    }

    public void setChatRoomTitle(String chatRoomTitle) {
        this.chatRoomTitle = chatRoomTitle;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public int getRoomPeople() {
        return roomPeople;
    }

    public void setRoomPeople(int roomPeople) {
        this.roomPeople = roomPeople;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}