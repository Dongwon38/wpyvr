# WPYVR Hub Integration — Engineering Overview

> 목적: 이 문서는 다른 AI 에이전트 또는 신규 엔지니어가 WPYVR 허브 연동을 빠르게 이해하고, 문제를 재현·디버깅·개선할 수 있도록 핵심 구조와 파일, 테스트 방법을 요약한 레퍼런스입니다.

---

## 1. 시스템 개요

| 레이어 | 주요 책임 | 핵심 파일/디렉터리 |
|--------|-----------|--------------------|
| 멤버 워드프레스 (보내는 쪽) | 관리자 UI에서 허브 API URL/토큰 설정, 게시물 선택 푸시, 테스트 호출, publish 훅 기반 자동 푸시 | `package/plugins/wpyvr-connect/` |
| 허브 워드프레스 (받는 쪽) | Firebase 토큰 검증, pending 저장, raw term 보존, 분류 맵핑, 좋아요/댓글/트렌드, 로깅/알림 | `package/headless-theme/inc/wpyvr-connect-*.php` |
| 프런트엔드 (Next.js) | 허브 게시물 최신/인기/트렌딩 뷰, 상세 페이지 좋아요/댓글 UI, 허브 REST 호출 | `front-end/src/app/hub/`, `front-end/src/components/hub/`, `front-end/src/lib/hubApi.ts` |
| 문서·테스트 | 변경 이력 및 체크리스트, QA/모니터링 시나리오 | `INTEGRATION_PLAN.md`, `qa-checklist.md`, 현재 문서 |

데이터 플로우:

1. 멤버 사이트에서 관리자가 `WPYVR Connect` 플러그인 페이지에서 포스트를 선택하거나 publish 시 자동 푸시 → 허브 API `/wp-json/hub/v1/receive-post`.
2. 허브는 Firebase 토큰 검증 → UID ↔ WordPress user_id 매핑 → 포스트를 `pending`으로 생성하고 raw 분류/작성자/썸네일 정보를 메타로 저장.
3. 관리자 `Hub → Incoming Posts` 화면에서 raw category/tag를 허브 표준 분류에 매핑 후 Publish Now 실행.
4. 좋아요/댓글/트렌드 지표는 `/wp-json/hub/v1/like`, WP 댓글, 크론(`wpyvr_hub_trend_event`)을 통해 update → 프런트엔드가 `hubApi.ts`로 조회.
5. 모든 실패 이벤트는 `/wp-content/logs/hub.log`에 기록되고, 3회 연속 실패 시 관리자에게 이메일 알림 전송.

---

## 2. 구성 요소별 상세

### 2.1 멤버 플러그인 — `package/plugins/wpyvr-connect/`

| 파일 | 설명 |
|------|------|
| `wpyvr-connect.php` | 플러그인 부트스트랩, 옵션 키(`WPYVR_CONNECT_OPTION_KEY`), publish 훅, 관리자 스타일 enqueue |
| `inc/admin-settings.php` | `WPYVR Connect` 메뉴 / 설정 화면 / 수동 푸시 / 테스트 버튼 / recent log 표시 |
| `inc/push-handler.php` | 게시물 payload 생성, `wp_remote_post` 호출, 결과 로그 & 메타 `_wpyvr_last_*` 저장 |
| `assets/admin.css` | 관리자 UI 스타일 (`.wpyvr-*` 클래스) |

주요 관리자 URL: `wp-admin/admin.php?page=wpyvr-connect`   
설정 값: `hub_api_url`, `push_token`, `origin_site`, `auto_push`  
메타 키: `_wpyvr_last_push_status`, `_wpyvr_last_push_message`, `_wpyvr_last_push_log`

### 2.2 허브 워드프레스 — `package/headless-theme/inc/wpyvr-connect-*.php`

