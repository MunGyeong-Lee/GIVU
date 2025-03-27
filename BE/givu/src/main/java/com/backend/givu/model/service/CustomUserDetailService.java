package com.backend.givu.model.service;

import com.backend.givu.exception.AuthErrorException;
import com.backend.givu.model.Enum.AuthErrorStatus;
import com.backend.givu.model.entity.CustomUserDetail;
import com.backend.givu.model.entity.User;
import com.backend.givu.model.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
/**
 * Spring Security에서 사용하는 인증용 사용자 정보를 불러오는 서비스
 * 로그인 시 "이 이메일에 해당하는 유저가 DB에 있는지 찾아서 인증에 사용될 객체를 만드는 역할
 */
public class CustomUserDetailService implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public CustomUserDetail loadUserByUsername(String email) throws UsernameNotFoundException{
        Optional<User> findUser = userRepository.findByEmail(email);
        if(findUser.isEmpty()){
            try{
                throw new AuthErrorException(AuthErrorStatus.GET_USER_FAILED);
            } catch (AuthErrorException e){
                throw new RuntimeException(e);
            }
        } else{
            return new CustomUserDetail(findUser.get());
        }
    }
}
