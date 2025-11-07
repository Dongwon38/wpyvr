# 🚀 Quick Reference Card

## 📍 API Endpoints

### Base URL
```
https://wpyvr.bitebuddy.ca/backend/wp-json
```

### Authentication Endpoints
```http
POST /custom-auth/v1/sync       # Firebase → WordPress sync
POST /custom-auth/v1/verify     # Verify JWT token
```

### Profile Endpoints
```http
GET  /custom-profile/v1/get?user_id={id}   # Get profile
POST /custom-profile/v1/update              # Update profile
```

---

## 🔑 Authentication Header
All endpoints require:
```http
Authorization: Bearer {JWT_TOKEN}
```

---

## 📝 Quick cURL Examples

### 1. Sync User (Get JWT)
```bash
curl -X POST "https://wpyvr.bitebuddy.ca/backend/wp-json/custom-auth/v1/sync" \
  -H "Authorization: Bearer FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"User Name","email":"user@example.com"}'
```

**Returns:** JWT token (save this!)

### 2. Get Profile
```bash
curl -X GET "https://wpyvr.bitebuddy.ca/backend/wp-json/custom-profile/v1/get?user_id=1" \
  -H "Authorization: Bearer JWT_TOKEN"
```

### 3. Update Profile
```bash
curl -X POST "https://wpyvr.bitebuddy.ca/backend/wp-json/custom-profile/v1/update" \
  -H "Authorization: Bearer JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "nickname": "DW",
    "greeting": "Building modern apps",
    "job_title": "Developer",
    "website": "https://example.com",
    "avatar_url": "https://firebase.../avatar.jpg",
    "social_links": [
      {"type":"github","url":"https://github.com/username"}
    ]
  }'
```

---

## 📊 Database Quick Queries

### View All Profiles
```sql
SELECT u.user_email, up.nickname, up.greeting, up.last_seen_at
FROM wp_user_profiles up
JOIN wp_users u ON up.user_id = u.ID
ORDER BY up.updated_at DESC;
```

### Find Recently Active
```sql
SELECT u.user_email, up.nickname, up.last_seen_at
FROM wp_user_profiles up
JOIN wp_users u ON up.user_id = u.ID
WHERE up.last_seen_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
ORDER BY up.last_seen_at DESC;
```

### Check Table Structure
```sql
DESCRIBE wp_user_profiles;
```

---

## 🔧 Common Tasks

### Flush Permalinks (Fix 404s)
1. Go to WordPress Admin
2. Settings → Permalinks
3. Click "Save Changes"

### View Debug Logs
```bash
tail -f /path/to/wordpress/wp-content/debug.log
```

### Enable Debug Mode
Add to `wp-config.php`:
```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
```

### Update CORS Origins
Edit `custom-auth.php` line 244:
```php
$allowed_origins = [
    'http://localhost:3000',
    'https://your-production-domain.com'
];
```

---

## ❌ Error Codes

| Code | Status | Meaning |
|------|--------|---------|
| `unauthorized` | 401 | Invalid/missing JWT token |
| `forbidden` | 403 | User can't access resource |
| `profile_not_found` | 404 | Profile doesn't exist |
| `validation_error` | 400 | Missing required fields |
| `update_failed` | 500 | Database error |

---

## 🧪 Testing Checklist

- [ ] Theme activated in WordPress
- [ ] Table `wp_user_profiles` exists
- [ ] `/sync` endpoint returns JWT
- [ ] `/get` endpoint returns profile (or 404)
- [ ] `/update` endpoint creates profile
- [ ] `/update` endpoint updates existing profile
- [ ] CORS works from frontend
- [ ] `last_seen_at` updates on sync
- [ ] Nickname syncs to `display_name`
- [ ] Social links save as JSON

---

## 📁 File Locations

```
/wp-content/themes/headless-theme/
├── custom-auth.php          # Auth endpoints
├── custom-profile.php       # Profile endpoints
├── functions.php            # Theme init
└── API_DOCUMENTATION.md     # Full docs
```

---

## 🆘 Quick Troubleshooting

**404 on endpoints?**
→ Flush permalinks (Settings → Permalinks → Save)

**CORS error?**
→ Add frontend URL to `$allowed_origins` in `custom-auth.php`

**JWT invalid?**
→ Token expires in 7 days, get new one from `/sync`

**Table not found?**
→ Deactivate and reactivate theme

**Profile not found (404)?**
→ Normal for new users, create profile with `/update`

---

## 📞 Get Help

1. **Full API Docs:** `API_DOCUMENTATION.md`
2. **Setup Guide:** `SETUP_GUIDE.md`
3. **Theme Overview:** `README.md`
4. **Check Logs:** `/wp-content/debug.log`

---

## 🎯 Profile Data Structure

```json
{
  "user_id": 1,
  "nickname": "Username",        // Required
  "greeting": "Bio text",        // Required
  "job_title": "Developer",      // Optional
  "website": "https://...",      // Optional
  "avatar_url": "https://...",   // Optional
  "social_links": [              // Optional
    {
      "type": "github",
      "url": "https://github.com/..."
    }
  ]
}
```

---

## 🔐 Security Notes

- Users can only view/edit their own profiles
- All inputs are sanitized
- SQL injection protected
- JWT tokens expire in 7 days
- CORS restricted to allowed origins

---

**Version:** 1.0.0 | **Updated:** 2025-11-07
