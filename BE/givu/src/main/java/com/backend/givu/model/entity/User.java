package com.backend.givu.model.entity;

import com.backend.givu.model.Enum.PaymentsStatus;
import com.backend.givu.model.Enum.UsersAgeRange;
import com.backend.givu.model.Enum.UsersGender;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "users")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id", nullable = false)
    private Long id;

    @Column(name = "kakao_id")
    private Long kakaoId;

    @Size(max = 100)
    @Column(name = "nickname", length = 100)
    private String nickname;

    @Size(max = 255)
    @Column(name = "email")
    private String email;

    @Column(name = "birth")
    private LocalDate birth;

    @Size(max = 500)
    @Column(name = "profile_image", length = 500)
    private String profileImage;

    @Column(name = "address", length = Integer.MAX_VALUE)
    private String address;

    @Column(name = "balance")
    private Integer balance;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @Size(max = 255)
    @Column(name = "account_number")
    private String accountNumber;

    @Size(max = 100)
    @Column(name = "payment_password")
    private String paymentPassword;

    @OneToMany(mappedBy = "user")
    private Set<BankTransaction> bankTransactions = new LinkedHashSet<>();

    // 즐겨찾기 목록
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Favorite> favorites = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private Set<Funding> fundings = new LinkedHashSet<>();

    @OneToMany(mappedBy = "user")
    private Set<Letter> letters = new LinkedHashSet<>();
    @OneToMany(mappedBy = "user")
    private Set<Payment> payments = new LinkedHashSet<>();

    @OneToMany(mappedBy = "user")
    private Set<Participant> participants = new LinkedHashSet<>();
    @OneToMany(mappedBy = "user")
    private Set<Review> reviews = new LinkedHashSet<>();

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "gender", columnDefinition = "user_gender")
    private UsersGender gender;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "age_range", columnDefinition = "user_age_range")
    private UsersAgeRange ageRange;

    public void addBalance(int amount){
        this.balance += amount;
    }

    public void subtractBalance(int amount){
        if(this.balance < amount){
            throw new IllegalArgumentException( "잔액보다 큰 금액은 차감할 수 없습니다.");
        }
        this.balance -= amount;
    }




}