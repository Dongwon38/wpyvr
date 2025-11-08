# WordPress + Custom Tables Database Schema

## Overview
WPYVR 커뮤니티 사이트의 최종 데이터베이스 스키마입니다. WordPress 기본 테이블과 커스텀 테이블을 함께 사용합니다.

---

## 1. WordPress 기본 테이블 (사용 중)

### `wp_users`
WordPress 기본 사용자 테이블 - Firebase 인증과 연동

| Column | Type | Description |
|--------|------|-------------|
| ID | BIGINT(20) UNSIGNED | Primary Key |
| user_login | VARCHAR(60) | 로그인 ID (Firebase UID 사용) |
| user_pass | VARCHAR(255) | 비밀번호 (Firebase 인증 사용 시 랜덤 값) |
| user_nicename | VARCHAR(50) | URL-safe 닉네임 |
| user_email | VARCHAR(100) | 이메일 주소 |
| user_url | VARCHAR(100) | 사용자 웹사이트 |
| user_registered | DATETIME | 가입일 |
| user_activation_key | VARCHAR(255) | 활성화 키 |
| user_status | INT(11) | 사용자 상태 |
| display_name | VARCHAR(250) | 표시 이름 |

**인덱스:**
- PRIMARY KEY (ID)
- UNIQUE KEY user_login
- UNIQUE KEY user_email
- INDEX user_nicename

### `wp_usermeta`
WordPress 사용자 메타 테이블

| Column | Type | Description |
|--------|------|-------------|
| umeta_id | BIGINT(20) UNSIGNED | Primary Key |
| user_id | BIGINT(20) UNSIGNED | FK to wp_users.ID |
| meta_key | VARCHAR(255) | 메타 키 |
| meta_value | LONGTEXT | 메타 값 |

**사용 중인 meta_key:**
- `wp_capabilities` - 사용자 권한 (JSON)
- `firebase_uid` - Firebase UID 매핑

---

## 2. 커스텀 테이블

### `wp_user_profiles`
사용자 프로필 확장 정보

```sql
CREATE TABLE wp_user_profiles (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id BIGINT(20) UNSIGNED NOT NULL,
    nickname VARCHAR(100) DEFAULT NULL,
    bio TEXT DEFAULT NULL,
    avatar_url VARCHAR(255) DEFAULT NULL,
    position VARCHAR(255) DEFAULT NULL,
    specialties JSON DEFAULT NULL,
    company VARCHAR(255) DEFAULT NULL,
    website VARCHAR(255) DEFAULT NULL,
    member_type ENUM('member', 'expert') DEFAULT 'member',
    social_links JSON DEFAULT NULL,
    privacy_settings JSON DEFAULT NULL,
    last_active_at DATETIME DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (id),
    UNIQUE KEY user_id_unique (user_id),
    FOREIGN KEY (user_id) REFERENCES wp_users(ID) ON DELETE CASCADE,
    INDEX idx_last_active (last_active_at),
    INDEX idx_member_type (member_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**컬럼 상세:**

| Column | Type | Null | Default | Description |
|--------|------|------|---------|-------------|
| id | BIGINT(20) UNSIGNED | NO | - | Primary Key |
| user_id | BIGINT(20) UNSIGNED | NO | - | FK to wp_users.ID |
| nickname | VARCHAR(100) | YES | NULL | 사용자 닉네임 (필수) |
| bio | TEXT | YES | NULL | 자기소개 |
| avatar_url | TEXT | YES | NULL | 프로필 이미지 URL (Firebase 다운로드 URL 전체 저장 지원) |
| position | VARCHAR(255) | YES | NULL | 직책/직함 |
| specialties | JSON | YES | NULL | 전문 분야 배열 |
| company | VARCHAR(255) | YES | NULL | 소속 회사 |
| website | VARCHAR(255) | YES | NULL | 개인 웹사이트 |
| member_type | ENUM | NO | 'member' | 멤버 타입 (member/expert) |
| social_links | JSON | YES | NULL | 소셜 링크 배열 |
| privacy_settings | JSON | YES | NULL | 프라이버시 설정 |
| last_active_at | DATETIME | YES | NULL | 마지막 활동 시간 |
| created_at | DATETIME | NO | CURRENT_TIMESTAMP | 생성일 |
| updated_at | DATETIME | NO | CURRENT_TIMESTAMP | 수정일 (자동 업데이트) |

**JSON 필드 구조:**

```json
// specialties 예시
["React", "Node.js", "TypeScript", "MongoDB"]

