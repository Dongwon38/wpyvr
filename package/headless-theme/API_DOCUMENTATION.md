# 📚 User Profile API Documentation

## Overview
This API provides endpoints for managing user profiles in the WordPress backend, integrated with Firebase authentication and JWT tokens.

---

## 🔐 Authentication
All endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer {JWT_TOKEN}
```

The JWT token is returned from the `/custom-auth/v1/sync` endpoint after Firebase authentication.

---

## 📍 Endpoints

### 1. Get User Profile

**Endpoint:** `GET /wp-json/custom-profile/v1/get`

**Description:** Retrieves the profile data for a specific user.

**Query Parameters:**
- `user_id` (required, integer) - The WordPress user ID

**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

**Success Response (200):**
```json
{
  "id": 1,
  "user_id": 23,
  "nickname": "DW",
  "greeting": "Building modern headless apps",
  "avatar_url": "https://firebasestorage.googleapis.com/v0/b/project.appspot.com/o/avatars%2F23_1699999999.jpg?alt=media",
  "website": "https://bitebuddy.ca",
  "job_title": "Full-stack Developer",
  "social_links": [
    {
      "type": "github",
      "url": "https://github.com/username"
    },
    {
      "type": "linkedin",
      "url": "https://linkedin.com/in/username"
    }
  ],
  "last_seen_at": "2025-11-07 12:30:00",
  "updated_at": "2025-11-07 12:30:00"
}
```

**Error Responses:**

**401 Unauthorized:**
```json
{
  "code": "unauthorized",
  "message": "Invalid or missing authentication token",
  "data": {
    "status": 401
  }
}
```

**403 Forbidden:**
```json
{
  "code": "forbidden",
  "message": "You can only view your own profile",
  "data": {
    "status": 403
  }
}
```

**404 Not Found:**
```json
{
  "code": "profile_not_found",
  "message": "Profile not found",
  "data": {
    "status": 404
  }
}
```

---

### 2. Update User Profile

**Endpoint:** `POST /wp-json/custom-profile/v1/update`

**Description:** Creates or updates the profile data for a user.

**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

**Request Body:**
```json
{
  "user_id": 23,
  "nickname": "DW",
  "greeting": "Building modern headless apps with Next.js and WordPress",
  "job_title": "Full-stack Developer",
  "website": "https://bitebuddy.ca",
  "avatar_url": "https://firebasestorage.googleapis.com/v0/b/project.appspot.com/o/avatars%2F23_1699999999.jpg?alt=media",
  "social_links": [
    {
      "type": "github",
      "url": "https://github.com/username"
    },
    {
      "type": "linkedin",
      "url": "https://linkedin.com/in/username"
    },
    {
      "type": "twitter",
      "url": "https://twitter.com/username"
    }
  ]
}
```

**Field Descriptions:**
- `user_id` (required, integer) - WordPress user ID
- `nickname` (required, string, max 100 chars) - User's display name
- `greeting` (required, string, max 255 chars) - User's bio/greeting message
- `job_title` (optional, string, max 255 chars) - User's job title
- `website` (optional, string, max 255 chars) - User's website URL
- `avatar_url` (optional, string, max 255 chars) - Firebase Storage URL for avatar
- `social_links` (optional, array) - Array of social media links

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user_id": 23,
  "data": {
    "nickname": "DW",
    "greeting": "Building modern headless apps with Next.js and WordPress",
    "job_title": "Full-stack Developer",
    "website": "https://bitebuddy.ca",
    "avatar_url": "https://firebasestorage.googleapis.com/v0/b/project.appspot.com/o/avatars%2F23_1699999999.jpg?alt=media",
    "social_links": [
      {
        "type": "github",
        "url": "https://github.com/username"
      },
      {
        "type": "linkedin",
        "url": "https://linkedin.com/in/username"
      }
    ],
    "updated_at": "2025-11-07 12:30:00"
  }
}
```

**Error Responses:**

**400 Bad Request:**
```json
{
  "code": "validation_error",
  "message": "Nickname and greeting are required",
  "data": {
    "status": 400
  }
}
```

**401 Unauthorized:**
```json
{
  "code": "unauthorized",
  "message": "Invalid or missing authentication token",
  "data": {
    "status": 401
  }
}
```

**403 Forbidden:**
```json
{
  "code": "forbidden",
  "message": "You can only update your own profile",
  "data": {
    "status": 403
  }
}
```

**500 Internal Server Error:**
```json
{
  "code": "update_failed",
  "message": "Failed to update profile",
  "data": {
    "status": 500
  }
}
```

---

## 🧪 Testing with cURL

### Get Profile
```bash
curl -X GET "https://wpyvr.bitebuddy.ca/backend/wp-json/custom-profile/v1/get?user_id=23" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

### Update Profile
```bash
curl -X POST "https://wpyvr.bitebuddy.ca/backend/wp-json/custom-profile/v1/update" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 23,
    "nickname": "DW",
    "greeting": "Building modern headless apps",
    "job_title": "Full-stack Developer",
    "website": "https://bitebuddy.ca",
    "avatar_url": "https://firebasestorage.googleapis.com/...",
    "social_links": [
      {"type": "github", "url": "https://github.com/username"}
    ]
  }'
