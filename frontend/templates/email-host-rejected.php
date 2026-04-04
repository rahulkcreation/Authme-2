<?php
/**
 * AuthMe Host Rejected Email Template
 * @package AuthMe
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Application Status Update</title>
</head>
<body style="margin:0; padding:0; background-color:#f8fafc; font-family:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',Roboto,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc; padding:40px 20px;">
        <tr>
            <td align="center">
                <table width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.06);">
                    <tr>
                        <td style="background-color:#dc2626; padding:28px 32px; text-align:center;">
                            <h1 style="margin:0; color:#ffffff; font-size:22px; font-weight:700;">
                                ⚠️ <?php echo esc_html( $site_name ); ?>
                            </h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:36px 32px 24px;">
                            <h2 style="margin:0 0 16px; font-size:20px; font-weight:700; color:#0f172a; text-align:center;">
                                Application Update
                            </h2>
                            <p style="margin:0 0 24px; font-size:15px; color:#475569; line-height:1.6; text-align:center;">
                                Sorry, your host account request has not been approved at this time. This could happen if your documents were unclear or did not meet our verification requirements.
                            </p>
                            
                            <div style="background-color:#fef2f2; border:1px solid #fecaca; border-radius:12px; padding:20px; margin-bottom:24px; text-align:center;">
                                <p style="margin:0 0 8px; font-size:14px; color:#991b1b;"><strong>Need more info?</strong></p>
                                <p style="margin:0; font-size:14px; color:#991b1b;">You can contact our administration team directly at <a href="mailto:<?php echo esc_attr( $admin_email ); ?>" style="color:#dc2626; font-weight:600; text-decoration:none;"><?php echo esc_html( $admin_email ); ?></a></p>
                            </div>
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
