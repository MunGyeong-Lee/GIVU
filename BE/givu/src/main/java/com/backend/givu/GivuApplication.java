package com.backend.givu;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.redis.repository.configuration.EnableRedisRepositories;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableKafka
@EnableScheduling
@SpringBootApplication
//Spring Data Redis에서 리포지토리 인터페이스를 인식하고 자동으로 구현체를 만들어주는 설정
//@EnableRedisRepositories(basePackages = "com.backend.givu.model.repository")
public class GivuApplication {

	public static void main(String[] args) {
		SpringApplication.run(GivuApplication.class, args);
	}

}
