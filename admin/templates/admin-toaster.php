<?php
/**
 * AuthMe Admin — Global Toaster Component
 *
 * Included globally in the admin area's footer hook
 * to display "Refresh" or "Create/Update" success messages.
 *
 * @package AuthMe
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}
?>
<!-- Toaster Container -->
<div id="authme-admin-toaster" class="authme-toaster" style="display: none;">
    <div class="authme-toaster-title" id="authme-toaster-title">Success</div>
    <div class="authme-toaster-message" id="authme-toaster-message">Operation completed successfully!</div>
    <button class="authme-toaster-close" onclick="window.authmeCloseToaster()" aria-label="Close">&times;</button>
</div>
