# 아바타 업로드 문제 수정 완료 ✅

## 🐛 발견된 문제

PHP 백엔드의 `sanitize_text_field()` 함수가 Firebase Storage URL의 **URL 인코딩을 디코딩**하여 URL을 손상시켰습니다.

### 증상
- 업로드 시: `avatars%2FUID%2Ffilename.png` (정상, 195자)
- 저장 후: `avatarsUIDfilename.png` (손상, 189자)
- 결과: 이미지 로드 실패 ❌

### 원인
```php
// 잘못된 방법 ❌
$avatar_url = sanitize_text_field($request->get_param('avatar_url'));
// %2F가 디코딩되어 /로 변환되고, 최종적으로 URL이 깨짐
```

## ✅ 적용된 수정

### 1. 백엔드 수정 (`custom-profile.php`)

```php
// 올바른 방법 ✅
$avatar_url = !empty($request->get_param('avatar_url')) 
    ? esc_url_raw($request->get_param('avatar_url')) 
    : '';
// URL 인코딩 보존
```

**변경된 필드:**
- `avatar_url` - Firebase Storage URL
- `website` - 사용자 웹사이트 URL
- `social_links[].url` - 소셜 링크 URL (이미 올바르게 처리됨)

### 2. 마이그레이션 스크립트 (`fix-avatar-urls.php`)

기존에 저장된 손상된 URL을 자동으로 수정하는 스크립트 작성.

## 🧪 테스트 단계

### Step 1: 새 아바타 업로드 테스트

1. `/profile` 페이지 접속
2. 브라우저 콘솔 열기 (F12)
3. 새 아바타 업로드
4. "Save Changes" 클릭
5. **확인**: 콘솔에서 URL에 `%2F` 포함 여부 확인
   ```
   📤 Updating profile: { avatar_url: "...%2F...%2F..." }
   ```
6. 페이지 새로고침 (F5)
7. **확인**: 이미지가 정상적으로 표시되는지 확인
   ```
   ✅ Avatar image loaded successfully
   ```

### Step 2: 기존 손상된 데이터 복구 (필요한 경우)

현재 저장된 아바타가 이미 손상된 경우:

1. **functions.php** 파일 편집 (WordPress 테마 디렉토리):
   ```php
   require_once get_template_directory() . '/inc/fix-avatar-urls.php';
   add_action('init', 'fix_corrupted_avatar_urls_once');
   ```

2. WordPress 사이트의 아무 페이지나 접속 (홈페이지 등)

3. WordPress 디버그 로그 확인:
   ```bash
   tail -f /path/to/wordpress/wp-content/debug.log
   ```

4. 다음 로그 확인:
   ```
   🔧 Starting avatar URL fix...
   ✅ Fixed avatar URL for user X
      Old: .../o/avatarsUIDfilename.png
      New: .../o/avatars%2FUID%2Ffilename.png
   🎉 Avatar URL fix complete!
      Fixed: 1
      Already OK: 0
      Total: 1
   ```

5. **functions.php**에서 추가한 코드 제거

6. `/profile` 페이지 접속하여 아바타가 표시되는지 확인

### Step 3: WordPress 백엔드 로그 확인

WordPress 디버깅이 활성화되어 있다면:

```bash
tail -f wp-content/debug.log
```

프로필 업데이트 시 다음 로그 확인:
```
📥 [UPDATE Profile] Received update request for user_id: X
🖼️ [UPDATE Profile] Avatar URL received: https://firebasestorage...%2F...%2F...
🔍 [UPDATE Profile] Avatar URL length: 195
✅ [UPDATE Profile] Successfully updated profile for user X
🔍 [UPDATE Profile] Verification - Avatar URL in DB: https://firebasestorage...%2F...%2F...
```

## 📋 수정된 파일

1. ✅ `/workspace/package/headless-theme/inc/custom-profile.php`
   - `avatar_url`: `sanitize_text_field()` → `esc_url_raw()`
   - `website`: `sanitize_text_field()` → `esc_url_raw()`
   - 디버깅 로그에 URL 길이 추가

2. ✅ `/workspace/front-end/src/components/profile/AvatarUploader.tsx`
   - `previewUrl` 동기화 개선

3. ✅ `/workspace/front-end/src/lib/profileApi.ts`
   - 상세한 디버깅 로그 추가

4. ✅ `/workspace/front-end/src/components/profile/ProfileForm.tsx`
   - 상태 변경 추적 로그 추가

5. ✨ `/workspace/package/headless-theme/inc/fix-avatar-urls.php` (신규)
   - 손상된 URL 자동 복구 스크립트

6. 📝 `/workspace/AVATAR_DEBUG_GUIDE.md` (업데이트)
   - 문제 원인 및 해결 방법 문서화

## 🎯 예상 결과

### 이전 (문제 있음) ❌
- 업로드: ✅ 성공
- 저장: ✅ 성공 (하지만 URL 손상)
- 로드: ❌ 실패 (이미지 표시 안 됨)

### 이후 (수정 완료) ✅
- 업로드: ✅ 성공
- 저장: ✅ 성공 (URL 보존)
- 로드: ✅ 성공 (이미지 정상 표시)

## 🔍 디버깅 팁

### URL이 올바른지 확인하는 방법

**올바른 Firebase Storage URL:**
```
https://firebasestorage.googleapis.com/v0/b/wpyvr-9999.firebasestorage.app/o/avatars%2FUID%2Ffilename.png?alt=media&token=...
```

**손상된 URL:**
```
https://firebasestorage.googleapis.com/v0/b/wpyvr-9999.firebasestorage.app/o/avatarsUIDfilename.png?alt=media&token=...
```

차이점:
- ✅ `avatars%2FUID%2Ffilename` - 슬래시가 `%2F`로 인코딩됨
- ❌ `avatarsUIDfilename` - 슬래시가 사라짐

### 브라우저에서 직접 테스트

1. 콘솔에서 URL 복사
2. 새 탭에서 URL 직접 열기
3. 이미지가 표시되면 ✅ 올바른 URL
4. 에러가 나면 ❌ 손상된 URL

## 📚 배운 교훈

### WordPress URL Sanitization

| 함수 | 사용 시점 | URL 인코딩 |
|------|----------|-----------|
| `sanitize_text_field()` | 일반 텍스트 | ❌ 디코딩함 |
| `esc_url()` | HTML 출력 | ✅ 보존 |
| `esc_url_raw()` | DB 저장 | ✅ 보존 |

**결론**: URL을 데이터베이스에 저장할 때는 **항상** `esc_url_raw()`를 사용해야 합니다!

## 🚀 다음 단계

1. 위의 테스트 단계 실행
2. 정상 작동 확인
3. 필요시 기존 데이터 복구
4. 완료! 🎉
