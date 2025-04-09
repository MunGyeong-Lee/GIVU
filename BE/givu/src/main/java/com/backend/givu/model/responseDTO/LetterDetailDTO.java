package com.backend.givu.model.responseDTO;

import com.backend.givu.model.entity.Letter;
import com.backend.givu.util.DateTimeUtil;
import com.backend.givu.util.mapper.LetterPrivateMapper;
import lombok.*;

import java.time.LocalDateTime;



@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class LetterDetailDTO {
    private int letterId;
    private boolean creator;
    private int funding;
    private UserSimpleInfoDTO user;
    private String comment;
    private String image;
    private String access;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean hidden; // 💡 시스템이 내용 가렸는지 여부

    public LetterDetailDTO(Letter letter, Long currentUserId) {
        this.letterId = letter.getId();
        this.funding = letter.getFunding().getId();
        this.comment = letter.getComment();
        this.image = letter.getImage();
        this.access = LetterPrivateMapper.toClient(letter.getAccess());
        this.createdAt = DateTimeUtil.toLocalDateTime(letter.getCreatedAt());
        this.updatedAt = DateTimeUtil.toLocalDateTime(letter.getUpdatedAt());
        this.user = new UserSimpleInfoDTO(
                letter.getUser().getId(),
                letter.getUser().getNickname(),
                letter.getUser().getProfileImage()
        );
        this.creator = letter.getUser().getId().equals(currentUserId);

        boolean isPrivate = "비밀".equalsIgnoreCase(this.access);
        boolean isFundingOwner = letter.getFunding().getUser().getId().equals(currentUserId);

        if (isPrivate && !(this.creator || isFundingOwner)) {
            this.comment = "비밀 댓글입니다.";
            this.hidden = true;
        } else {
            this.comment = letter.getComment();
            this.hidden = false;
        }
    }

}