| 파일 | 기능 |
|------|------|
| `wpyvr-connect-hub.php` | `/wp-json/hub/v1/receive-post` 수신, Firebase 검증(`WPYVR_FIREBASE_API_KEY`), pending 저장, 메타+로그 기록 |
| `wpyvr-connect-admin.php` | 관리자 `Hub → Incoming Posts` 화면, raw term 노출, 추천, term 생성/맵핑 저장, Publish Now |
| `wpyvr-connect-helpers.php` | pending 쿼리, raw/meta decode, term 추천·맵핑(`hub_term_map`), 로그 래퍼, IP hash |
| `wpyvr-connect-like.php` | `/wp-json/hub/v1/like` (POST/DELETE), `/wp-json/hub/v1/posts/<id>/stats`, Firebase or 익명 actor 식별 |
| `wpyvr-connect-trend.php` | 포스트 메타 REST 노출, 댓글 hook로 `comments_count` 갱신, `wpyvr_hub_trend_event` 크론으로 hot score 공식 적용 |
| `wpyvr-connect-logger.php` | `/wp-content/logs/` 생성, `wpyvr_hub_log_file()`, 3회 실패 시 관리자 이메일 경고 |

메타 키:  
`hub_source_site`, `hub_source_slug`, `hub_source_author`, `hub_featured_image_url`, `hub_raw_categories`, `hub_raw_tags`, `_hub_likes_count`, `_hub_comments_count`, `_hub_hot_score`.

### 2.3 프런트엔드 — `front-end`

- `src/lib/hubApi.ts`: 허브 포스트/통계/좋아요/댓글 REST 래퍼 (`fetchHubPosts`, `fetchHubPostBySlug`, `likeHubPost`, `submitHubComment` 등). 환경 변수 `NEXT_PUBLIC_HUB_WORDPRESS_URL`.
- 컴포넌트:
  - `components/hub/HubTabs.tsx`, `HubPostList.tsx`, `HubPostCard.tsx` — 최신/인기/트렌딩 탭 UI.
  - `components/hub/HubPostDetail.tsx` — 상세 페이지 본문 + `HubLikeButton`, `HubCommentForm`.
  - `components/hub/HubLikeButton.tsx`, `HubCommentForm.tsx` — 실시간 좋아요/댓글 제출 UI.
- 페이지:
  - `app/hub/page.tsx` → 목록 탭.
  - `app/hub/[slug]/page.tsx` → 상세.

### 2.4 데이터 스키마 & 문서

| 파일 | 내용 |
|------|------|
| `package/hub-integration-schema.sql` | `wp_user_profiles` 확장, `wp_hub_term_map`, `wp_hub_likes`, `wp_hub_push_logs` DDL |
| `INTEGRATION_PLAN.md` | 체크리스트, 변경 기록, 운영 가이드, 테스트 진행 현황 |
| `qa-checklist.md` | Smoke 테스트 + 모니터링 점검 항목 |
| `HUB_INTEGRATION_OVERVIEW.md` (현재 문서) | 구조 요약 |

---

