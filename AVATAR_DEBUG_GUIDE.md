# 아바타 업로드 디버깅 가이드

## ✅ 문제 해결됨 (2025-01-08)

### 발견된 문제
PHP 백엔드에서 `sanitize_text_field()` 함수가 Firebase Storage URL의 `%2F` (URL 인코딩된 슬래시)를 디코딩하여 URL이 손상되었습니다.

**업로드 시 (정상):**
```
.../o/avatars%2FRSSSpG8jLKTsKLxhebej07PAx6A3%2Favatar_1762591184490.png
```

**저장 후 (손상됨):**
```
.../o/avatarsRSSSpG8jLKTsKLxhebej07PAx6A3avatar_1762591184490.png
```

### 적용된 수정
1. **custom-profile.php**: `avatar_url`과 `website` 필드에 `esc_url_raw()` 사용
2. **fix-avatar-urls.php**: 기존 손상된 URL을 수정하는 마이그레이션 스크립트

## 🔍 개요
프로필 아바타 업로드 및 로드 플로우에 대한 디버깅 로그가 추가되었습니다.

## 📊 전체 플로우

### 1. 업로드 플로우
```
사용자가 이미지 선택
  ↓
AvatarUploader: Firebase Storage에 업로드
  ↓
AvatarUploader: downloadURL 받음
  ↓
ProfileForm: onAvatarChange 콜백으로 URL 받음
  ↓
ProfileForm: avatarUrl 상태 업데이트
  ↓
사용자가 "Save Changes" 클릭
  ↓
ProfileForm: updateUserProfile API 호출
  ↓
Backend: wp_user_profiles 테이블에 저장
  ↓
Backend: 성공 응답
  ↓
Frontend: 프로필 새로고침
```

### 2. 로드 플로우
```
페이지 로드
  ↓
ProfilePage: fetchUserProfile API 호출
  ↓
Backend: wp_user_profiles 테이블에서 데이터 조회
  ↓
Backend: avatar_url 포함한 데이터 반환
  ↓
ProfileForm: initialData prop 받음
  ↓
ProfileForm: avatarUrl 상태 초기화
  ↓
AvatarUploader: currentAvatarUrl prop 받음
  ↓
AvatarUploader: previewUrl 업데이트
  ↓
이미지 표시
```

## 🐛 디버깅 로그 확인 방법

### 프론트엔드 (브라우저 콘솔)

1. **프로필 로드 시**
   ```
   📡 Fetching profile for user ID: [user_id]
   ✅ Profile fetched successfully: { user_id, nickname, avatar_url, has_avatar }
   📝 ProfileForm - Initial data loaded: { hasInitialData, avatar_url, hasAvatarUrl }
   📝 ProfileForm - Avatar URL state changed: { avatarUrl, hasValue, length, startsWithHttp }
   🖼️ AvatarUploader - currentAvatarUrl changed: [url]
   🔍 URL validation: { hasProtocol, includesFirebase, includesSlashEncoding, length }
   ✅ Avatar image loaded successfully
   ```

2. **아바타 업로드 시**
   ```
   Compressing image...
   Compressed from [size] to [size] bytes
   ✅ Avatar uploaded successfully!
   📁 Storage path: avatars/[uid]/[filename]
   🔗 Download URL: [full_url]
   🎨 ProfileForm - Avatar changed via callback: [url]
   📝 ProfileForm - Avatar URL state changed: { ... }
   ```

3. **프로필 저장 시**
   ```
   💾 ProfileForm - Submitting profile update: { user_id, avatar_url, has_avatar }
   📤 Updating profile: { user_id, nickname, avatar_url, has_avatar }
   ✅ Profile updated successfully: { user_id, avatar_url, response }
   ```

### 백엔드 (WordPress 에러 로그)

로그 파일 위치: `/wp-content/debug.log` (wp-config.php에 디버그 모드 활성화 필요)

1. **프로필 조회**
   ```
   📡 [GET Profile] Fetching profile for user_id: [id]
   ✅ [GET Profile] Profile found. Avatar URL: [url or NULL]
   📤 [GET Profile] Returning profile with avatar_url: [url or NULL]
   ```

2. **프로필 업데이트**
   ```
   📥 [UPDATE Profile] Received update request for user_id: [id]
   🖼️ [UPDATE Profile] Avatar URL received: [url or EMPTY]
   🔄 [UPDATE Profile] Updating existing profile for user [id] with avatar_url: [url or NULL]
   ✅ [UPDATE Profile] Successfully updated profile for user [id]. Rows affected: [count]
   🔍 [UPDATE Profile] Verification - Avatar URL in DB: [url or NULL]
   ```

## 🔧 수정 사항

### 1. AvatarUploader.tsx
- **수정**: `useEffect`에서 `currentAvatarUrl`이 변경될 때마다 `previewUrl` 동기화
- **이유**: 초기 로드 시에만 설정되던 문제 해결

### 2. profileApi.ts
- **추가**: 모든 API 호출에 상세한 디버깅 로그
- **내용**: 요청/응답 데이터, avatar_url 상태 추적

