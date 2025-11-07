# 🚀 WordPress Backend Setup Guide

## Quick Start

### 1️⃣ Install the Theme

**Option A: Manual Upload**
1. Compress the `headless-theme` folder into a `.zip` file
2. Go to WordPress Admin → Appearance → Themes
3. Click "Add New" → "Upload Theme"
4. Upload the `.zip` file
5. Click "Activate"

**Option B: FTP/SFTP**
1. Upload the `headless-theme` folder to `/wp-content/themes/`
2. Go to WordPress Admin → Appearance → Themes
3. Activate "Headless Theme"

---

### 2️⃣ Verify Installation

After activation, the theme will automatically:
- ✅ Create the `wp_user_profiles` database table
- ✅ Register REST API endpoints
- ✅ Configure CORS headers

**Check Database Table:**
```sql
SHOW TABLES LIKE 'wp_user_profiles';
```

You should see the table listed.

**Check Endpoints:**
Visit in your browser:
```
https://your-domain.com/wp-json/custom-profile/v1/
```

You should see WordPress REST API route information.

---

### 3️⃣ Configure WordPress

**Update `wp-config.php`:**

Add these lines for security (if not already present):
```php
define('AUTH_KEY',         'your-unique-key-here');
define('SECURE_AUTH_KEY',  'your-unique-key-here');
define('LOGGED_IN_KEY',    'your-unique-key-here');
define('NONCE_KEY',        'your-unique-key-here');
define('AUTH_SALT',        'your-unique-salt-here');
define('SECURE_AUTH_SALT', 'your-unique-salt-here');
define('LOGGED_IN_SALT',   'your-unique-salt-here');
define('NONCE_SALT',       'your-unique-salt-here');
```

Generate secure keys at: https://api.wordpress.org/secret-key/1.1/salt/

**Enable Debug Mode (for development only):**
```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
```

---

### 4️⃣ Configure Firebase (Optional)

If you want to use Firebase Admin SDK for token verification:

1. **Install PHP Composer** (if not already installed)

2. **Install Firebase PHP SDK:**
```bash
cd /path/to/wordpress/wp-content/themes/headless-theme
composer require kreait/firebase-php
```

3. **Add Firebase Service Account:**
   - Download your Firebase service account JSON from Firebase Console
   - Place it in the theme directory as `firebase-service-account.json`
   - Make sure it's not publicly accessible (use `.htaccess` or move outside webroot)

**Note:** The theme will work without Firebase Admin SDK using fallback token verification, but it's less secure for production.

---

### 5️⃣ Update CORS Configuration

**Edit `custom-auth.php` line 244:**
```php
$allowed_origins = [
    'http://localhost:3000',           // Local development
    'https://wpyvr.bitebuddy.ca',      // Production frontend
    'https://your-domain.com'          // Add your domain here
];
```

Add all domains that will access your WordPress API.

---

### 6️⃣ Test the Endpoints

**Test Authentication:**
```bash
# 1. Get Firebase token from your frontend
# 2. Sync with WordPress
curl -X POST "https://your-domain.com/wp-json/custom-auth/v1/sync" \
  -H "Authorization: Bearer FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com"}'

# Save the JWT from response

# 3. Test profile endpoints
curl -X GET "https://your-domain.com/wp-json/custom-profile/v1/get?user_id=1" \
  -H "Authorization: Bearer JWT_TOKEN" \
  -H "Content-Type: application/json"
```

---

## 📁 Theme File Structure

```
headless-theme/
├── /inc/custom-auth.php           # Firebase auth + JWT endpoints
├── /inc/custom-profile.php        # User profile endpoints
├── functions.php             # Main theme file
├── style.css                 # Theme metadata
├── index.php                 # Blank (headless theme)
├── API_DOCUMENTATION.md      # Full API docs
├── SETUP_GUIDE.md           # This file
└── README.md                # Theme overview
```

---

## 🔧 Troubleshooting

### Problem: Endpoints return 404
**Solution:**
1. Go to WordPress Admin → Settings → Permalinks
2. Click "Save Changes" (even without changing anything)
3. This flushes the rewrite rules

### Problem: Database table not created
**Solution:**
1. Deactivate the theme
2. Reactivate the theme
3. Or manually run the SQL from `custom-profile.php`

