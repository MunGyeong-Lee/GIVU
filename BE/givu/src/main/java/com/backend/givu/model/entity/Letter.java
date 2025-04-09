package com.backend.givu.model.entity;

import com.backend.givu.model.Enum.LettersPrivate;
import com.backend.givu.model.requestDTO.LetterCreateDTO;
import com.backend.givu.model.responseDTO.LettersDTO;
import com.backend.givu.util.mapper.LetterPrivateMapper;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.type.SqlTypes;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "letters")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class  Letter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "letter_id", nullable = false)
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

    @Size(max = 255)
    @Column(name = "image")
    private String image;

    @Column(name = "created_at")
    private Instant createdAt;
    @Column(name = "updated_at")
    private Instant updatedAt;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "access", columnDefinition = "letter_private")
    private LettersPrivate access;

    @PrePersist
    protected void onCreate(){
        Instant now = Instant.now() ;
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected  void onUpdate(){
        this.updatedAt = Instant.now();
    }

    public static Letter from(User user, Funding funding, LetterCreateDTO dto){
        Letter letter  = Letter.builder()
                .funding(funding)
                .user(user)
                .comment(dto.getComment())
                .image(dto.getImage())
                .access(LetterPrivateMapper.fromClient(dto.getAccess()))
                .build();
        return letter;
    }

    public static LettersDTO toDTO(Letter letter){return new LettersDTO(letter);}
}