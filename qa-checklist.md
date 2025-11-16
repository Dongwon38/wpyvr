# QA & Monitoring Checklist

## Smoke Tests
- [ ] **푸시 결과 확인**: 허브 관리자 화면 `Hub → Incoming Posts`에서 최신 전송 글이 나타나는지, `hub_push_logs`와 `/wp-content/logs/hub.log`에 성공/실패 로그가 남는지 확인한다.
- [ ] **Firebase 토큰 검증**: 잘못된 Bearer 토큰으로 `/wp-json/hub/v1/receive-post`를 호출했을 때 403 응답과 파일/DB 로그가 생성되는지 확인한다.
- [ ] **Pending 글 생성**: 멤버 플러그인에서 선택 전송 후 허브에서 `post_status=pending` 인 글이 생성되고 raw meta가 저장되는지 확인한다.
- [ ] **카테고리 맵핑 저장**: Incoming Posts 화면에서 raw term을 허브 분류와 매칭하고, `hub_term_map` 테이블/포스트 분류가 동시에 갱신되는지 점검한다.
- [ ] **좋아요 중복 방지**: 동일 사용자 혹은 동일 IP에서 반복 호출 시 `hub_likes`에 1건만 저장되고 카운트가 정확히 유지되는지 확인한다.
- [ ] **트렌드 계산**: 좋아요/댓글/시간 경과에 따라 `_hub_hot_score` 값이 `2likes + comments + freshness` 공식을 따르는지, 크론 실행 후 값이 갱신되는지 검증한다.

## Monitoring & Alerting
- `/wp-content/logs/` 디렉토리가 자동 생성되며 `hub.log`에 모든 실패 이벤트가 적재되는지 확인한다.
- 동일 유형의 API 실패가 3회 이상 발생하면 관리자가 이메일 알림을 수신하는지 테스트한다.
