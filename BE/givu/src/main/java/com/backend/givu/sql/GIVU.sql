-- ENUM 타입 정의
CREATE TYPE funding_category AS ENUM ('BIRTHDAY', 'HOUSEWARMING', 'WEDDING', 'GRADUATION', 'EMPLOYMENT', 'CHILDBIRTH', 'ETC');
CREATE TYPE funding_scope AS ENUM ('PUBLIC', 'PRIVATE');
CREATE TYPE funding_status AS ENUM ('PENDING', 'COMPLETED', 'CANCELED', 'SHIPPING', 'DELIVERED');
CREATE TYPE letter_private AS ENUM ('PUBLIC', 'PRIVATE');
CREATE TYPE participant_refund_status AS ENUM ('REFUND', 'NOT_REFUND');
CREATE TYPE payment_status AS ENUM ('PENDING', 'SUCCESS', 'FAIL');
CREATE TYPE payment_transaction_type AS ENUM ('FUNDING', 'PRODUCT');
CREATE TYPE bank_transaction_type AS ENUM ('DEPOSIT', 'WITHDRAWAL');
CREATE TYPE product_category AS ENUM ('ELECTRONICS', 'CLOTHING', 'BEAUTY', 'HOMEAPPLIANCES', 'SPORTS', 'FOOD', 'TOYS', 'FURNITURE', 'LIVING', 'OTHERS');
CREATE TYPE user_gender AS ENUM ('MALE', 'FEMALE');
CREATE TYPE user_age_range AS ENUM ('TEENAGER', 'YOUNG_ADULT', 'ADULT', 'MIDDLE_AGED', 'SENIOR');

-- users 테이블
CREATE TABLE users (
                       user_id BIGSERIAL PRIMARY KEY,
                       kakao_id BIGINT NULL,
                       nickname VARCHAR(100) NULL,
                       email VARCHAR(255) NULL,
                       birth DATE NULL,
                       profile_image VARCHAR(500) NULL,
                       address TEXT NULL,
                       gender user_gender NULL,
                       age_range user_age_range NULL,
                       balance INT NULL,
                       created_at TIMESTAMP DEFAULT now(),
                       updated_at TIMESTAMP DEFAULT now()
);

-- fundings 테이블
CREATE TABLE fundings (
                          funding_id SERIAL PRIMARY KEY,
                          user_id BIGINT NOT NULL,
                          product_id INT NULL,
                          title VARCHAR(20) NOT NULL,
                          body TEXT NULL,
                          description VARCHAR(255) NULL,
                          category funding_category NULL,
                          category_name VARCHAR(20) NULL,
                          scope funding_scope NULL,
                          participants_number INT NULL,
                          funded_amount INT NULL,
                          status funding_status NULL,
                          image VARCHAR(255) NULL,
                          image2 VARCHAR(255) NULL,
                          image3 VARCHAR(255) NULL,
                          created_at TIMESTAMP DEFAULT now(),
                          updated_at TIMESTAMP DEFAULT now(),
                          CONSTRAINT FK_users_TO_fundings FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);

-- favorites 테이블
CREATE TABLE favorites (
                           user_id BIGINT NOT NULL,
                           funding_id INT NOT NULL,
                           PRIMARY KEY (user_id, funding_id),
                           CONSTRAINT FK_users_TO_favorites FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
                           CONSTRAINT FK_fundings_TO_favorites FOREIGN KEY (funding_id) REFERENCES fundings (funding_id) ON DELETE CASCADE
);

-- letters 테이블
CREATE TABLE letters (
                         letter_id SERIAL PRIMARY KEY,
                         funding_id INT NOT NULL,
                         user_id BIGINT NOT NULL,
                         comment TEXT NOT NULL,
                         image VARCHAR(255) NULL,
                         access letter_private NULL,
                         created_at TIMESTAMP DEFAULT now(),
                         updated_at TIMESTAMP DEFAULT now(),
                         CONSTRAINT FK_users_TO_letters FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
                         CONSTRAINT FK_fundings_TO_letters FOREIGN KEY (funding_id) REFERENCES fundings (funding_id) ON DELETE CASCADE
);

-- products 테이블
CREATE TABLE products (
                          product_id SERIAL PRIMARY KEY,
                          product_name VARCHAR(100) NOT NULL,
                          category product_category NULL,
                          price INT NOT NULL,
                          image VARCHAR(255) NULL,
                          favorite INT NULL,
                          star FLOAT NULL,
                          created_at TIMESTAMP DEFAULT now()
);

-- payments 테이블
CREATE TABLE payments (
                          transaction_id SERIAL PRIMARY KEY,
                          user_id BIGINT NOT NULL,
                          related_funding_id INT NOT NULL,
                          related_product_id INT NOT NULL,
                          transaction_type payment_transaction_type NULL,
                          amount INT NULL,
                          status payment_status NULL,
                          date TIMESTAMP DEFAULT now(),
                          CONSTRAINT FK_users_TO_payments FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
                          CONSTRAINT FK_fundings_TO_payments FOREIGN KEY (related_funding_id) REFERENCES fundings (funding_id) ON DELETE CASCADE,
                          CONSTRAINT FK_products_TO_payments FOREIGN KEY (related_product_id) REFERENCES products (product_id) ON DELETE CASCADE
);

-- participants 테이블
CREATE TABLE participants (
                              user_id BIGINT NOT NULL,
                              funding_id INT NOT NULL,
                              funding_amount INT NULL,
                              joined_at TIMESTAMP DEFAULT now(),
                              refund_status participant_refund_status NULL,
                              PRIMARY KEY (user_id, funding_id),
                              CONSTRAINT FK_users_TO_participants FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
                              CONSTRAINT FK_fundings_TO_participants FOREIGN KEY (funding_id) REFERENCES fundings (funding_id) ON DELETE CASCADE
);

-- reviews 테이블
CREATE TABLE reviews (
                         review_id SERIAL PRIMARY KEY,
                         funding_id INT NOT NULL,
                         user_id BIGINT NOT NULL,
                         comment TEXT NOT NULL,
                         image VARCHAR(500) NULL,
                         created_at TIMESTAMP DEFAULT now(),
                         updated_at TIMESTAMP DEFAULT now(),
                         visit BIGINT NULL,
                         CONSTRAINT FK_users_TO_reviews FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
                         CONSTRAINT FK_fundings_TO_reviews FOREIGN KEY (funding_id) REFERENCES fundings (funding_id) ON DELETE CASCADE
);

-- bank_transaction 테이블
CREATE TABLE bank_transaction (
                                  transaction_key VARCHAR(255) NOT NULL,
                                  user_id BIGINT NOT NULL,
                                  transaction_type bank_transaction_type NULL,
                                  amount INT NULL,
                                  bank_name VARCHAR(20) NULL,
                                  date TIMESTAMP DEFAULT now(),
                                  PRIMARY KEY (transaction_key, user_id),
                                  CONSTRAINT FK_users_TO_bank_transaction FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);
