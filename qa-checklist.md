# QA & Monitoring Checklist

## Smoke Tests
- [ ] **푸시 결과 확인**: 허브 관리자 화면 `Hub → Incoming Posts`에서 최신 전송 글이 나타나는지, `hub_push_logs`와 `/wp-content/logs/hub.log`에 성공/실패 로그가 남는지, `wp_hub_incoming_posts`에 새로운 레코드가 생성되는지 확인한다.
- [ ] **Firebase 토큰 검증**: 잘못된 Bearer 토큰으로 `/wp-json/hub/v1/receive-post`를 호출했을 때 403 응답과 파일/DB 로그가 생성되는지 확인한다.
- [ ] **Incoming 테이블 적재**: 멤버 플러그인에서 전송 후 `wp_hub_incoming_posts.status = pending` 레코드가 생기고, `wp_posts`에는 추가 글이 생기지 않는지 확인한다.
- [ ] **카테고리 맵핑 저장**: Incoming Posts 화면에서 raw term을 허브 분류와 매칭하고, `hub_term_map` 테이블/포스트 분류가 동시에 갱신되는지 점검한다.
- [ ] **Publish 플로우**: `Publish Now` 실행 시 `wp_posts`에 새 글이 `publish` 상태로 생성되고, `hub_incoming_posts`가 `published`/`published_post_id`로 업데이트되며 `_hub_*` 메타가 초기화되는지 확인한다.
- [ ] **Reject/삭제 시 영향 범위**: 레코드를 삭제하거나 `status`를 `rejected`로 전환할 때 `wp_posts` 데이터에는 영향이 없는지, 필요한 경우 `hub_incoming_posts`만 조정되는지 확인한다.
- [ ] **좋아요 중복 방지 & unlike CORS**: 동일 사용자 혹은 동일 IP에서 반복 호출 시 `hub_likes`에 1건만 저장되고 카운트가 정확히 유지되는지 확인하며, 브라우저에서 `DELETE /wp-json/hub/v1/like` 호출이 CORS 예외 없이 동작하는지 테스트한다.
- [ ] **트렌드 계산**: 좋아요/댓글/시간 경과에 따라 `_hub_hot_score` 값이 `2likes + comments + freshness` 공식을 따르는지, 크론 실행 후 값이 갱신되는지 검증한다.
- [ ] **Push Token 라이프사이클**: `/profile` 페이지에서 `custom-profile/v1/push-token` GET/POST/DELETE가 모두 동작하고, revoke 시 `wp_user_profiles`의 `push_token`/`hub_connected` 값이 리셋되는지, CORS 헤더가 `DELETE`를 허용하는지 확인한다.

## Monitoring & Alerting
- `/wp-content/logs/` 디렉토리가 자동 생성되며 `hub.log`에 모든 실패 이벤트가 적재되는지 확인한다.
- 동일 유형의 API 실패가 3회 이상 발생하면 관리자가 이메일 알림을 수신하는지 테스트한다.
