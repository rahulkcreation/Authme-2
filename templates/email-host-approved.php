<?php
/**
 * AuthMe Host Approved Email Template
 * @package AuthMe
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Approved</title>
</head>
<body style="margin:0; padding:0; background-color:#f8fafc; font-family:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',Roboto,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc; padding:40px 20px;">
        <tr>
            <td align="center">
                <table width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.06);">
                    <tr>
                        <td style="background-color:#16a34a; padding:28px 32px; text-align:center;">
                            <h1 style="margin:0; color:#ffffff; font-size:22px; font-weight:700;">
                                🎉 <?php echo esc_html( $site_name ); ?>
                            </h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:36px 32px 24px;">
                            <h2 style="margin:0 0 16px; font-size:20px; font-weight:700; color:#0f172a; text-align:center;">
                                Application Approved!
                            </h2>
                            <p style="margin:0 0 24px; font-size:15px; color:#475569; line-height:1.6; text-align:center;">
                                Congratulations, your host account is approved! Welcome to the completely new way to manage everything. Here are your securely generated login credentials:
                            </p>
                            
                            <div style="background-color:#f1f5f9; border-radius:12px; padding:20px; margin-bottom:24px;">
                                <p style="margin:0 0 8px; font-size:14px; color:#64748b;"><strong>Username:</strong> <span style="color:#0f172a;"><?php echo esc_html( $authme_host_username ); ?></span></p>
                                <p style="margin:0; font-size:14px; color:#64748b;"><strong>Password:</strong> <span style="color:#0f172a; font-family:monospace;"><?php echo esc_html( $authme_host_password ); ?></span></p>
                            </div>

                            <p style="margin:0 0 16px; font-size:14px; color:#ef4444; font-weight:600; text-align:center;">
                                Please securely login and change this auto-generated password immediately!
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:20px 32px; border-top:1px solid #e2e8f0; text-align:center;">
                            <p style="margin:0; font-size:12px; color:#94a3b8;">
                                &copy; <?php echo esc_html( gmdate( 'Y' ) ); ?> <?php echo esc_html( $site_name ); ?>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