### 3. custom-profile.php (백엔드)
- **추가**: GET/UPDATE 엔드포인트에 상세한 로그
- **내용**: 데이터베이스 저장/조회 상태, avatar_url 추적

## 🧪 테스트 체크리스트

### 테스트 1: 새 아바타 업로드
1. `/profile` 페이지 접속
2. 브라우저 콘솔 열기
3. 아바타 업로드 버튼 클릭
4. 이미지 선택
5. **확인 사항**:
   - ✅ Firebase 업로드 성공 메시지
   - ✅ Download URL 출력
   - ✅ ProfileForm에서 URL 받음
   - ✅ 미리보기 이미지 표시

### 테스트 2: 프로필 저장
1. "Save Changes" 버튼 클릭
2. **확인 사항** (브라우저 콘솔):
   - ✅ 업데이트 payload에 avatar_url 포함
   - ✅ API 호출 성공
   - ✅ 성공 메시지 표시
3. **확인 사항** (백엔드 로그):
   - ✅ Avatar URL 수신 확인
   - ✅ 데이터베이스 업데이트 성공
   - ✅ 검증 쿼리에서 URL 확인

### 테스트 3: 페이지 새로고침
1. 페이지 새로고침 (F5)
2. **확인 사항** (브라우저 콘솔):
   - ✅ Profile fetch 성공
   - ✅ avatar_url 포함된 데이터 수신
   - ✅ AvatarUploader에 URL 전달
   - ✅ 이미지 로드 성공

### 테스트 4: 데이터베이스 직접 확인
WordPress 데이터베이스에 접속하여:
```sql
SELECT user_id, nickname, avatar_url 
FROM wp_user_profiles 
WHERE user_id = [your_user_id];
```

## ❌ 문제 해결

### 문제 1: 이미지가 표시되지 않음
**증상**: 업로드는 성공했지만 이미지가 보이지 않음

**확인 사항**:
1. 브라우저 콘솔에서 "❌ Avatar image failed to load" 메시지 확인
2. URL이 올바른지 확인 (Firebase Storage URL 형식)
3. Firebase Storage 규칙 확인 (읽기 권한)
4. CORS 설정 확인

### 문제 2: 저장되지 않음
**증상**: 업로드는 되지만 저장 후 사라짐

**확인 사항**:
1. 백엔드 로그에서 "Avatar URL received: EMPTY" 확인
2. 프론트엔드에서 payload의 avatar_url 값 확인
3. ProfileForm의 avatarUrl 상태 확인

### 문제 3: 로드되지 않음
**증상**: 저장은 됐지만 새로고침 후 사라짐

**확인 사항**:
1. 데이터베이스에 실제로 저장되었는지 확인
2. GET API 응답에 avatar_url 포함되는지 확인
3. ProfileForm의 initialData에 avatar_url 있는지 확인

## 📝 WordPress 디버그 로그 활성화

`wp-config.php` 파일에 추가:
```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
```

로그 파일 확인:
```bash
tail -f /path/to/wordpress/wp-content/debug.log
```

## 🎯 다음 단계

모든 로그를 확인한 후:

1. **성공 케이스**: 모든 로그가 정상이면 → 문제 해결 완료
2. **실패 케이스**: 어느 단계에서 문제가 발생하는지 파악
   - Firebase 업로드 실패 → Firebase 설정 확인
   - API 호출 실패 → 네트워크/인증 확인
   - 데이터베이스 저장 실패 → 백엔드 로그 확인
   - 로드 실패 → GET API 응답 확인

## 🔧 기존 데이터 수정 방법

기존에 저장된 손상된 아바타 URL을 수정하려면:

1. `functions.php`에 임시로 추가:
```php
require_once get_template_directory() . '/inc/fix-avatar-urls.php';
add_action('init', 'fix_corrupted_avatar_urls_once');
```

2. WordPress 사이트의 아무 페이지나 한 번 접속 (예: 홈페이지)

3. WordPress 로그 확인:
```bash
tail -f wp-content/debug.log
```

4. 다음 메시지 확인:
```
🎉 Avatar URL fix complete!
   Fixed: [숫자]
   Already OK: [숫자]
```

5. 완료 후 `functions.php`에서 추가한 코드 제거

**주의**: 이 스크립트는 한 번만 실행됩니다. `avatar_urls_fixed_20250108` 옵션이 설정되면 다시 실행되지 않습니다.

## 💡 추가 정보

- Firebase Storage 경로: `avatars/{firebase_uid}/{filename}`
- 이미지 최대 크기: 5MB
- 압축 후 크기: ~0.5MB
- 권장 해상도: 512x512px

## 📋 URL Sanitization 참고

### WordPress URL 처리 함수 비교

| 함수 | 용도 | URL 인코딩 보존 |
|------|------|----------------|
| `sanitize_text_field()` | 일반 텍스트 | ❌ 디코딩함 |
| `esc_url()` | HTML 출력용 URL | ✅ 보존 |
| `esc_url_raw()` | DB 저장용 URL | ✅ 보존 |

**교훈**: URL을 저장할 때는 항상 `esc_url_raw()`를 사용하세요!
