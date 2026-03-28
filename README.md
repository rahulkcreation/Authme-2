# AuthMe WordPress Plugin

**Version:** 1.1.0  
**Author:** Art-Tech Fuzion  
**Requires:** WordPress 5.0+, PHP 7.4+  
**Plugin URI:** https://arttechfuzion.com

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
  - [Installing Composer](#installing-composer)
    - [Windows](#installing-composer-on-windows)
    - [macOS](#installing-composer-on-macos)
  - [Installing PHP Dependencies (Vendor Files)](#installing-php-dependencies-vendor-files)
- [How the Plugin Works](#how-the-plugin-works)
  - [System Architecture](#system-architecture)
  - [User Registration Flow](#user-registration-flow)
  - [User Login Flow](#user-login-flow)
  - [Password Reset Flow](#password-reset-flow)
- [File Structure](#file-structure)
- [Database](#database)
- [Admin Panel](#admin-panel)
- [WooCommerce Integration](#woocommerce-integration)
- [Security Features](#security-features)
- [AJAX Actions Reference](#ajax-actions-reference)
- [Hooks & Filters](#hooks--filters)
- [Troubleshooting](#troubleshooting)

---

## Overview

AuthMe is a comprehensive WordPress authentication plugin that provides a secure, modern authentication system with **OTP (One-Time Password) verification** for user registration and login flows.

The plugin replaces the default WordPress login/registration with a beautiful popup overlay that includes:
- Real-time username and email availability checking
- Mobile number validation with international support
- OTP-based email verification for registration
- Password strength validation
- Password reset with OTP verification
- Custom "traveller" user role for new users
- WooCommerce checkout protection

---

## Features

- **Popup Authentication Overlay** - Beautiful modal popup for all auth actions
- **OTP Verification** - 6-digit one-time password sent via email
- **Real-time Validation** - Instant feedback on username/email availability
- **Password Strength Meter** - Visual indicator for password security
- **International Mobile Support** - Phone number validation using libphonenumber
- **Custom User Role** - New users get "traveller" role by default
- **WooCommerce Integration** - Protects checkout for non-logged-in users
- **Admin Dashboard** - Manage plugin settings and database
- **Email Notifications** - Beautiful HTML emails for OTP and password changes
- **Scheduled Cleanup** - Automatic cleanup of expired OTPs via cron

---

## Requirements

- **WordPress:** 5.0 or higher
- **PHP:** 7.4 or higher
- **PHP Extensions:** json, mbstring (for libphonenumber)
- **Composer:** For installing PHP dependencies

---

## Installation

### Installing Composer

Composer is a dependency manager for PHP. AuthMe uses Composer to install the `libphonenumber-for-php` library for validating international phone numbers.

#### Installing Composer on Windows

**Method 1: Using Composer Installer (Recommended)**

1. Download the Composer installer from [getcomposer.org](https://getcomposer.org/Composer-Setup.exe)
2. Run the installer (Composer-Setup.exe)
3. Follow the installation wizard:
   - Select your PHP executable path (usually found in your local server setup like XAMPP, WAMP, or MAMP)
   - Enable developer mode if you want (optional)
   - Complete the installation
4. Open Command Prompt and verify installation:
   ```
   composer --version
   ```

**Method 2: Using XAMPP/WAMP**

If you're using XAMPP or WAMP:

1. Make sure PHP is in your system PATH
2. Download Composer for Windows from [getcomposer.org/download](https://getcomposer.org/download/)
3. Run the following commands in Command Prompt:
   ```
   php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
   php composer-setup.php
   php -r "unlink('composer-setup.php');"
   move composer.phar C:\bin\composer.phar
   echo @php "%~dp0composer.phar" %*>C:\bin\composer.bat
   ```
4. Add `C:\bin` to your system PATH
5. Verify: `composer --version`

#### Installing Composer on macOS

**Method 1: Using Homebrew (Recommended)**

1. Open Terminal
2. If Homebrew is not installed, install it:
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```
3. Install Composer via Homebrew:
   ```bash
   brew install composer
   ```
4. Verify installation:
   ```bash
   composer --version
   ```

**Method 2: Using PHP Installer Script**

1. Open Terminal
2. Download the Composer installer:
   ```bash
   curl -sS https://getcomposer.org/installer | php
   ```
3. Move Composer to a global location:
   ```bash
   mv composer.phar /usr/local/bin/composer
   ```
4. Make it executable:
   ```bash
   chmod +x /usr/local/bin/composer
   ```
5. Verify installation:
   ```bash
   composer --version
   ```

**Method 3: Using Mac's Built-in PHP**

1. Open Terminal
2. Download Composer:
   ```bash
   curl -sS https://getcomposer.org/installer -o composer-setup.php
   ```
3. Run the installer:
   ```bash
   php composer-setup.php --install-dir=/usr/local/bin --filename=composer
   ```
4. Verify:
   ```bash
   composer --version
   ```

---

### Installing PHP Dependencies (Vendor Files)

After installing Composer, you need to install the PHP dependencies for AuthMe.

**Important:** The `vendor` folder contains the libphonenumber library. **DO NOT include the `vendor` folder in your git repository** as it contains external dependencies managed by Composer.

#### Step-by-Step Installation

1. **Navigate to the Plugin Directory**

   Open your terminal/command prompt and go to the AuthMe plugin folder:
   
   ```bash
   cd /path/to/your/wordpress/wp-content/plugins/authme-2
   ```
   
   Or on Windows:
   ```cmd
   cd C:\path\to\your\wordpress\wp-content\plugins\authme-2
   ```

2. **Install Dependencies**

   Run Composer to install all dependencies:
   
   ```bash
   composer install
   ```
   
   Or if you need to update dependencies:
   ```bash
   composer update
   ```

3. **What Happens Next**

   Composer will:
   - Read the `composer.json` file
   - Download the `libphonenumber-for-php` library and its dependencies
   - Create a `vendor` folder with all necessary files
   - Create an `autoload.php` file for automatic class loading

4. **Verify Installation**

   Check that the vendor folder was created:
   
   ```bash
   ls -la vendor
   ```
   
   You should see:
   ```
   vendor/
   ├── autoload.php
   ├── giggsey/
   │   └── libphonenumber-for-php/
   └── composer/
   ```

5. **Uploading to WordPress**

   When uploading the plugin to WordPress:
   
   **Include these files/folders:**
   - `authme.php`
   - `composer.json` (for reference)
   - `includes/` folder
   - `templates/` folder
   - `assets/` folder
   - `admin/` folder
   - `vendor/` folder (generated by Composer)
   
   **Do NOT modify:**
   - Files inside `vendor/` (these are external dependencies)

#### Troubleshooting Composer Issues

**"composer: command not found"**
- Make sure Composer is installed and added to your system PATH
- Restart your terminal after installation

**"PHP version not met"**
- Update PHP to a version >= 7.4
- Or modify `composer.json` to allow older PHP versions (not recommended)

**"ext-gmp extension not found"**
- Install the GMP extension for PHP
- On Ubuntu/Debian: `sudo apt-get install php-gmp`
- On macOS with Homebrew: `brew install php-gmp`
- On Windows: Enable in php.ini: `extension=gmp`

---

## How the Plugin Works

### System Architecture

The plugin follows a clean MVC-like architecture:

```
┌─────────────────────────────────────────────────────────┐
│                    WordPress Core                        │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    authme.php                            │
│              (Main Plugin Entry Point)                   │
└─────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│  AuthMe_Auth  │  │  AuthMe_OTP   │  │ AuthMe_Email  │
│  (Login/Reg)  │  │  (6-digit)    │  │  (Sending)    │
└───────────────┘  └───────────────┘  └───────────────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   AuthMe_DB                              │
│              (Database Operations)                       │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│              wp_authme_otp_storage                       │
│           (Custom Database Table)                        │
└─────────────────────────────────────────────────────────┘
```

### User Registration Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        REGISTRATION FLOW                         │
└─────────────────────────────────────────────────────────────────┘

1. User clicks "Register" → Opens overlay on "register" screen
   │
   ▼
2. User fills form fields:
   - Username (real-time availability check)
   - Email (real-time availability check)
   - Mobile (international format validation via libphonenumber)
   - Password (strength meter shown)
   │
   ▼
3. User clicks "Send OTP"
   │
   ├─► AJAX: authme_send_otp
   │    │
   │    ├─► Generate 6-digit random OTP
   │    ├─► Store in wp_authme_otp_storage (purpose: 'registration')
   │    ├─► Store user data (username, email, password hash) in user_data column
   │    ├─► Send OTP via email
   │    └─► Return success/error
   │
   ▼
4. OTP screen appears:
   - 60-second countdown timer
   - 6 input fields for OTP digits
   - Auto-focus, auto-tab between fields
   - Paste support for entire code
   │
   ▼
5. User enters OTP and clicks "Verify & Proceed"
   │
   ├─► AJAX: authme_verify_otp
   │    │
   │    ├─► Check OTP exists and not expired (60 seconds)
   │    ├─► Check OTP matches
   │    ├─► Mark as verified in database
   │    └─► Return success/error
   │
   ▼
6. If OTP verified:
   │
   ├─► AJAX: authme_register_user
   │    │
   │    ├─► Retrieve stored user_data
   │    ├─► Check OTP is verified
   │    ├─► Create WordPress user with 'traveller' role
   │    ├─► Set user metadata (mobile, email, verified status)
   │    ├─► Auto-login user
   │    ├─► Clean up OTP record
   │    └─► Return success
   │
   ▼
7. Success! Overlay closes, page reloads
   └─► User is now logged in as "traveller"
```

### User Login Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                          LOGIN FLOW                             │
└─────────────────────────────────────────────────────────────────┘

1. User clicks "Login" → Opens overlay on "login" screen
   │
   ▼
2. User enters email/username
   │
   ├─► AJAX: authme_check_user_exists
   │    │
   │    ├─► Look up user by email or username
   │    └─► Return user exists status (enables password field)
   │
   ▼
3. User enters password
   │
   ▼
4. User clicks "Login"
   │
   ├─► AJAX: authme_login_user
   │    │
   │    ├─► Authenticate credentials via wp_signon
   │    ├─► Set auth cookie
   │    ├─► Update last login metadata
   │    └─► Return success/error
   │
   ▼
5. Success! Overlay closes, page reloads
   └─► User is now logged in
```

### Password Reset Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      PASSWORD RESET FLOW                        │
└─────────────────────────────────────────────────────────────────┘

1. User clicks "Forgot Password?" → Opens "forgot-password" screen
   │
   ▼
2. User enters email/username
   │
   ├─► AJAX: authme_forgot_check_user
   │    │
   │    ├─► Look up WordPress user
   │    └─► Return user found status
   │
   ▼
3. User clicks "Send Reset OTP"
   │
   ├─► AJAX: authme_send_otp
   │    │
   │    ├─► Generate 6-digit OTP
   │    ├─► Store (purpose: 'password_reset')
   │    ├─► Send via email
   │    └─► Return success/error
   │
   ▼
4. OTP screen appears (60-second countdown)
   │
   ▼
5. User enters OTP and clicks "Verify"
   │
   ├─► AJAX: authme_verify_otp
   │    │
   │    ├─► Verify OTP
   │    └─► Return success (enables new password form)
   │
   ▼
6. New password screen:
   - New password field (with strength meter)
   - Confirm password field
   │
   ▼
7. User enters new password and clicks "Reset Password"
   │
   ├─► AJAX: authme_reset_password
   │    │
   │    ├─► Verify OTP is still valid
   │    ├─► Update user password via wp_set_password
   │    ├─► Send "password changed" notification email
   │    ├─► Clean up OTP record
   │    └─► Return success
   │
   ▼
8. Success! User can now login with new password
```

---

## File Structure

```
AuthMe/
├── authme.php                 # Main plugin entry point
├── composer.json              # PHP dependencies definition
├── README.md                  # This documentation
│
├── includes/
│   ├── assets-loader.php      # Centralized CSS/JS enqueuing
│   ├── class-authme-auth.php  # Authentication logic (login/register/reset)
│   ├── class-authme-db.php    # Database table management
│   ├── class-authme-email.php # Email sending functions
│   └── class-authme-otp.php   # OTP generation/verification/storage
│
├── templates/                  # Frontend HTML templates
│   ├── overlay.php            # Main popup container
│   ├── login.php              # Login form
│   ├── register.php           # Registration form
│   ├── otp.php                # OTP verification screen
│   ├── forgot-password.php    # Password reset request
│   ├── new-password.php       # New password form
│   ├── toaster.php            # Toast notification container
│   ├── email-otp.php           # OTP email HTML template
│   └── email-password-changed.php  # Password changed email
│
├── assets/
│   ├── css/                   # Stylesheets
│   │   ├── global.css         # Shared styles, variables
│   │   ├── overlay.css        # Popup container styles
│   │   ├── login.css          # Login form styles
│   │   ├── register.css        # Registration form styles
│   │   ├── otp.css            # OTP input styles
│   │   ├── forgot-password.css # Forgot password styles
│   │   ├── new-password.css    # New password form styles
│   │   └── toaster.css        # Toast notification styles
│   │
│   └── js/                    # JavaScript files
│       ├── global.js          # Utilities (ajax, validation, password strength)
│       ├── overlay.js         # Popup open/close, screen switching
│       ├── login.js           # Login form logic
│       ├── register.js        # Registration with validation
│       ├── otp.js             # OTP input handling, timer
│       ├── forgot-password.js  # Password reset flow
│       ├── new-password.js    # New password form
│       ├── toaster.js         # Toast notifications
│       └── country-phone-regex.js  # Country phone patterns
│
├── admin/                     # WordPress admin panel
│   ├── class-authme-admin.php # Admin menu registration
│   ├── templates/
│   │   ├── dashboard.php      # Admin dashboard page
│   │   └── database.php      # Database management page
│   └── assets/
│       ├── admin-global.css   # Admin CSS variables
│       ├── admin.css          # Admin styles
│       └── admin.js           # Admin AJAX handlers
│
└── vendor/                    # Composer dependencies (DO NOT MODIFY)
    ├── autoload.php          # Composer autoloader
    ├── giggsey/
    │   └── libphonenumber-for-php/  # Google phone number library
    └── composer/
        ├── autoload_classmap.php
        ├── autoload_real.php
        └── ...               # Composer generated files
```

---

## Database

### Custom Table

The plugin creates one custom database table:

**Table Name:** `wp_authme_otp_storage` (prefix may vary)

| Column | Type | Description |
|--------|------|-------------|
| id | INT (AUTO_INCREMENT) | Primary key |
| email | VARCHAR(100) | Recipient email address |
| otp_code | VARCHAR(6) | 6-digit OTP code |
| purpose | VARCHAR(20) | Purpose: 'registration', 'login', 'password_reset' |
| created_at | TIMESTAMP | When OTP was created |
| expires_at | TIMESTAMP | When OTP expires (created_at + 60 seconds) |
| is_verified | TINYINT(1) | 0 = pending, 1 = verified |
| user_data | TEXT | JSON data for registration (username, email, password hash) |

### Created on Plugin Activation

The table is created automatically when the plugin is activated via `dbDelta()`.

---

## Admin Panel

Access via WordPress admin menu: **AuthMe**

### Dashboard

- Plugin information and version
- Usage instructions
- Direct URL to open popup: `/authme`
- Trigger link HTML code
- JavaScript function: `authmeOpenOverlay()`

### Database Management

- View table status
- View table columns
- Create/update tables manually

---

## WooCommerce Integration

The plugin integrates with WooCommerce when the plugin is active:

| Page | Behavior for Non-Logged-In Users |
|------|-----------------------------------|
| **Cart** | "Proceed to Checkout" button opens login popup on the same page |
| **Checkout** | Redirects back to cart (must login first) |
| **My Account** | Redirects to homepage with popup auto-open |

---

## Security Features

1. **OTP Verification** - Required for registration and password reset
2. **Nonce Validation** - All AJAX requests use WordPress security nonces
3. **Password Hashing** - Uses WordPress password hashing (`wp_hash_password`)
4. **Admin Protection** - Administrators cannot use the popup
5. **Input Sanitization** - All user inputs are sanitized
6. **OTP Expiry** - 60-second validity with automatic cleanup
7. **Automatic Cleanup** - Cron job removes expired/verified OTPs twice daily

---

## AJAX Actions Reference

| Action | Handler | Description |
|--------|---------|-------------|
| `authme_check_username` | `AuthMe_Auth::ajax_check_username` | Check if username is available |
| `authme_check_email` | `AuthMe_Auth::ajax_check_email` | Check if email is available |
| `authme_check_user_exists` | `AuthMe_Auth::ajax_check_user_exists` | Check if user exists for login |
| `authme_login_user` | `AuthMe_Auth::ajax_login_user` | Authenticate and login user |
| `authme_register_user` | `AuthMe_Auth::ajax_register_user` | Create new WordPress user |
| `authme_complete_login` | `AuthMe_Auth::ajax_complete_login` | Post-OTP registration |
| `authme_forgot_check_user` | `AuthMe_Auth::ajax_forgot_check_user` | Check user for password reset |
| `authme_reset_password` | `AuthMe_Auth::ajax_reset_password` | Reset user password |
| `authme_send_otp` | `AuthMe_OTP::ajax_send_otp` | Generate and send OTP |
| `authme_verify_otp` | `AuthMe_OTP::ajax_verify_otp` | Verify OTP code |

---

## Hooks & Filters

### Actions

- `authme_otp_cleanup` - Scheduled cron action for cleaning expired OTPs
- `wp_enqueue_scripts` - Enqueue frontend assets
- `wp_footer` - Inject overlay HTML
- `init` - Register rewrite rules
- `template_redirect` - Handle virtual page and WooCommerce interception

### Filters

- `query_vars` - Register custom query variables
- `plugin_action_links_{plugin_basename}` - Add settings link to plugins page

### Constants

| Constant | Description |
|----------|-------------|
| `AUTHME_VERSION` | Plugin version |
| `AUTHME_PLUGIN_DIR` | Server path to plugin directory |
| `AUTHME_PLUGIN_URL` | URL to plugin directory |
| `AUTHME_PLUGIN_BASENAME` | Plugin basename identifier |

---

## Troubleshooting

### Plugin not working after upload

1. Make sure you ran `composer install` and the `vendor` folder exists
2. Check PHP version is 7.4 or higher
3. Verify WordPress version is 5.0 or higher
4. Check that the `json` and `mbstring` PHP extensions are enabled

### OTP not being sent

1. Check that WordPress can send emails (use WP Mail SMTP plugin)
2. Verify the email address is correct
3. Check spam/junk folders
4. Ensure the `wp_authme_otp_storage` table exists

### Composer not working

1. Verify Composer is installed: `composer --version`
2. Check PHP is in system PATH
3. Try running: `composer install --no-dev`
4. If there are memory issues: `php -d memory_limit=512M composer install`

### Database table not created

1. Go to WordPress Admin > AuthMe > Database
2. Click "Create/Update Table"
3. Check for any database errors in PHP error log

### Overlay not appearing

1. Make sure you're logged out (popup only shows for non-logged-in users)
2. Check browser console for JavaScript errors
3. Verify assets are being loaded (check network tab)
4. Try visiting `/authme` URL directly

---

## Support

For issues and feature requests, contact the author at https://arttechfuzion.com

---

## License

This plugin is proprietary software by Art-Tech Fuzion.