## 3. 주요 REST Endpoints

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/wp-json/hub/v1/receive-post` | Firebase Bearer 토큰 검증 후 post를 pending으로 저장 |
| POST / DELETE | `/wp-json/hub/v1/like` | 좋아요 추가/취소 (Firebase 또는 익명 IP hash) |
| GET | `/wp-json/hub/v1/posts/{id}/stats` | likes/comments/hot score 조회 |
| POST | `/wp-json/wp/v2/comments` | 프런트엔드에서 댓글 등록 (`firebase_token` 지원) |
| GET | `/wp-json/wp/v2/posts` | `_hub_*` 메타가 REST로 노출되므로 정렬/필터 가능 |

**멤버 사이트 → 허브 요청 형식 (요약)**  
```json
{
  "title": "...",
  "content": "<p>...</p>",
  "excerpt": "...",
  "slug": "post-slug",
  "featured_image": "https://...",
  "categories": ["카페", "디저트"],
  "tags": ["라떼", "핸드드립"],
  "author": "홍길동",
  "source": "https://userblog.com"
}
```

---

## 4. 관리자 워크플로우

1. **WPYVR Connect 플러그인 설정**
   - `허브 API URL`, `Push Token`, `Origin Site URL`, `자동 푸시` 여부 입력.
   - `연결 테스트` 버튼으로 Firebase/허브 인증 확인.
   - `콘텐츠 목록 및 수동 푸시`에서 선택해 전송(로그 확인 가능).

2. **허브 Incoming Posts 검수**
   - `Hub → Incoming Posts` 메뉴에서 pending 글/Raw terms 확인.
   - 추천 분류 자동 채워짐(50% 이상 유사도) → 수동 선택/신규 생성 가능.
   - `Publish Now` 클릭 시:
     - 허브 분류를 적용하고 `post_status=publish`.
     - `_hub_*` 지표 초기화.
     - 로그 테이블(`hub_push_logs`) 및 파일(`hub.log`) 기록.

3. **좋아요/댓글/트렌드**
   - 프런트엔드가 `/hub/v1/like` 및 `/posts/{id}/stats` 호출.
   - 댓글은 기본 WP 폼이나 Next.js 컴포넌트(토큰 전달)로 등록 → 자동으로 Firebase 사용자 매핑.
   - `wpyvr_hub_trend_event` (hourly)로 신선도 가중치 포함 hot score 재계산.

4. **로그 & 알림**
   - `/wp-content/logs/hub.log`에 모든 이벤트 기록.
   - 30분 내 동일 오류 3회 발생 시 관리자 이메일 알림.

---

## 5. 테스트 & 디버깅 가이드

1. **환경 변수/키 확인**
   - 멤버 사이트: 허브 API URL, Push Token.
   - 허브: `WPYVR_FIREBASE_API_KEY`, `default_post_user` 옵션 등.
   - 프런트엔드: `NEXT_PUBLIC_HUB_WORDPRESS_URL`.

2. **QA 체크리스트 (`qa-checklist.md`)**  
   - 푸시 → pending 저장, raw 메타 검증  
   - 잘못된 토큰 → 403 + 로그  
   - 맵핑 UI에서 저장/Publish flow 확인  
   - 좋아요 중복 방지, hot score 공식 검증  
   - `/wp-content/logs/hub.log` 생성 및 3회 실패 알림  

3. **문제 발생 시 빠른 점검 절차**
   - **푸시 실패**: 멤버 플러그인 `_wpyvr_last_*` 메타 & 관리자 UI 로그 → 허브 `hub.log`/`hub_push_logs` 확인.
   - **Firebase 인증 오류**: 허브 `.env` 또는 `wp-config.php`에 `WPYVR_FIREBASE_API_KEY` 설정 여부 체크.
   - **분류 미적용**: `hub_term_map`에 매핑 기록 (source_site/tax/term) 존재 여부, Publish 전후 `wp_set_post_terms` 호출 확인.
   - **좋아요/트렌드 문제**: `wp_hub_likes` 데이터, `_hub_*` 메타 값, 크론 `wpyvr_hub_trend_event` 스케줄 상태 `wp cron event list`.
   - **프런트 표시 오류**: `hubApi.ts` 호출 URL, REST 응답에 `_hub_*` 메타 노출되는지 확인 (`register_post_meta` 참고).

4. **명령형 디버깅 스니펫**
   - `wp option get wpyvr_connect_settings`
   - `wp cron event run wpyvr_hub_trend_event`
   - `wp user meta get <id> firebase_uid`
   - `wp post meta get <post_id> hub_push_log`

---

## 6. 향후 개선 아이디어

- **Term 추천 품질**: 현재는 `similar_text` 기반 50% 임계값 → 향후 n-gram 또는 사전 기반 추천 도입 가능.
- **실시간 알림**: Slack/Discord Webhook 연동 추가.
- **분류 맵핑 배치**: Pending 글이 많을 때 일괄 선택/맵핑 기능.
- **프런트엔드 캐싱**: 인기/트렌딩 탭도 ISR 또는 캐시 레이어 도입으로 응답 최적화.
- **테스트 자동화**: Playwright/E2E 시나리오로 푸시~Publish 흐름 자동 검증.

---

## 7. 참고 링크 / 파일 맵

- 멤버 플러그인: `package/plugins/wpyvr-connect/`
- 허브 인클루드: `package/headless-theme/inc/wpyvr-connect-*.php`
- 프런트 허브 페이지: `front-end/src/app/hub/` + `front-end/src/components/hub/`
- 문서: `INTEGRATION_PLAN.md`, `qa-checklist.md`, `HUB_INTEGRATION_OVERVIEW.md`
- 스키마: `package/hub-integration-schema.sql`

필요 시 이 문서를 최신 상태로 유지하면서, 신규 변경 사항(예: API 확장, UI 개편)을 “구성 요소별 상세”와 “테스트 & 디버깅” 절에 추가해 주세요.
