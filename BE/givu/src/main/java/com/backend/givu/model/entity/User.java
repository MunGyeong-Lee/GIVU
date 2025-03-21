package com.backend.givu.model.entity;

import com.backend.givu.model.Enum.UsersAgeRange;
import com.backend.givu.model.Enum.UsersGender;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "kakao_id")
    private Long kakaoId;

    @Column(name = "nickname", length = 100)
    private String nickName;

    @Column(name = "email", length = 255)
    private String email;

    @Column(name = "birth")
    private LocalDate birth;

    @Column(name = "profile_image", length = 500)
    private String profileImage;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    private UsersGender gender;

    @Enumerated(EnumType.STRING)
    @Column(name = "age_range")
    private UsersAgeRange ageRange;

    @Column(name = "balance")
    private int balance;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
