package kr.bit.bobple.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "purchased_gift")
public class PurchasedGift {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "purchase_idx", nullable = false)
    private Long purchaseIdx;

    @ManyToOne
    @JoinColumn(name = "user_idx", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "gift_idx", nullable = false)
    private PointShop pointShop;

    @Column(name = "purchase_date", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime purchaseDate;

    @Column(name = "is_used", nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean isUsed;

    // 기본 생성자
    public PurchasedGift() {
        this.purchaseDate = LocalDateTime.now();
        this.isUsed = false;
    }

    // 모든 필드를 포함한 생성자
    public PurchasedGift(User user, PointShop pointShop) {
        this.user = user;
        this.pointShop = pointShop;
        this.purchaseDate = LocalDateTime.now();
        this.isUsed = false;
    }

    public boolean isExpired() {
        return purchaseDate.plusYears(1).isBefore(LocalDateTime.now());
    }
}
