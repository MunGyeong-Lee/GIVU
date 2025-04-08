//package com.backend.givu.kafka;
//
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.kafka.config.KafkaListenerEndpointRegistry;
//import org.springframework.kafka.listener.MessageListenerContainer;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
////@RequiredArgsConstructor
//@RequestMapping("/kafka")
//@Slf4j
//public class KafkaController {
//
//    @Autowired
////    @Qualifier("internalKafkaListenerEndpointRegistry")
//    private KafkaListenerEndpointRegistry registry;
//
//    @PostMapping("/kafka/start-debug")
//    public String startConsumerWithLog() {
//        MessageListenerContainer container = registry.getListenerContainer("transferListener");
//        if (container == null) {
//            return "❌ transferListener not found in registry.";
//        }
//
//        try {
//            if (!container.isRunning()) {
//                container.start();
//                log.info("🟢 Kafka 컨테이너 start() 호출 완료");
//                Thread.sleep(2000); // 상태 반영 시간 확보
//                return String.format("✅ start 호출 후 상태 - isRunning: %b, isPaused: %b", container.isRunning(), container.isContainerPaused());
//            } else {
//                return "⏸️ 이미 실행 중";
//            }
//        } catch (Exception e) {
//            log.error("❌ Kafka listener start 중 오류 발생", e);
//            return "❌ Kafka listener start 실패: " + e.getMessage();
//        }
//    }
//
//    @PostMapping("/stop")
//    public String stopConsumer() {
//        MessageListenerContainer container = registry.getListenerContainer("transferListener");
//        if (container.isRunning()) {
//            container.stop();
//            return "🛑 Kafka Consumer Stopped";
//        }
//        return "⏸️ Kafka Consumer Already Stopped";
//    }
//
//    @PostMapping("/status")
//    public String checkKafkaListenerStatus() {
//        MessageListenerContainer container = registry.getListenerContainer("transferListener");
//
//        if (container == null) {
//            return "❌ 리스너 ID 'transferListener' 를 찾을 수 없습니다!";
//        }
//
//        return String.format("✅ 리스너 상태 - isRunning: %b, isPaused: %b", container.isRunning(), container.isContainerPaused());
//    }
//
//
//
//
//
//
//}