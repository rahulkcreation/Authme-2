/**
 * AuthMe Admin — Toaster Global Component JS
 *
 * @package AuthMe
 */
(function() {
    'use strict';

    window.authmeToasterTimeout = null;

    /**
     * Show the global admin toaster notification.
     *
     * @param {string} title   The title of the notification (e.g., "Refresh").
     * @param {string} message The detailed message (e.g., "Refresh successfully").
     */
    window.authmeShowToaster = function(title, message) {
        var toaster = document.getElementById('authme-admin-toaster');
        var toasterTitle = document.getElementById('authme-toaster-title');
        var toasterMessage = document.getElementById('authme-toaster-message');

        if (!toaster || !toasterTitle || !toasterMessage) return;

        toasterTitle.textContent = title;
        toasterMessage.textContent = message;
        
        toaster.style.display = 'block';
        toaster.classList.remove('hiding');

        // Clear any existing timeout
        if (window.authmeToasterTimeout) {
            clearTimeout(window.authmeToasterTimeout);
        }

        // Auto hide after 5 seconds
        window.authmeToasterTimeout = setTimeout(function() {
            window.authmeCloseToaster();
        }, 5000);
    };

    /**
     * Close and animate out the global admin toaster notification.
     */
    window.authmeCloseToaster = function() {
        var toaster = document.getElementById('authme-admin-toaster');
        if (!toaster) return;
        
        toaster.classList.add('hiding');
        
        setTimeout(function() {
            toaster.style.display = 'none';
            toaster.classList.remove('hiding');
        }, 300);
    };

})();
