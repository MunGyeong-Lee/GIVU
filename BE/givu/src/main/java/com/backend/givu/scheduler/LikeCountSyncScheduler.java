package com.backend.givu.scheduler;

import com.backend.givu.model.entity.Product;
import com.backend.givu.model.repository.ProductRepository;
import com.backend.givu.model.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class LikeCountSyncScheduler {

    private final ProductRepository productRepository;
    private final ProductService productService;

    @Scheduled(cron = "0 0 3 * * *") // 매일 새벽 3시에 실행
    public void syncLikeCountsToDatabase() {
        log.info("🌀 Like count 동기화 배치 시작");

        List<Product> allProducts = productRepository.findAll();

        for (Product product : allProducts) {
            long redisCount = productService.getLikeCount(product.getId());
            int likeCount = (int)redisCount;
            product.setFavorite(likeCount);
        }

        productRepository.saveAll(allProducts);

        log.info("✅ Like count 동기화 완료 - {}개 상품", allProducts.size());
    }
}
