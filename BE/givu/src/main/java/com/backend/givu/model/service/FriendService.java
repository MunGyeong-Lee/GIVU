package com.backend.givu.model.service;

import com.backend.givu.model.entity.Friend;
import com.backend.givu.model.entity.User;
import com.backend.givu.model.repository.FriendRepository;
import com.backend.givu.model.repository.UserRepository;
import com.backend.givu.model.responseDTO.ApiResponse;
import com.backend.givu.model.responseDTO.UserSimpleInfoDTO;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FriendService {

    private final FriendRepository friendRepository;
    private final UserRepository userRepository;

    /**
     * 친구 추가 (양방향 저장)
     */
    public void addFriend(Long userId, Long friendId) {
        if (userId.equals(friendId)) {
            throw new IllegalArgumentException("자기 자신을 친구로 추가할 수 없습니다.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("해당 유저가 존재하지 않습니다."));
        User friend = userRepository.findById(friendId)
                .orElseThrow(() -> new EntityNotFoundException("친구 대상 유저가 존재하지 않습니다."));

        // 이미 친구인지 확인
        if (friendRepository.existsByUserAndFriend(user, friend)) {
            throw new IllegalStateException("이미 친구입니다.");
        }

        // 양방향 친구 관계 저장
        friendRepository.save(new Friend(user, friend));
        friendRepository.save(new Friend(friend, user));
    }

    /**
     * 친구 목록 조회
     */
    public ApiResponse<List<UserSimpleInfoDTO>> getFriends(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("해당 유저가 존재하지 않습니다."));

        List<Friend> friends = friendRepository.findByUserWithFriend(user.getId());

        return ApiResponse.success(friends.stream()
                .map(friend -> new UserSimpleInfoDTO(friend.getFriend()))
                .collect(Collectors.toList()));
    }

    public ApiResponse<List<UserSimpleInfoDTO>> searchFriends(String username) {
        List<User> users = userRepository.findByNicknameContaining(username);

        List<UserSimpleInfoDTO> userList = users.stream()
                .map(user -> new UserSimpleInfoDTO(user.getId(), user.getNickname(), user.getProfileImage()))
                .collect(Collectors.toList());

        return ApiResponse.success(userList);
    }
}
