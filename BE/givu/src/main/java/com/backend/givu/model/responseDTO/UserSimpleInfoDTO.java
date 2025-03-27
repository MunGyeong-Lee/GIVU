package com.backend.givu.model.responseDTO;


import com.backend.givu.model.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserSimpleInfoDTO {
    private Long userId;
    private String nickName;
    private String image;

    public UserSimpleInfoDTO(User user){
        this.userId = user.getId();
        this.nickName = user.getNickname();
        this.image = user.getProfileImage();
    }
}