// social_links 예시
[
  {"type": "github", "url": "https://github.com/username"},
  {"type": "linkedin", "url": "https://linkedin.com/in/username"}
]

// privacy_settings 예시
{
  "show_email": true,
  "show_position": true,
  "show_company": true,
  "show_website": true,
  "show_specialties": true
}
```

---

## 3. WordPress CPT (Custom Post Types)

### Hero Slides (`hero_slide`)
홈페이지 히어로 슬라이드

**ACF Fields:**
- `title` (text) - 슬라이드 제목
- `subtitle` (text) - 부제목
- `cta_text` (text) - CTA 버튼 텍스트
- `cta_link` (url) - CTA 버튼 링크
- `background_image` (image) - 배경 이미지

### Guides (`guide`)
커뮤니티 가이드/튜토리얼

**Taxonomy:**
- `guide_category` (hierarchical) - 가이드 카테고리

**ACF Fields:**
- 기본 WordPress 필드 사용 (title, content, featured_image, excerpt)

### Community Posts (`community_post`)
커뮤니티 게시글

**Taxonomy:**
- `community_tag` (non-hierarchical) - 게시글 태그

**ACF Fields:**
- 기본 WordPress 필드 사용
- `upvotes` (post_meta) - 추천 수

### Events (`event`)
이벤트/행사 정보

**Taxonomy:**
- `event_category` (hierarchical) - 이벤트 카테고리
- `event_tag` (non-hierarchical) - 이벤트 태그

**ACF Fields (group_event):**

| Field Key | Name | Type | Required | Description |
|-----------|------|------|----------|-------------|
| field_event_date | event_date | date_picker | YES | 이벤트 날짜 (Y-m-d) |
| field_event_start_time | start_time | time_picker | YES | 시작 시간 (H:i:s, UTC) |
| field_event_end_time | end_time | time_picker | YES | 종료 시간 (H:i:s, UTC) |
| field_event_location_title | location_title | text | YES | 장소 이름 |
| field_event_location_address | location_address | text | NO | 장소 주소 (구글맵 링크용) |
| field_event_link | event_link | url | NO | 등록/상세정보 링크 |
| field_event_image | image | image | NO | 이벤트 이미지 |

---

## 4. 데이터 흐름

### 사용자 생성 플로우

```
1. Firebase Authentication (Frontend)
   ↓
2. JWT 토큰 발급 (WordPress REST API)
   ↓
3. wp_users 테이블에 사용자 생성
   ↓
4. wp_usermeta에 firebase_uid 저장
   ↓
5. wp_user_profiles에 빈 프로필 생성 (선택적)
```

### 프로필 업데이트 플로우

```
1. Frontend: ProfileForm 작성
   ↓
2. PUT /wp-json/custom-profile/v1/update
   - Authorization: Bearer JWT
   ↓
3. JWT 검증 및 권한 확인
   ↓
4. wp_user_profiles INSERT/UPDATE
   ↓
5. wp_users.display_name 업데이트 (닉네임 변경 시)
   ↓
6. 성공 응답 반환
```

### 멤버 목록 조회 플로우

```
1. GET /wp-json/custom-profile/v1/members
   ↓
2. wp_user_profiles JOIN wp_users
   ↓
3. 프라이버시 설정 적용
   - show_email: false → email = null
   - show_position: false → position = null
   ↓
4. role 정보 추가 (wp_usermeta.wp_capabilities)
   ↓
5. last_active_at DESC 정렬
   ↓
6. JSON 응답 반환
```

---

## 5. 인덱스 최적화

### 추천 인덱스

```sql
-- wp_user_profiles 테이블
ALTER TABLE wp_user_profiles ADD INDEX idx_last_active (last_active_at);
ALTER TABLE wp_user_profiles ADD INDEX idx_member_type (member_type);

-- wp_usermeta 테이블 (WordPress 기본 제공)
-- INDEX meta_key (meta_key(191))

