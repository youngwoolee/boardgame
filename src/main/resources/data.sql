-- 테스트용 어드민 사용자 추가 (비밀번호: Passw0rd)
INSERT INTO member (user_id, name, password, email, type, role, is_registered, created_at, updated_at)
VALUES ('admin', '관리자', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'admin@test.com', 'app', 'ROLE_ADMIN', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 테스트용 대기 중인 사용자들 추가
INSERT INTO member (user_id, name, password, email, type, role, is_registered, created_at, updated_at)
VALUES ('user1', '테스트사용자1', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'user1@test.com', 'app', 'ROLE_PENDING', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO member (user_id, name, password, email, type, role, is_registered, created_at, updated_at)
VALUES ('user2', '테스트사용자2', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'user2@test.com', 'kakao', 'ROLE_PENDING', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO member (user_id, name, password, email, type, role, is_registered, created_at, updated_at)
VALUES ('user3', '테스트사용자3', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'user3@test.com', 'app', 'ROLE_PENDING', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO member (user_id, name, password, email, type, role, is_registered, created_at, updated_at)
VALUES ('user4', '테스트사용자4', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'user4@test.com', 'naver', 'ROLE_PENDING', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO member (user_id, name, password, email, type, role, is_registered, created_at, updated_at)
VALUES ('user5', '테스트사용자5', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'user5@test.com', 'app', 'ROLE_PENDING', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
