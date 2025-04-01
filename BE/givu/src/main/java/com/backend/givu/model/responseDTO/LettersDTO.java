package com.backend.givu.model.responseDTO;

import com.backend.givu.model.Enum.LettersPrivate;
import com.backend.givu.model.entity.Funding;
import com.backend.givu.model.entity.Letter;
import com.backend.givu.model.entity.User;
import com.backend.givu.util.DateTimeUtil;
import com.backend.givu.util.mapper.LetterPrivateMapper;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class LettersDTO {
    private int letterId;
    private int funding;
    private UserSimpleInfoDTO user;
    private String comment;
    private String image;
    private String access;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public LettersDTO (Letter letter){
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
    }
}
