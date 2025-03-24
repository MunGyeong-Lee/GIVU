package com.backend.givu.controller;

import com.backend.givu.model.dto.UsersDTO;
import com.backend.givu.model.entity.User;
import com.backend.givu.model.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "User", description = "사용자 관련 API")
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @Operation(summary = "사용자 등록", description = "카카오 연동 정보를 바탕으로 새로운 사용자를 등록합니다.")
    @PostMapping
    public ResponseEntity<User> saveUser(@RequestBody UsersDTO dto) {
        User savedUser = userService.saveUser(dto);
        return ResponseEntity.ok(savedUser);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<User> findUser(@PathVariable long userId){
        User user = userService.getUserById(userId);
        return ResponseEntity.ok(user);
    }
}
