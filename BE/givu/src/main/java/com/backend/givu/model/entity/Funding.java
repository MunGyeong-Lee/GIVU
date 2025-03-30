package com.backend.givu.model.entity;

import com.backend.givu.model.Enum.FundingsCategory;
import com.backend.givu.model.Enum.FundingsScope;
import com.backend.givu.model.Enum.FundingsStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.annotations.Type;
import org.hibernate.type.SqlTypes;
import com.vladmihalcea.hibernate.type.json.JsonBinaryType;
import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "fundings")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Funding {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "funding_id", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "product_id")
    private Integer productId;

    @Size(max = 20)
    @NotNull
    @Column(name = "title", nullable = false, length = 20)
    private String title;

    @Column(name = "body", length = Integer.MAX_VALUE)
    private String body;

    @Size(max = 255)
    @Column(name = "description")
    private String description;

    @Size(max = 20)
    @Column(name = "category_name", length = 20)
    private String categoryName;

    @Column(name = "participants_number")
    private Integer participantsNumber;

    @Column(name = "funded_amount")
    private Integer fundedAmount;

    @Type(JsonBinaryType.class)
    @Column(columnDefinition = "jsonb")
    private List<String> image;

    public void addImage(String url) {
        if (this.image == null) {
            this.image = new ArrayList<>();
        }
        this.image.add(url);
    }

    @Column(name = "created_at")
    private Instant createdAt;


    @OneToMany(mappedBy = "funding")
    private Set<Participant> participants = new LinkedHashSet<>();

    @Column(name = "updated_at")
    private Instant updatedAt;

    @OneToMany(mappedBy = "relatedFunding")
    private Set<Payment> payments = new LinkedHashSet<>();

    // 이 펀딩을 즐겨찾기한 유저들
    @OneToMany(mappedBy = "funding", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Favorite> favorites = new ArrayList<>();

    @OneToMany(mappedBy = "funding")
    private Set<Letter> letters = new LinkedHashSet<>();

    @OneToMany(mappedBy = "funding")
    private Set<Review> reviews = new LinkedHashSet<>();

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "category", columnDefinition = "funding_category")
    private FundingsCategory category;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "scope", columnDefinition = "funding_scope")
    private FundingsScope scope;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "status", columnDefinition = "funding_status")
    private FundingsStatus status;


//    @PrePersist
//    protected void onCreate(){
//        Instant now = Instant.now() ;
//        this.createdAt = now;
//        this.updatedAt = now;
//    }
//
//    @PreUpdate
//    protected  void onUpdate(){
//        this.updatedAt = Instant.now();
//    }
//

}