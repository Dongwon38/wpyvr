# 🧪 Firebase Storage 아바타 업로드 테스트 가이드

## 🎯 테스트 목적
새로운 Firebase Storage 규칙(`avatars/{userId}/{fileName}`)이 제대로 작동하는지 확인합니다.

---

## ✅ 사전 준비

### 1. Firebase Storage 규칙 배포
Firebase Console에서 다음 규칙을 배포하세요:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /avatars/{userId}/{fileName} {
      // 읽기: 공개
      allow read: if true;
      
      // 쓰기: 본인만 가능
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

**배포 방법:**
1. Firebase Console → Storage → Rules
2. 위 규칙을 복사/붙여넣기
3. "게시" 버튼 클릭

### 2. 프론트엔드 실행
```bash
cd front-end
npm run dev
```

---

## 🧪 테스트 시나리오

### Test 1: 정상 업로드 (성공해야 함)

**단계:**
1. Next.js 앱 실행 (`http://localhost:3000`)
2. Firebase로 로그인
3. RightSidebar에서 "Manage My Info" 클릭
4. Profile 페이지에서 아바타 업로드 버튼 클릭
5. 이미지 파일 선택 (JPG, PNG, GIF)
6. 업로드 진행률 확인
7. 업로드 완료 후 미리보기 확인

**예상 결과:**
- ✅ 업로드 성공
- ✅ 진행률 표시 (0% → 100%)
- ✅ 아바타 미리보기 표시
- ✅ Firebase Console에서 파일 확인: `avatars/{your-firebase-uid}/avatar_{timestamp}.jpg`

**콘솔 로그 확인:**
```
Compressing image...
Compressed from 500000 to 50000 bytes
✅ Avatar uploaded: https://firebasestorage.googleapis.com/...
```

---

### Test 2: 파일 경로 확인

**Firebase Console 확인:**
1. Firebase Console → Storage
2. `avatars/` 폴더 열기
3. 본인의 Firebase UID 폴더 확인 (예: `avatars/abc123def456/`)
4. 업로드한 파일 확인 (예: `avatar_1699999999.jpg`)

**올바른 구조:**
```
storage/
└── avatars/
    └── abc123def456/              ← 당신의 Firebase Auth UID
        └── avatar_1699999999.jpg  ← 업로드한 아바타
```

**잘못된 구조 (이렇게 되면 안됨):**
```
storage/
└── avatars/
    └── 1_1699999999.jpg          ← WordPress user_id (X)
```

---

### Test 3: 파일 타입 테스트

각 파일 타입으로 업로드 시도:

| 파일 타입 | 예상 결과 | 테스트 |
|-----------|-----------|--------|
| JPG | ✅ 성공 | [ ] |
| PNG | ✅ 성공 | [ ] |
| GIF | ✅ 성공 | [ ] |
| WEBP | ✅ 성공 | [ ] |
| PDF | ❌ 실패 (에러 메시지) | [ ] |
| TXT | ❌ 실패 (에러 메시지) | [ ] |

**에러 메시지 확인:**
```
"Please select an image file"
```

---

### Test 4: 파일 크기 제한

| 파일 크기 | 예상 결과 | 테스트 |
|-----------|-----------|--------|
| 100KB | ✅ 성공 | [ ] |
| 1MB | ✅ 성공 | [ ] |
| 4.9MB | ✅ 성공 | [ ] |
| 5.1MB | ❌ 실패 (에러 메시지) | [ ] |
| 10MB | ❌ 실패 (에러 메시지) | [ ] |

**에러 메시지 확인:**
```
"File size must be less than 5MB"
```

---

### Test 5: 이미지 압축 확인

**단계:**
1. 큰 이미지 업로드 (예: 2MB, 2000×2000px)
2. 브라우저 콘솔에서 압축 로그 확인
3. Firebase Console에서 최종 파일 크기 확인

**예상 결과:**
- 원본: ~2MB
- 압축 후: ~100-200KB
- 해상도: 512×512px 이하

**콘솔 로그:**
```
Compressing image...
Compressed from 2000000 to 150000 bytes
```

---

### Test 6: 인증 없이 업로드 시도 (실패해야 함)

**단계:**
1. 로그아웃 상태에서 테스트
2. 프로필 페이지 접근 시도

**예상 결과:**
- ❌ `/profile` 페이지로 접근 불가 (리다이렉트)
- 또는 업로드 시 에러 메시지: "You must be logged in to upload an avatar"

---

### Test 7: 공개 읽기 권한 테스트

**단계:**
1. 사용자 A로 로그인하여 아바타 업로드
2. 업로드된 아바타 URL 복사
3. 로그아웃
4. 시크릿 모드 또는 다른 브라우저에서 URL 접근

**예상 결과:**
- ✅ 로그인 없이도 이미지 표시됨 (공개 읽기)

---

### Test 8: 다른 사용자 폴더에 쓰기 시도 (실패해야 함)

**이 테스트는 Firebase Security Rules가 제대로 작동하는지 확인합니다.**

**시뮬레이션 방법:**

**A. Firebase Console에서 직접 테스트**
1. Firebase Console → Storage → Rules
2. "규칙 시뮬레이터" 클릭
3. 다음 설정으로 테스트:
   ```
   작업: write
   경로: /avatars/OTHER_USER_UID/avatar.jpg
   인증: (본인의 UID)
   ```

**예상 결과:**
- ❌ "액세스 거부" 또는 "Permission Denied"

---

### Test 9: 여러 번 업로드 (덮어쓰기 방지)

**단계:**
1. 아바타 이미지 업로드 (첫 번째)
2. 다른 이미지 업로드 (두 번째)
3. Firebase Console에서 파일 개수 확인

**예상 결과:**
- ✅ 2개의 파일이 존재
  ```
  avatars/your-uid/
    ├── avatar_1699999999.jpg  (첫 번째)
    └── avatar_1700000001.jpg  (두 번째)
  ```
- ✅ 타임스탬프로 구분되어 덮어쓰기 없음

---

### Test 10: 프로필 저장 후 표시 확인

**단계:**
1. 아바타 업로드
2. 프로필 정보 입력 (닉네임, 인사말 등)
3. "Save Changes" 클릭
4. 홈으로 리다이렉트
5. RightSidebar 확인

**예상 결과:**
- ✅ RightSidebar에 업로드한 아바타 표시
- ✅ 닉네임과 인사말 표시
- ✅ 아바타 이미지 로드 성공

---

## 🐛 일반적인 문제 해결

### 문제 1: "Permission Denied" 에러

**원인:**
- Firebase Storage 규칙이 배포되지 않음
- 잘못된 경로 구조

**해결:**
```bash
# 1. Firebase Console에서 규칙 확인
# 2. 규칙이 올바르게 배포되었는지 확인
# 3. 브라우저 콘솔에서 에러 메시지 확인
```

---

### 문제 2: 업로드 후 이미지 표시 안됨

**원인:**
- CORS 설정 문제
- 잘못된 URL

**해결:**
```bash
# 1. Firebase Console에서 CORS 설정 확인
# 2. 브라우저 콘솔에서 네트워크 탭 확인
# 3. 이미지 URL이 유효한지 확인
```

---

### 문제 3: "auth.currentUser is null"

**원인:**
- Firebase 인증 상태가 로드되기 전에 업로드 시도

**해결:**
- 로그인 확인
- 페이지 새로고침
- `auth.currentUser`가 null이 아닌지 확인

---

## 📊 테스트 결과 체크리스트

### 기능 테스트
- [ ] 이미지 파일 업로드 성공
- [ ] 진행률 표시 작동
- [ ] 이미지 압축 작동 (콘솔 로그 확인)
- [ ] 올바른 경로에 저장 (`avatars/{firebaseUid}/...`)
- [ ] 프로필 저장 후 RightSidebar에 표시

### 보안 테스트
- [ ] 로그인 없이 업로드 불가
- [ ] 다른 사용자 폴더에 쓰기 불가
- [ ] 공개 읽기 가능 (로그아웃 상태에서도 이미지 표시)

### 검증 테스트
- [ ] 이미지 파일만 업로드 가능
- [ ] 5MB 이상 파일 거부
- [ ] 여러 번 업로드 시 덮어쓰기 안됨

### UI/UX 테스트
- [ ] 업로드 버튼 작동
- [ ] 진행률 표시 (0% → 100%)
- [ ] 미리보기 표시
- [ ] 에러 메시지 표시
- [ ] 성공 메시지 표시

---

## 🔍 Firebase Console 확인 사항

### Storage → Files
```
✅ avatars/ 폴더 존재
✅ {your-firebase-uid}/ 폴더 존재
✅ avatar_{timestamp}.{ext} 파일 존재
✅ 파일 크기 적절 (~100-200KB)
```

### Storage → Rules
```
✅ 새로운 규칙 배포됨
✅ match /avatars/{userId}/{fileName} 패턴 확인
```

### Authentication → Users
```
✅ 테스트 사용자 존재
✅ UID 확인 (Storage 폴더명과 일치해야 함)
```

---

## 📸 스크린샷 체크포인트

테스트 시 다음 스크린샷을 캡처하세요:

1. **업로드 진행 중**
   - 진행률 표시 (50% 정도)

2. **업로드 완료**
   - 미리보기 이미지

3. **Firebase Console**
   - Storage 파일 구조
   - 올바른 경로 표시

4. **RightSidebar**
   - 업로드한 아바타 표시
   - 프로필 정보 표시

5. **브라우저 콘솔**
   - 압축 로그
   - 업로드 성공 로그

---

## 🎯 성공 기준

모든 테스트가 통과하면:
- ✅ Firebase Storage 규칙이 올바르게 설정됨
- ✅ 프론트엔드가 새 경로 구조 사용
- ✅ 보안 규칙이 제대로 작동
- ✅ 사용자는 아바타를 안전하게 업로드/표시 가능

---

## 🚀 배포 전 최종 체크

프로덕션 배포 전:
- [ ] 개발 환경에서 모든 테스트 통과
- [ ] Firebase Console에서 규칙 확인
- [ ] CORS 설정 확인
- [ ] 로그에 에러 없음
- [ ] 다양한 브라우저에서 테스트 (Chrome, Safari, Firefox)
- [ ] 모바일에서 테스트
- [ ] 느린 네트워크에서 테스트 (진행률 확인)

---

**테스트 완료 후 프로덕션 배포를 진행하세요! 🎉**
