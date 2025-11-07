# 🎯 Headless Theme for WordPress

A lightweight WordPress theme designed specifically for headless CMS architecture with Next.js frontend.

## 🌟 Features

- **No Frontend Rendering** - Pure REST API backend
- **Firebase Authentication Integration** - Seamless user sync
- **JWT Token Management** - Secure authentication flow
- **User Profile Management** - Extended user data with custom fields
- **CORS Configuration** - Pre-configured for headless architecture
- **Auto Database Setup** - Automatic table creation on activation
- **Last Seen Tracking** - Activity monitoring for users
- **Optimized Performance** - Minimal overhead, maximum speed

## 📦 What's Included

### Core Files
- **`functions.php`** - Theme initialization and configuration
- **`custom-auth.php`** - Firebase → WordPress sync + JWT authentication
- **`custom-profile.php`** - User profile REST API endpoints
- **`style.css`** - Theme metadata

### Documentation
- **`API_DOCUMENTATION.md`** - Complete API reference with examples
- **`SETUP_GUIDE.md`** - Step-by-step installation instructions
- **`README.md`** - This file

## 🚀 Quick Start

1. **Upload theme to WordPress:**
   ```
   /wp-content/themes/headless-theme/
   ```

2. **Activate the theme** in WordPress Admin

3. **Verify endpoints:**
   ```
   https://your-domain.com/wp-json/custom-auth/v1/
   https://your-domain.com/wp-json/custom-profile/v1/
   ```

4. **Update CORS settings** in `custom-auth.php` to allow your frontend domain

## 📍 API Endpoints

### Authentication
- `POST /custom-auth/v1/sync` - Sync Firebase user with WordPress
- `POST /custom-auth/v1/verify` - Verify JWT token

### User Profiles
- `GET /custom-profile/v1/get` - Get user profile data
- `POST /custom-profile/v1/update` - Update user profile

## 🗄️ Database

The theme automatically creates the `wp_user_profiles` table with:
- User profile data (nickname, greeting, bio, job title)
- Social media links (JSON format)
- Avatar URL (Firebase Storage)
- Activity tracking (last_seen_at)

## 🔐 Security

- JWT-based authentication
- Input sanitization on all endpoints
- SQL injection protection via prepared statements
- CORS configuration for allowed origins only
- User isolation (users can only edit their own data)

## 📚 Documentation

For detailed information:
- See **`SETUP_GUIDE.md`** for installation steps
- See **`API_DOCUMENTATION.md`** for endpoint reference
- Check WordPress error logs at `/wp-content/debug.log`

## 🛠️ Requirements

- **PHP:** 7.4 or higher
- **WordPress:** 6.0 or higher
- **MySQL:** 5.7 or higher (with JSON support)
- **mod_rewrite:** Enabled for pretty permalinks

## 🎨 Frontend Integration

This theme is designed to work with the Next.js frontend in this repository:
```
/front-end/
```

The frontend includes:
- Firebase authentication UI
- User profile management pages
- Avatar upload to Firebase Storage
- Real-time profile updates

## 🔄 Workflow

```
User Login (Firebase)
     ↓
Sync with WordPress (/sync)
     ↓
Get JWT Token
     ↓
Fetch Profile (/get)
     ↓
Update Profile (/update)
     ↓
Data stored in wp_user_profiles
```

## 🧪 Testing

Use cURL or Postman to test endpoints:

```bash
# Test auth sync
curl -X POST "https://your-domain.com/wp-json/custom-auth/v1/sync" \
  -H "Authorization: Bearer FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com"}'

# Test profile get
curl -X GET "https://your-domain.com/wp-json/custom-profile/v1/get?user_id=1" \
  -H "Authorization: Bearer JWT_TOKEN"
```

## 📝 Customization

### Add Custom Fields
Edit `custom-profile.php` to add more profile fields:

1. Update database schema
2. Modify GET endpoint to return new fields
3. Modify POST endpoint to accept new fields
4. Update frontend to display/edit new fields

### Modify JWT Expiration
Edit `custom-auth.php` line 170:
```php
$expire = $issuedAt + (7 * DAY_IN_SECONDS); // Change 7 to desired days
```

### Add More Endpoints
Create new files similar to `custom-profile.php` and include in `functions.php`

## 🐛 Troubleshooting

**Endpoints return 404:**
- Go to Settings → Permalinks and click Save

**CORS errors:**
- Update `$allowed_origins` in `custom-auth.php`

**Table not created:**
- Deactivate and reactivate theme

**JWT invalid:**
- Check `AUTH_KEY` in `wp-config.php`
- Verify token hasn't expired (7 days)

## 📊 Performance

Expected response times:
- Auth sync: 100-200ms
- Get profile: 50-100ms
- Update profile: 80-150ms

## 🔒 Production Checklist

- [ ] Set strong AUTH_KEY in wp-config.php
- [ ] Disable WP_DEBUG mode
- [ ] Update CORS to production domains only
- [ ] Enable HTTPS/SSL
- [ ] Set up automated backups
- [ ] Install security plugin (limit login attempts)
- [ ] Update WordPress and PHP regularly

## 📄 License

This is a custom theme for your project. Modify as needed.

## 🆘 Support

Check documentation files:
- `SETUP_GUIDE.md` - Installation help
- `API_DOCUMENTATION.md` - Endpoint reference

Review logs:
- WordPress: `/wp-content/debug.log`
- PHP: Check your server's error log location

---

**Version:** 1.0.0  
**Last Updated:** 2025-11-07  
**Compatible with:** WordPress 6.0+, PHP 7.4+
