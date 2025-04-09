package com.backend.givu.controller;

import com.amazonaws.Response;
import com.backend.givu.model.entity.CustomUserDetail;
import com.backend.givu.model.responseDTO.ApiResponse;
import com.backend.givu.model.responseDTO.UserSimpleInfoDTO;
import com.backend.givu.model.service.FriendService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Friend", description = "친구관련 API")
@RestController
@RequestMapping("/friends")
@RequiredArgsConstructor
@Slf4j
public class FriendController {

    private final FriendService friendService;

    /**
     * 친구 추가
     */
    @Operation(summary = "친구 추가", description = "친구를 추가합니다.")
    @PostMapping("/{friendId}")
    public ResponseEntity<ApiResponse<Void>> addFriend(@AuthenticationPrincipal CustomUserDetail userDetail,
                                                      @PathVariable Long friendId) {
        Long userId = userDetail.getId();
        friendService.addFriend(userId, friendId);
        return ResponseEntity.ok().build();
    }

    /**
     * 친구 목록 조회
     */
    @Operation(summary = "친구 목록 조회", description = "로그인한 사용자의 친구 목록을 조회합니다.")
    @GetMapping
    public ResponseEntity<ApiResponse<List<UserSimpleInfoDTO>>> getFriends(@AuthenticationPrincipal CustomUserDetail userDetail) {
        Long userId = userDetail.getId();
        return ResponseEntity.ok(friendService.getFriends(userId));
    }
}