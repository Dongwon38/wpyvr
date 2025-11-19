# WPYVR Hub Integration 개발 계획

## 개요
- 멤버 개별 워드프레스 사이트에서 게시된 콘텐츠를 허브 워드프레스로 집결시켜 검수-퍼블리시 파이프라인을 자동화한다.
- Firebase 기반 인증 체계와 push token을 이용해 멤버 사이트와 허브 간 신뢰할 수 있는 연결을 수립한다.
- 허브에서는 원본 분류 정보를 메타로 보관하고, 표준 분류 UI를 통해 정규화 후 발행한다.
- 향후 좋아요, 댓글, 트렌드 지표까지 확장 가능한 데이터 스키마를 구축한다.

## 개발 단계별 체크리스트
- [x] 인증/보안: Firebase 토큰 검증 및 push_token 발급
- [x] 멤버 플러그인: API 설정 및 게시물 푸시 기능
- [x] 허브 API: 포스트 수신 및 pending 저장
- [x] 분류 맵핑 UI: raw_terms → hub_terms 정규화
- [x] 좋아요/댓글: REST API 및 트렌드 점수 계산
- [x] 테스트/로그/모니터링 구성

## 진행 현황
- **현재 상태:**  
  - WPYVR Connect 플러그인이 영어 UI로 정리되었고, Hub API URL 기본값/Origin Site 자동 감지가 활성화됨.  
  - Push Token은 허브 프로필 페이지(<https://wpyvr.bitebuddy.ca/profile>)에서 발급 → 플러그인 툴팁으로 안내.  
  - 프런트엔드 `/community` 페이지가 실시간 허브 데이터를 직접 소비하며 `/hub` 라우트는 제거됨.  
- **다음 단계:** QA 시나리오 실행, 알림 정책 튜닝, 배포 전 통합 리허설

## 변경 기록
| 날짜 | 변경 내용 | 담당 | 비고 |
|------|------------|------|------|
| 2025-11-08 | 초기 설계 및 스키마 확정 | AI Agent |  |
| 2025-11-15 | 멤버 플러그인/허브 API/스키마 초안 구현 | AI Agent |  |
| 2025-11-15 | Prompt 2: 멤버 플러그인 관리자 UI · 수동 푸시 기능 완성 | AI Agent | WPYVR Connect 플러그인 |
| 2025-11-15 | Prompt 3: 허브 수신 API·로그/알림 고도화 | AI Agent | wpyvr-connect-hub.php |
| 2025-11-15 | Prompt 4: 허브 관리자 맵핑 UI 및 헬퍼 추가 | AI Agent | wpyvr-connect-admin.php / wpyvr-connect-helpers.php |
| 2025-11-15 | Prompt 5: 좋아요·댓글·트렌드 시스템 통합 | AI Agent | wpyvr-connect-like.php / wpyvr-connect-trend.php |
| 2025-11-15 | Prompt 6: 허브 프론트엔드 및 사용 가이드 | AI Agent | front-end hub components |
| 2025-11-15 | Prompt 7: QA 체크리스트 · 모니터링 로거 | AI Agent | qa-checklist.md / wpyvr-connect-logger.php |
| 2025-11-17 | Frontend Community 통합 및 플러그인 영문화/기본값 업데이트 | AI Agent | `/community` 실데이터 연동, WPYVR Connect 기본값/툴팁 정비 |

## 사용 가이드
- **수신 글 검수 & 퍼블리시 절차**  
  1. 워드프레스 관리자 > `Hub → Incoming Posts`에서 대기 글을 확인한다.  
  2. Raw Categories/Tags를 확인하고 허브 표준 분류를 선택하거나 새 분류를 생성한다.  
  3. `맵핑 저장`으로 분류만 저장하거나 `Publish Now`로 즉시 발행한다(이때 likes/comments/hot score가 초기화된다).
- **카테고리 맵핑 관리**  
  - 저장된 맵핑은 `hub_term_map` 테이블에 축적되어 동일 사이트·용어 입력 시 자동 추천된다.  
  - 추천 정확도는 문자열 유사도(50% 이상) 기준이며, 필요 시 새 분류를 생성해 매핑을 덮어쓴다.  
  - 맵핑 변경 후 다시 Publish하면 최신 허브 분류가 반영된다.
- **트렌드 관리 규칙**  
  - Hot Score = `2 × likes + 1 × comments + freshness(48시간 내 0.2 가중)` 공식으로 계산된다.  
  - 좋아요/댓글 액션 시 즉시 재계산되며, 시간 경과에 따른 보정은 시간당 크론이 전체 게시물을 재평가한다.  
  - `/wp-json/hub/v1/posts/<id>/stats`로 프론트/모니터링 시스템이 실시간 점수를 조회할 수 있다.

## 테스트 진행 현황
| 테스트 | 상태 | 메모 |
|--------|------|------|
| 멤버 플러그인 → 허브 수신 파이프라인 | ✅ 완료 | 수동 푸시 → pending + raw meta 저장 확인 |
| Firebase 토큰 검증 실패 403 | ☐ 예정 | 잘못된 토큰으로 receive/like API 호출 |
| Hub Incoming Posts 맵핑/Publish 플로우 | ☐ 예정 | 저장/Publish Now 두 경로 모두 수행 |
| 좋아요/댓글/트렌드 지표 | ☐ 예정 | 동일 사용자 중복 방지 및 hot score 공식 확인 |
| 프런트엔드 허브/커뮤니티 페이지 | ✅ 완료 | `/community` 탭/상세/좋아요 실데이터 연동 |
| 모니터링 & 알림 | ☐ 예정 | `/wp-content/logs/hub.log` 생성, 3회 연속 실패 이메일 전송 |

세부 QA 시나리오 및 모니터링 절차는 `qa-checklist.md` 문서를 참고하여 각 체크 항목을 실행한다.