```

---

## 🔧 Testing with Postman

### Setup
1. Create a new request
2. Set the request type (GET or POST)
3. Enter the full endpoint URL
4. Add headers:
   - `Authorization: Bearer {YOUR_JWT_TOKEN}`
   - `Content-Type: application/json`
5. For POST requests, add the JSON body

### Example Collection

**1. Login and Get JWT**
```
POST https://wpyvr.bitebuddy.ca/backend/wp-json/custom-auth/v1/sync
Headers:
  Authorization: Bearer {FIREBASE_TOKEN}
  Content-Type: application/json
Body:
{
  "name": "Test User",
  "email": "test@example.com",
  "photoURL": ""
}
```
Save the JWT from the response.

**2. Get Profile**
```
GET https://wpyvr.bitebuddy.ca/backend/wp-json/custom-profile/v1/get?user_id=23
Headers:
  Authorization: Bearer {JWT_FROM_STEP_1}
  Content-Type: application/json
```

**3. Update Profile**
```
POST https://wpyvr.bitebuddy.ca/backend/wp-json/custom-profile/v1/update
Headers:
  Authorization: Bearer {JWT_FROM_STEP_1}
  Content-Type: application/json
Body:
{
  "user_id": 23,
  "nickname": "Test User",
  "greeting": "Hello from Postman!",
  "job_title": "Developer",
  "website": "https://example.com",
  "avatar_url": "",
  "social_links": []
}
```

---

## 🗄️ Database Schema

The API uses the `wp_user_profiles` table:

```sql
CREATE TABLE `wp_user_profiles` (
  `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT(20) UNSIGNED NOT NULL,
  `nickname` VARCHAR(100) DEFAULT NULL,
  `greeting` VARCHAR(255) DEFAULT NULL,
  `avatar_url` VARCHAR(255) DEFAULT NULL,
  `website` VARCHAR(255) DEFAULT NULL,
  `job_title` VARCHAR(255) DEFAULT NULL,
  `social_links` JSON DEFAULT NULL,
  `last_seen_at` DATETIME DEFAULT NULL,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id_unique` (`user_id`),
  FOREIGN KEY (`user_id`) REFERENCES `wp_users`(`ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**Note:** The table is created automatically when the theme is activated or on the first request.

---

## 🔄 Automatic Features

### Last Seen Tracking
The `last_seen_at` field is automatically updated when:
1. User syncs with WordPress (`/custom-auth/v1/sync`)
2. User verifies their JWT token (`/custom-auth/v1/verify`)
3. User updates their profile (`/custom-profile/v1/update`)

This can be used to show "Recently Active" users in the community section.

### Display Name Sync
When a user updates their `nickname`, the WordPress `display_name` is automatically synced to match.

---

## 🔐 Security Features

1. **JWT Verification:** All endpoints verify the JWT token before processing
2. **User Isolation:** Users can only view/edit their own profiles
3. **Input Sanitization:** All inputs are sanitized using WordPress functions
4. **SQL Injection Protection:** All database queries use prepared statements
5. **XSS Protection:** URLs are escaped using `esc_url_raw()`
6. **CORS Configuration:** Only allowed origins can access the API

---

## 🐛 Debugging

### Enable WordPress Debug Mode
Add to `wp-config.php`:
```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
```

### Check Logs
Logs are written to `/wp-content/debug.log`

Look for:
- `✅` Success messages
- `❌` Error messages
- JWT verification issues
- Database errors

### Common Issues

**1. Table doesn't exist**
- Solution: Deactivate and reactivate the theme, or visit any page to trigger `init` hook

**2. JWT token invalid**
- Check if token is expired (7 days)
- Verify `AUTH_KEY` in `wp-config.php` matches
- Check if token was copied correctly (no extra spaces)

**3. Profile not found (404)**
- This is normal for new users who haven't created a profile yet
- Frontend should handle this gracefully and show empty form

**4. CORS errors**
- Check allowed origins in `custom-auth.php`
- Verify frontend URL is in the allowed list

---

## 📊 Response Times

Expected response times (on decent hosting):
- GET profile: 50-100ms
- POST profile (create): 100-200ms
- POST profile (update): 80-150ms

If responses are slower, check:
1. Database indexes (user_id should be indexed)
2. Server resources
3. Network latency

---

## 🚀 Production Checklist

Before going live:
- [ ] Update CORS allowed origins to production URLs
- [ ] Set strong `AUTH_KEY` in `wp-config.php`
- [ ] Disable WordPress debug mode
- [ ] Test all endpoints with production Firebase tokens
- [ ] Verify database table exists and has proper indexes
- [ ] Test with multiple users to ensure isolation
- [ ] Monitor error logs for the first few days
- [ ] Set up automated backups for `wp_user_profiles` table

---

## 📞 Support

If you encounter issues:
1. Check WordPress error log (`/wp-content/debug.log`)
2. Verify JWT token is valid and not expired
3. Ensure `custom-profile.php` is properly loaded
4. Check database table exists: `SHOW TABLES LIKE 'wp_user_profiles'`
5. Test with a fresh user account

---

## 📝 Changelog

### Version 1.0.0 (2025-11-07)
- Initial release
- GET endpoint for fetching user profiles
- POST endpoint for creating/updating profiles
- Automatic last_seen_at tracking
- JWT authentication integration
- Database table auto-creation
- Input sanitization and validation
- CORS support
- Error handling and logging