### Problem: CORS errors in browser
**Solution:**
1. Check `$allowed_origins` in `custom-auth.php`
2. Make sure your frontend URL is in the list
3. Clear browser cache

### Problem: JWT token invalid
**Solution:**
1. Check `AUTH_KEY` in `wp-config.php`
2. Token expires after 7 days - get a new one
3. Make sure there are no extra spaces when copying

### Problem: Profile not found (404)
**Solution:**
- This is normal for new users who haven't created a profile yet
- Frontend should handle this gracefully

---

## 🔒 Security Checklist

Before going to production:

- [ ] Set strong, unique keys in `wp-config.php`
- [ ] Disable WP_DEBUG mode
- [ ] Update CORS to only allow production domains
- [ ] Install SSL certificate (HTTPS)
- [ ] Keep WordPress core updated
- [ ] Keep PHP version updated (7.4+ required)
- [ ] Set up automated backups
- [ ] Implement rate limiting (use security plugin)
- [ ] Hide WordPress version number
- [ ] Change default database prefix if not already
- [ ] Use strong database password
- [ ] Limit login attempts (use security plugin)

---

## 📊 Database Management

### Backup Profile Data
```sql
-- Export user profiles
SELECT * FROM wp_user_profiles 
INTO OUTFILE '/tmp/user_profiles_backup.csv'
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n';
```

### View All Profiles
```sql
SELECT 
    up.user_id,
    u.user_email,
    up.nickname,
    up.greeting,
    up.job_title,
    up.last_seen_at,
    up.updated_at
FROM wp_user_profiles up
JOIN wp_users u ON up.user_id = u.ID
ORDER BY up.updated_at DESC;
```

### Find Recently Active Users
```sql
SELECT 
    u.user_email,
    up.nickname,
    up.last_seen_at
FROM wp_user_profiles up
JOIN wp_users u ON up.user_id = u.ID
WHERE up.last_seen_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
ORDER BY up.last_seen_at DESC;
```

---

## 🚀 Performance Optimization

### Add Database Indexes
The table already has proper indexes, but if you have performance issues:

```sql
-- Check existing indexes
SHOW INDEX FROM wp_user_profiles;

-- Add additional indexes if needed
CREATE INDEX idx_last_seen ON wp_user_profiles(last_seen_at);
CREATE INDEX idx_updated ON wp_user_profiles(updated_at);
```

### Enable Object Caching
Install and configure Redis or Memcached for better performance with large user bases.

### Optimize Database
```sql
OPTIMIZE TABLE wp_user_profiles;
```

---

## 🔄 Updates & Maintenance

### Theme Updates
When updating the theme:
1. Backup your database
2. Backup the theme files (especially if you made customizations)
3. Replace theme files
4. Test all endpoints
5. Check error logs

### Database Migration
If you need to migrate to a new server:
1. Export `wp_user_profiles` table
2. Import on new server
3. Update `wp-config.php` with new database credentials
4. Update CORS origins if domain changed

---

## 📚 Additional Resources

- **WordPress REST API Handbook:** https://developer.wordpress.org/rest-api/
- **Firebase Admin SDK:** https://firebase.google.com/docs/admin/setup
- **JWT Introduction:** https://jwt.io/introduction
- **WordPress Database Structure:** https://codex.wordpress.org/Database_Description

---

## 🆘 Getting Help

If you encounter issues:
1. Check WordPress error log: `/wp-content/debug.log`
2. Check PHP error log (location varies by server)
3. Review `API_DOCUMENTATION.md` for endpoint usage
4. Test with cURL to isolate frontend/backend issues
5. Check browser console for CORS errors
6. Verify database table structure

---

## ✅ Post-Installation Checklist

After setup, verify:
- [ ] Theme is activated
- [ ] Database table `wp_user_profiles` exists
- [ ] REST API endpoints are accessible
- [ ] Firebase authentication works
- [ ] JWT tokens are generated correctly
- [ ] Profile GET endpoint works
- [ ] Profile UPDATE endpoint works
- [ ] CORS is properly configured
- [ ] Frontend can access the API
- [ ] `last_seen_at` is updating on login
- [ ] Debug mode is OFF (production only)
- [ ] Error logs are clean (no PHP errors)

---

**🎉 You're all set! Your WordPress backend is ready to power the Next.js frontend.**

For detailed endpoint documentation, see `API_DOCUMENTATION.md`.