-- wp_postmeta 테이블 (ACF 쿼리 최적화)
ALTER TABLE wp_postmeta ADD INDEX meta_key_value (meta_key(191), meta_value(100));
```

---

## 6. 백업 및 마이그레이션

### 필수 백업 테이블

1. **사용자 데이터:**
   - `wp_users`
   - `wp_usermeta`
   - `wp_user_profiles`

2. **콘텐츠:**
   - `wp_posts` (모든 CPT 포함)
   - `wp_postmeta` (ACF 필드 포함)
   - `wp_terms`, `wp_term_relationships`, `wp_term_taxonomy`

3. **설정:**
   - `wp_options` (사이트 설정)

### 마이그레이션 스크립트

```sql
-- 프로필 테이블 초기화 (개발 환경)
TRUNCATE TABLE wp_user_profiles;

-- 테스트 데이터 삽입
INSERT INTO wp_user_profiles (user_id, nickname, bio, position, member_type, created_at, updated_at)
SELECT 
    ID,
    display_name,
    'Test bio',
    'Developer',
    'member',
    NOW(),
    NOW()
FROM wp_users
WHERE ID > 1; -- admin 제외
```

---

## 7. API 엔드포인트

### Custom Profile API

**Base URL:** `/wp-json/custom-profile/v1`

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/get` | GET | Required | 단일 사용자 프로필 조회 |
| `/update` | POST | Required | 프로필 생성/수정 |
| `/members` | GET | Public | 전체 멤버 목록 조회 |

### Custom Auth API

**Base URL:** `/wp-json/custom-auth/v1`

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/register` | POST | Public | Firebase UID로 WP 사용자 생성 |
| `/jwt` | POST | Public | JWT 토큰 발급 |
| `/verify` | POST | Required | JWT 토큰 검증 |

---

## 8. 보안 고려사항

### 데이터 접근 제어

1. **프로필 조회:**
   - 자신의 프로필: 모든 정보 표시
   - 타인의 프로필: 프라이버시 설정 적용

2. **프로필 수정:**
   - JWT 인증 필수
   - 본인 프로필만 수정 가능

3. **멤버 목록:**
   - 공개 API (인증 불필요)
   - 프라이버시 설정 자동 적용

### SQL Injection 방어

```php
// WordPress $wpdb->prepare() 사용
$wpdb->prepare("SELECT * FROM wp_user_profiles WHERE user_id = %d", $user_id);

// 배열 파라미터 처리
$wpdb->prepare("SELECT * FROM wp_users WHERE ID IN (" . implode(',', array_fill(0, count($ids), '%d')) . ")", ...$ids);
```

---

## 9. 성능 최적화

### 쿼리 최적화

```sql
-- 멤버 목록 (role, last_active 기준 정렬)
SELECT 
    p.*,
    u.user_email,
    u.display_name
FROM wp_user_profiles p
INNER JOIN wp_users u ON p.user_id = u.ID
WHERE p.last_active_at > DATE_SUB(NOW(), INTERVAL 6 MONTH)
ORDER BY 
    CASE 
        WHEN EXISTS(SELECT 1 FROM wp_usermeta WHERE user_id = u.ID AND meta_key = 'wp_capabilities' AND meta_value LIKE '%administrator%') THEN 1
        WHEN EXISTS(SELECT 1 FROM wp_usermeta WHERE user_id = u.ID AND meta_key = 'wp_capabilities' AND meta_value LIKE '%staff%') THEN 2
        ELSE 3
    END,
    p.last_active_at DESC
LIMIT 100;
```

### 캐싱 전략

1. **Object Cache (Redis/Memcached):**
   - 멤버 목록: 5분 TTL
   - 개별 프로필: 10분 TTL

2. **Frontend Cache:**
   - ISR (Incremental Static Regeneration): 60초
   - SWR (Stale-While-Revalidate) 전략

---

## 10. 데이터베이스 버전 관리

### 현재 버전: v1.0.0

**변경 이력:**

- **v1.0.0 (2025-11-07):**
  - 초기 스키마 생성
  - wp_user_profiles 테이블 추가
  - 프라이버시 설정 필드 추가
  - specialties JSON 필드 추가

**향후 계획:**

- v1.1.0: 알림 시스템 (wp_notifications 테이블)
- v1.2.0: 북마크 기능 (wp_user_bookmarks 테이블)
- v1.3.0: 팔로우 시스템 (wp_user_follows 테이블)

---

## 참고 자료

- [WordPress Database Schema](https://codex.wordpress.org/Database_Description)
- [ACF Database Storage](https://www.advancedcustomfields.com/resources/)
- [MySQL JSON Data Type](https://dev.mysql.com/doc/refman/8.0/en/json.html)
