# 🔥 Firebase Storage Rules Update

## ✅ Changes Applied

### New Firebase Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /avatars/{userId}/{fileName} {
      // ✅ 읽기: 공개 (모두 접근 가능)
      allow read: if true;

      // ✅ 쓰기: 본인(userId == request.auth.uid)만 가능
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Key Changes
- **Old Path:** `avatars/{userId}_{timestamp}.jpg`
- **New Path:** `avatars/{userId}/{fileName}`
- **userId:** Now uses Firebase Auth UID (not WordPress user_id)
- **Read Access:** Public (anyone can view avatars)
- **Write Access:** Only the authenticated user can upload to their own folder

---

## 📝 Frontend Changes

### 1. Updated `AvatarUploader.tsx`

#### Changes Made:
- ✅ Removed `userId` prop (previously WordPress user_id)
- ✅ Now uses `auth.currentUser.uid` directly from Firebase Auth
- ✅ Updated file path structure to `avatars/{firebaseUid}/{fileName}`
- ✅ Added authentication check before upload
- ✅ Preserves original file extension
- ✅ Uses timestamp in filename to prevent overwrites

#### New Upload Path:
```typescript
const filePath = `avatars/${currentUser.uid}/${sanitizedFileName}`
// Example: avatars/abc123def456/avatar_1699999999.jpg
```

#### Security:
- Only authenticated users can upload
- Users can only upload to their own folder (enforced by Firebase rules)
- File names include timestamp to prevent accidental overwrites

### 2. Updated `ProfileForm.tsx`

#### Changes Made:
- ✅ Removed `userId` prop from `AvatarUploader` component
- ✅ Component now handles authentication internally

---

## 🧪 Testing the Changes

### Test Upload Flow:

1. **Login with Firebase**
   ```bash
   # User logs in via frontend
   # Firebase Auth UID: abc123def456
   ```

2. **Upload Avatar**
   ```bash
   # User goes to /profile page
   # Clicks upload button
   # Selects an image
   ```

3. **File Upload Path**
   ```
   Firebase Storage Path:
   avatars/abc123def456/avatar_1699999999.jpg
   ```

4. **Verify in Firebase Console**
   - Go to Firebase Console → Storage
   - Check `avatars/` folder
   - You should see folders named with Firebase Auth UIDs
   - Each folder contains that user's avatar files

---

## 🔐 Security Validation

### What's Protected:
✅ Users can only upload to their own folder  
✅ Users cannot delete or modify other users' avatars  
✅ All avatars are publicly readable (for display in UI)  
✅ Write access requires Firebase authentication

### Test Security:
1. **Upload as User A**
   - Should succeed to `avatars/userA_uid/avatar.jpg`

2. **Try to Upload to User B's Folder**
   - Firebase will reject with permission denied
   - Rules enforce `userId == request.auth.uid`

3. **Read Any Avatar**
   - Should work without authentication
   - Public read access for all avatars

---

## 📊 Before & After Comparison

### Old Structure (WordPress user_id based)
```
avatars/
  ├── 1_1699999999.jpg        # WordPress user_id = 1
  ├── 2_1699999999.jpg        # WordPress user_id = 2
  └── 3_1699999999.jpg        # WordPress user_id = 3
```

**Issues:**
- ❌ Flat structure (all files in one folder)
- ❌ Used WordPress user_id (not Firebase UID)
- ❌ Security rules couldn't enforce per-user access

### New Structure (Firebase UID based)
```
avatars/
  ├── abc123def456/            # Firebase Auth UID
  │   ├── avatar_1699999999.jpg
  │   └── avatar_1700000000.jpg
  ├── xyz789ghi012/            # Another Firebase Auth UID
  │   └── avatar_1699999999.jpg
  └── mno345pqr678/            # Another Firebase Auth UID
      └── avatar_1699999999.jpg
```

**Benefits:**
- ✅ Organized by user (each user has their own folder)
- ✅ Uses Firebase Auth UID for proper security
- ✅ Security rules can enforce per-folder access
- ✅ Easy to manage user data (delete all avatars for a user)

---

## 🔄 Migration Guide

### For Existing Users with Old Avatars

If you have existing avatars in the old format, they won't be accessible under the new rules. You have two options:

#### Option 1: Soft Migration (Recommended)
- Keep old avatars as-is
- New uploads use new structure
- Users will re-upload their avatars naturally over time
- Old files can be cleaned up later

#### Option 2: Active Migration
Run a migration script to move old avatars:

