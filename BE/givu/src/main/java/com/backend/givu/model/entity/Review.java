package com.backend.givu.model.entity;

import com.backend.givu.model.responseDTO.ReviewsDTO;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "reviews")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "funding_id", nullable = false)
    private Funding funding;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull
    @Column(name = "comment", nullable = false, length = Integer.MAX_VALUE)
    private String comment;

    @Size(max = 500)
    @Column(name = "image", length = 500)
    private String image;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @Column(name = "visit")
    private Long visit;

    public static Review from(User user, Funding funding, ReviewsDTO dto){
         Review review = Review.builder()
                .funding(funding)
                .user(user)
                .comment(dto.getComment())
                .image(dto.getImage())
                .visit(0L)
                .build();

         return review;

    }
    public static ReviewsDTO toDTO(Review review) {return new ReviewsDTO(review); }


}