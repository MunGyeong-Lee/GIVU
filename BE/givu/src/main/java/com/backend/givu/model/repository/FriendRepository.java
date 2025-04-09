package com.backend.givu.model.repository;

import com.backend.givu.model.entity.Friend;
import com.backend.givu.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FriendRepository extends JpaRepository<Friend, Long> {

    List<Friend> findByUser(User user);

    @Query("SELECT f FROM Friend f JOIN FETCH f.friend WHERE f.user.id = :userId")
    List<Friend> findByUserWithFriend(@Param("userId") Long userId);

    boolean existsByUserAndFriend(User user, User friend);
}