```javascript
// Firebase Admin SDK migration script
const admin = require('firebase-admin');
const storage = admin.storage().bucket();

async function migrateAvatars() {
  const [oldFiles] = await storage.getFiles({ prefix: 'avatars/' });
  
  for (const file of oldFiles) {
    // Parse old filename: avatars/1_1699999999.jpg
    const match = file.name.match(/avatars\/(\d+)_(\d+)\.(jpg|png|gif)/);
    if (!match) continue;
    
    const [_, wpUserId, timestamp, ext] = match;
    
    // Get Firebase UID from WordPress user_id (you need a mapping)
    const firebaseUid = await getFirebaseUidFromWpUserId(wpUserId);
    
    if (firebaseUid) {
      // New path: avatars/{firebaseUid}/avatar_{timestamp}.{ext}
      const newPath = `avatars/${firebaseUid}/avatar_${timestamp}.${ext}`;
      await file.copy(newPath);
      console.log(`Migrated: ${file.name} → ${newPath}`);
    }
  }
}
```

**Note:** Migration is optional. The new system works independently.

---

## 🐛 Troubleshooting

### Error: "Permission Denied"
**Cause:** User trying to upload to another user's folder or not authenticated

**Solution:**
- Ensure user is logged in with Firebase Auth
- Verify `auth.currentUser` exists before upload
- Check Firebase Storage rules are deployed

### Error: "Upload Failed"
**Cause:** Network issues or Firebase Storage not configured

**Solution:**
- Check Firebase Storage is enabled in Firebase Console
- Verify `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` in `.env.local`
- Check network connectivity

### Avatar Not Displaying
**Cause:** URL might be from old structure or CORS issues

**Solution:**
- Check the avatar URL in browser console
- Verify URL follows new structure
- Check Firebase Storage CORS settings

---

## ✅ Testing Checklist

Before deploying to production:

- [ ] Firebase Storage rules deployed
- [ ] Test upload as authenticated user
- [ ] Verify file appears in correct path (`avatars/{uid}/...`)
- [ ] Test public read access (view avatar without login)
- [ ] Test security: Try to upload to another user's folder (should fail)
- [ ] Test with different file types (JPG, PNG, GIF)
- [ ] Test file size limits (should reject >5MB)
- [ ] Test image compression (verify file size reduced)
- [ ] Test upload progress indicator
- [ ] Test avatar display in RightSidebar
- [ ] Test avatar display in profile page
- [ ] Check Firebase Console for correct folder structure

---

## 📚 Documentation Updates

### For Users:
Your avatar is stored securely in Firebase Storage:
- Only you can upload or change your avatar
- Your avatar is publicly visible (so others can see it)
- Each upload creates a new file (old versions are kept)

### For Developers:
- Avatar path uses Firebase Auth UID, not WordPress user_id
- Security enforced at Firebase Storage level
- AvatarUploader component handles authentication automatically
- No backend changes needed (WordPress just stores the URL)

---

## 🚀 Deployment Steps

1. **Deploy Firebase Storage Rules**
   ```bash
   # In Firebase Console → Storage → Rules
   # Copy and paste the new rules
   # Click "Publish"
   ```

2. **Deploy Frontend Changes**
   ```bash
   cd front-end
   npm run build
   # Deploy to your hosting
   ```

3. **Test in Production**
   - Login with a test user
   - Upload an avatar
   - Verify it appears correctly
   - Check Firebase Console for file location

4. **Monitor Logs**
   - Check browser console for errors
   - Check Firebase Storage logs for access denials
   - Monitor upload success rate

---

## 📊 Cost Considerations

### Firebase Storage Pricing:
- **Storage:** $0.026/GB/month
- **Download:** $0.12/GB
- **Upload:** Free

### Estimated Costs (for 1,000 users):
- Average avatar size: 100KB (after compression)
- Storage: ~100MB = $0.0026/month
- Downloads (100 views/avatar/month): ~10GB = $1.20/month

**Total:** ~$1.20/month for 1,000 active users

### Optimization:
- ✅ Already implemented: Image compression (512x512, 80% quality)
- Consider: CDN caching for popular avatars
- Consider: Cleanup old avatars after new upload

---

## 🎉 Summary

### What Changed:
- ✅ Firebase Storage path structure updated
- ✅ Security rules improved (per-user folders)
- ✅ Frontend components updated
- ✅ No backend changes needed

### Benefits:
- ✅ Better security (users isolated to their own folders)
- ✅ Better organization (folders per user)
- ✅ Public read access (avatars visible to all)
- ✅ Proper Firebase Auth integration

### Next Steps:
1. Deploy Firebase Storage rules
2. Test the upload flow
3. Monitor for any issues
4. Optionally migrate old avatars

**Everything is ready to go! 🚀**
