(function($) {
    "use strict";

    var appState = {
        data: [],
        filter: 'pending', // default tab
        search: '',
        page: 1,
        pages: 1,
        currentViewId: 0,
        currentViewRawId: 0
    };

    var debounceTimer;

    $(document).ready(function() {
        if ($('#authme-host-main-view').length === 0) return;

        bindEvents();
        fetchRequests();
    });

    function bindEvents() {
        // Tabs
        $('.tab-btn').on('click', function() {
            var status = $(this).data('status');
            $('.tab-btn').removeClass('active');
            $(this).addClass('active');
            appState.filter = status;
            appState.page = 1;
            fetchRequests();
        });

        // Search (Debounce + min 3 chars)
        $('#authmeSearchInput').on('input', function() {
            var val = $(this).val().trim();
            
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(function() {
                if (val.length >= 3 || val.length === 0) {
                    appState.search = val;
                    appState.page = 1;
                    fetchRequests();
                }
            }, 500);
        });

        // Delegate View Forms click
        $(document).on('click', '.btn-view-forms', function() {
            var id = $(this).data('id');
            openViewForm(id);
        });

        // Back btn
        $('#btnBackToMain').on('click', function() {
            $('#authme-view-form').hide();
            $('#authme-host-main-view').fadeIn();
        });

        // Dropdown toggle
        $('#statusDropdownBtn').on('click', function() {
            // Only toggle if not disabled
            if (!$(this).prop('disabled')) {
                $('#statusDropdownMenu').slideToggle(150);
            }
        });

        // Dropdown option select
        $('.status-option').on('click', function() {
            var val = $(this).data('val');
            var text = $(this).text();
            
            appState.newStatus = val;
            $('#view-status-text').text(text);
            
            $('#view-status-dot').css('background-color', 
                val === 'approved' ? 'var(--authme-admin-success)' : 
                val === 'rejected' ? 'var(--authme-admin-error)' : 
                'var(--authme-admin-warning)'
            );
            
            $('#statusDropdownMenu').hide();
        });

        // Submit Status
        $('#btnSubmitReview').on('click', submitReview);

        // Doc Viewer
        $('#docViewerClose').on('click', function() {
            $('#docViewerModal').fadeOut();
        });
        
        // Delegate doc item click
        $(document).on('click', '.doc-item', function() {
            var b64 = $(this).data('b64');
            if (b64) {
                $('#docViewerImg').attr('src', b64);
                $('#docViewerModal').fadeIn().css('display', 'flex');
            }
        });
    }

    function fetchRequests() {
        var data = {
            action: 'authme_admin_get_host_requests',
            nonce: authme_admin.nonce,
            status: appState.filter,
            search: appState.search,
            page: appState.page
        };

        $('#requestsList').html('<div style="text-align:center; padding: 2rem; color: var(--authme-admin-text-muted);">Loading...</div>');
        $('#tableBody').html('<tr><td colspan="5" style="text-align:center; padding: 2rem; color: var(--authme-admin-text-muted);">Loading...</td></tr>');

        $.post(authme_admin.ajax_url, data, function(res) {
            if (res.success) {
                renderUI(res.data);
            } else {
                alert('Error fetching data: ' + res.data.message);
            }
        });
    }

    function renderUI(data) {
        var items = data.items;
        appState.pages = data.pages;
        
        // Update Headers
        $('#count-pending').text('(' + data.counts.pending + ')');
        $('#count-approved').text('(' + data.counts.approved + ')');
        $('#count-rejected').text('(' + data.counts.rejected + ')');
        
        var listHTML = '';
        var tableHTML = '';

        if (items.length === 0) {
            listHTML = '<div style="text-align:center; padding: 2rem; color: var(--authme-admin-text-muted);">No results found.</div>';
            tableHTML = '<tr><td colspan="5" style="text-align:center; padding: 2rem; color: var(--authme-admin-text-muted);">No results found.</td></tr>';
        } else {
            items.forEach(function(item) {
                // Mobile Card
                listHTML += `
                    <div class="request-card">
                        <div class="card-row">
                            <span class="label-sm">ID</span>
                            <span class="value-id">${item.id}</span>
                        </div>
                        <div class="card-row-app">
                            <span class="label-sm">Applicant Info</span>
                            <div class="applicant-details">
                                <span class="email">${item.email}</span>
                                <span class="phone">${item.phone}</span>
                            </div>
                        </div>
                        <div class="card-row">
                            <span class="label-sm">Status</span>
                            <span class="status-badge status-${item.status}">${item.status}</span>
                        </div>
                        <div class="card-row">
                            <span class="label-sm">Date</span>
                            <span class="date-value">${item.date}</span>
                        </div>
                        <button class="view-forms-btn btn-view-forms" data-id="${item.raw_id}">View Forms</button>
                    </div>`;

                // Desktop Table
                tableHTML += `
                    <tr>
                        <td><span class="value-id">${item.id}</span></td>
                        <td>
                            <div style="font-size:0.95rem; font-weight:700; color:#1e293b; margin-bottom:2px;">${item.email}</div>
                            <div style="font-size:0.85rem; color:#64748b;">${item.phone}</div>
                        </td>
                        <td><span class="status-badge status-${item.status}">${item.status}</span></td>
                        <td style="color:#64748b; font-size:0.85rem; font-weight:500;">${item.date}</td>
                        <td><button class="btn-table-view btn-view-forms" data-id="${item.raw_id}">View Forms</button></td>
                    </tr>`;
            });
        }

        $('#requestsList').html(listHTML);
        $('#tableBody').html(tableHTML);

        // Pagination
        renderPagination(data.total);
    }

    function renderPagination(totalItems) {
        var start = (appState.page - 1) * 10 + 1;
        var end = Math.min(start + 9, totalItems);
        if (totalItems === 0) { start = 0; end = 0; }
        
        $('#pageInfo').text('Showing ' + start + '-' + end + ' of ' + totalItems);

        var paginationHTML = '';
        if (appState.pages > 1) {
            paginationHTML += `<button class="p-btn p-prev" ${appState.page === 1 ? 'disabled' : ''}>Prev</button>`;
            
            for (var i = 1; i <= appState.pages; i++) {
                if (i === 1 || i === appState.pages || (i >= appState.page - 1 && i <= appState.page + 1)) {
                    var activeClass = i === appState.page ? 'active' : '';
                    paginationHTML += `<button class="p-btn p-num ${activeClass}" data-page="${i}">${i}</button>`;
                } else if (i === appState.page - 2 || i === appState.page + 2) {
                    paginationHTML += `<span style="padding:0 5px;">...</span>`;
                }
            }

            paginationHTML += `<button class="p-btn p-next" ${appState.page === appState.pages ? 'disabled' : ''}>Next</button>`;
        }

        $('#paginationBtns').html(paginationHTML);

        // Bind Pagination
        $('.p-num').on('click', function() {
            var p = $(this).data('page');
            appState.page = p;
            fetchRequests();
        });
        $('.p-prev').on('click', function() {
            if (appState.page > 1) { appState.page--; fetchRequests(); }
        });
        $('.p-next').on('click', function() {
            if (appState.page < appState.pages) { appState.page++; fetchRequests(); }
        });
    }

    function openViewForm(raw_id) {
        appState.currentViewRawId = raw_id;

        // Fetch single row
        var data = {
            action: 'authme_admin_get_single_host',
            nonce: authme_admin.nonce,
            id: raw_id
        };

        $('#authme-host-main-view').hide();
        $('#authme-view-form').fadeIn();
        
        // Loader states
        $('#view-app-id').text('Loading...');
        $('#view-name').text('Loading...');

        $.post(authme_admin.ajax_url, data, function(res) {
            if (res.success) {
                populateViewForm(res.data);
            } else {
                alert('Fetch failed: ' + res.data.message);
                $('#btnBackToMain').trigger('click');
            }
        });
    }

    function populateViewForm(data) {
        var ud = data.userData;
        
        $('#view-app-id').text('ID: ' + data.id);
        $('#view-name').text(ud.fullname || 'Unknown');
        $('#view-username').text('@' + (ud.username || ''));
        $('#view-avatar').text(ud.fullname ? ud.fullname.substring(0,2) : '??');
        $('#view-email').text(ud.email || '-');
        $('#view-phone').text(ud.mobile || '-');

        // Render Docs
        var docHTML = '';
        if (ud.documents) {
            if (ud.documents.aadharf) docHTML += createDocHTML('Aadhar Front', ud.documents.aadharf);
            if (ud.documents.aadharb) docHTML += createDocHTML('Aadhar Back', ud.documents.aadharb);
            if (ud.documents.pan) docHTML += createDocHTML('PAN Card', ud.documents.pan);
        }
        $('#view-doc-list').html(docHTML);

        // Status Binding
        appState.newStatus = data.status;
        var sBtn = $('#statusDropdownBtn');
        var sTxt = $('#view-status-text');
        var sDot = $('#view-status-dot');

        if (data.status === 'pending') {
            sBtn.prop('disabled', false);
            sTxt.text('Pending');
            sDot.css('background-color', 'var(--authme-admin-warning)');
            $('#btnSubmitReview').show();
        } else if (data.status === 'approved') {
            sBtn.prop('disabled', true);
            sTxt.text('Approved');
            sDot.css('background-color', 'var(--authme-admin-success)');
            $('#btnSubmitReview').hide();
        } else {
            sBtn.prop('disabled', true);
            sTxt.text('Rejected');
            sDot.css('background-color', 'var(--authme-admin-error)');
            $('#btnSubmitReview').hide();
        }
    }

    function createDocHTML(title, b64) {
        return `
        <div class="doc-item" data-b64="${b64}">
            <div class="doc-info">
                <div class="doc-icon-wrapper">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                </div>
                <span class="doc-name">${title}</span>
            </div>
            <button class="btn-view">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            </button>
        </div>`;
    }

    function submitReview() {
        var btn = $('#btnSubmitReview');
        var originalText = btn.html();
        
        if (appState.newStatus === 'pending') {
            alert('Please select Approve or Reject to process this request.');
            return;
        }

        var confirmMsg = appState.newStatus === 'approved' 
            ? "Are you sure you want to approve this request? An account will be created and an email sent."
            : "Are you sure you want to reject this request? An email will be sent to the applicant.";
            
        if (!confirm(confirmMsg)) return;

        btn.html('<span>Processing...</span>').prop('disabled', true).css('opacity', '0.8');

        var data = {
            action: 'authme_admin_process_host',
            nonce: authme_admin.nonce,
            id: appState.currentViewRawId,
            new_status: appState.newStatus
        };

        $.post(authme_admin.ajax_url, data, function(res) {
            btn.prop('disabled', false).css('opacity', '1');
            
            if (res.success) {
                btn.html('<span>Action Successful</span>').css('background-color', 'var(--authme-admin-success)');
                setTimeout(function() {
                    btn.html(originalText).css('background-color', 'var(--authme-admin-primary)');
                    $('#btnBackToMain').trigger('click');
                    fetchRequests(); // Refresh list
                }, 1500);
            } else {
                btn.html(originalText);
                alert(res.data.message || 'Operation failed.');
            }
        });
    }

})(jQuery);
