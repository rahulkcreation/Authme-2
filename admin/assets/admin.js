/**
 * AuthMe Admin JavaScript
 *
 * Handles database status checking and table creation
 * via AJAX on the admin Database Management page.
 *
 * @package AuthMe
 */

(function () {
    'use strict';

    /* ── Helpers ──────────────────────────── */

    /**
     * Show a quick toast notification in the admin area.
     *
     * @param {string} message Toast message text.
     * @param {string} type    'success' or 'error'.
     */
    function showAdminToast(message, type) {
        // Remove any existing toast
        var existing = document.querySelector('.authme-admin-toast');
        if (existing) existing.remove();

        var toast = document.createElement('div');
        toast.className = 'authme-admin-toast authme-admin-toast-' + type;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(function () {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s ease';
            setTimeout(function () {
                toast.remove();
            }, 300);
        }, 4000);
    }

    /**
     * Reusable Confirmation Modal
     */
    function showAdminConfirm(title, message, onConfirm) {
        var overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(15, 23, 42, 0.55)';
        overlay.style.zIndex = '999999';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.backdropFilter = 'blur(4px)';
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.2s ease';

        var modal = document.createElement('div');
        modal.style.backgroundColor = 'var(--authme-white, #ffffff)';
        modal.style.padding = '24px';
        modal.style.borderRadius = '12px';
        modal.style.width = '320px';
        modal.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
        modal.style.fontFamily = 'Inter, sans-serif';
        modal.style.transform = 'translateY(20px)';
        modal.style.transition = 'transform 0.2s ease';

        var titleEl = document.createElement('h3');
        titleEl.textContent = title;
        titleEl.style.marginTop = '0';
        titleEl.style.color = 'var(--authme-text-main, #0f172a)';

        var msgEl = document.createElement('p');
        msgEl.textContent = message;
        msgEl.style.color = 'var(--authme-text-muted, #64748b)';
        msgEl.style.fontSize = '14px';

        var getOut = document.createElement('div');
        getOut.style.display = 'flex';
        getOut.style.justifyContent = 'flex-end';
        getOut.style.gap = '10px';
        getOut.style.marginTop = '24px';

        var noBtn = document.createElement('button');
        noBtn.textContent = 'No, Cancel';
        noBtn.style.padding = '8px 16px';
        noBtn.style.border = '1px solid var(--authme-border, #e2e8f0)';
        noBtn.style.backgroundColor = '#f8fafc';
        noBtn.style.borderRadius = '6px';
        noBtn.style.cursor = 'pointer';
        noBtn.style.color = 'var(--authme-text-main, #0f172a)';

        var yesBtn = document.createElement('button');
        yesBtn.textContent = 'Yes, Logout';
        yesBtn.style.padding = '8px 16px';
        yesBtn.style.border = 'none';
        yesBtn.style.backgroundColor = 'var(--authme-error, #dc2626)';
        yesBtn.style.color = '#ffffff';
        yesBtn.style.borderRadius = '6px';
        yesBtn.style.cursor = 'pointer';

        var closeOverlay = function() {
            overlay.style.opacity = '0';
            modal.style.transform = 'translateY(20px)';
            setTimeout(function() { overlay.remove(); }, 200);
        };

        noBtn.onclick = closeOverlay;
        yesBtn.onclick = function() { closeOverlay(); onConfirm(); };

        getOut.appendChild(noBtn);
        getOut.appendChild(yesBtn);
        modal.appendChild(titleEl);
        modal.appendChild(msgEl);
        modal.appendChild(getOut);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // trigger anim
        requestAnimationFrame(function() {
            overlay.style.opacity = '1';
            modal.style.transform = 'translateY(0)';
        });
    }

    // Expose for global admin use
    window.authmeShowAdminConfirm = showAdminConfirm;

    /* ── DB Status Renderer ──────────────── */

    /**
     * Render the database status table into the container.
     *
     * @param {object} data Status data from the server.
     */
    function renderStatusTable(data) {
        var container = document.getElementById('authme-db-status-container');
        if (!container) return;

        var html = '';

        // Table existence row
        html += '<table class="authme-db-status-table">';
        html += '<thead><tr><th>Item</th><th>Status</th></tr></thead>';
        html += '<tbody>';

        html += '<tr>';
        html += '<td><strong>' + (data.otp_table ? data.otp_table.name : 'wp_authme_otp_storage') + '</strong> (Table)</td>';
        html += '<td class="' + (data.otp_table && data.otp_table.exists ? 'authme-status-ok' : 'authme-status-missing') + '">';
        html += (data.otp_table && data.otp_table.exists) ? '✅ Exists' : '❌ Missing';
        html += '</td></tr>';

        // OTP Column rows
        if (data.otp_table && data.otp_table.exists && data.otp_table.columns) {
            var columns = data.otp_table.columns;
            for (var col in columns) {
                if (columns.hasOwnProperty(col)) {
                    html += '<tr>';
                    html += '<td>&nbsp;&nbsp;&nbsp;&nbsp;↳ <code>' + col + '</code></td>';
                    html += '<td class="' + (columns[col] ? 'authme-status-ok' : 'authme-status-missing') + '">';
                    html += columns[col] ? '✅ OK' : '❌ Missing';
                    html += '</td></tr>';
                }
            }
        }

        // Host Table existence row
        html += '<tr>';
        html += '<td><strong>' + (data.host_table ? data.host_table.name : 'wp_host_request') + '</strong> (Table)</td>';
        html += '<td class="' + (data.host_table && data.host_table.exists ? 'authme-status-ok' : 'authme-status-missing') + '">';
        html += (data.host_table && data.host_table.exists) ? '✅ Exists' : '❌ Missing';
        html += '</td></tr>';

        // Host Column rows
        if (data.host_table && data.host_table.exists && data.host_table.columns) {
            var hostCols = data.host_table.columns;
            for (var hcol in hostCols) {
                if (hostCols.hasOwnProperty(hcol)) {
                    html += '<tr>';
                    html += '<td>&nbsp;&nbsp;&nbsp;&nbsp;↳ <code>' + hcol + '</code></td>';
                    html += '<td class="' + (hostCols[hcol] ? 'authme-status-ok' : 'authme-status-missing') + '">';
                    html += hostCols[hcol] ? '✅ OK' : '❌ Missing';
                    html += '</td></tr>';
                }
            }
        }

        html += '</tbody></table>';

        container.innerHTML = html;
    }

    /* ── AJAX: Fetch DB Status ───────────── */

    function fetchDbStatus() {
        var container = document.getElementById('authme-db-status-container');
        if (!container) return;

        container.innerHTML = '<p class="authme-admin-loading">Checking database status…</p>';

        var formData = new FormData();
        formData.append('action', 'authme_admin_check_db');
        formData.append('nonce', authme_admin.nonce);

        fetch(authme_admin.ajax_url, {
            method: 'POST',
            body: formData,
            credentials: 'same-origin',
        })
        .then(function (response) { return response.json(); })
        .then(function (result) {
            if (result.success) {
                renderStatusTable(result.data);
            } else {
                container.innerHTML = '<p style="color:#dc2626;">Failed to check database status.</p>';
            }
        })
        .catch(function () {
            container.innerHTML = '<p style="color:#dc2626;">Network error. Please try again.</p>';
        });
    }

    /* ── AJAX: Create Tables ─────────────── */

    function createTables() {
        var btn = document.getElementById('authme-btn-create-tables');
        if (!btn) return;

        btn.disabled = true;
        btn.textContent = 'Creating…';

        var formData = new FormData();
        formData.append('action', 'authme_admin_create_tables');
        formData.append('nonce', authme_admin.nonce);

        fetch(authme_admin.ajax_url, {
            method: 'POST',
            body: formData,
            credentials: 'same-origin',
        })
        .then(function (response) { return response.json(); })
        .then(function (result) {
            btn.disabled = false;
            btn.textContent = 'Create / Update Tables';

            if (result.success) {
                showAdminToast(result.data.message, 'success');
                fetchDbStatus(); // Refresh the status table
            } else {
                showAdminToast(result.data.message || 'An error occurred.', 'error');
            }
        })
        .catch(function () {
            btn.disabled = false;
            btn.textContent = 'Create / Update Tables';
            showAdminToast('Network error. Please try again.', 'error');
        });
    }

    /* ── Event Listeners ─────────────────── */

    document.addEventListener('DOMContentLoaded', function () {
        // Auto-check status on page load (only on the database page)
        if (document.getElementById('authme-admin-database')) {
            fetchDbStatus();
        }

        // Create Tables button
        var createBtn = document.getElementById('authme-btn-create-tables');
        if (createBtn) {
            createBtn.addEventListener('click', createTables);
        }

        // Refresh Status button
        var refreshBtn = document.getElementById('authme-btn-refresh-status');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', fetchDbStatus);
        }

    });

})();
