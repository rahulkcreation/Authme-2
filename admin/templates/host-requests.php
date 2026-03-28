<div class="wrap authme-host-wrapper">
    <h1 class="wp-heading-inline h-main-s-heading">Host Applications</h1>
    <hr class="wp-header-end">

    <main class="main-content" id="authme-host-main-view">
        <!-- Search -->
        <div class="search-wrapper">
            <span class="search-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </span>
            <input type="text" class="search-input" id="authmeSearchInput" placeholder="Search by name, email, or phone (min 3 chars)...">
        </div>

        <!-- Tabs -->
        <div class="tabs-container">
            <button class="tab-btn active" id="btn-pending" data-status="pending">Pending <span id="count-pending">(0)</span></button>
            <button class="tab-btn" id="btn-approved" data-status="approved">Approved <span id="count-approved">(0)</span></button>
            <button class="tab-btn" id="btn-rejected" data-status="rejected">Rejected <span id="count-rejected">(0)</span></button>
        </div>

        <!-- Mobile List View -->
        <div class="requests-list" id="requestsList">
            <!-- Populated via JS -->
        </div>

        <!-- Web Table View -->
        <div class="desktop-table-view">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Applicant Info</th>
                        <th>Status</th>
                        <th>Date Submitted</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="tableBody">
                    <!-- Populated via JS -->
                </tbody>
            </table>
            
            <div class="pagination-footer">
                <span class="overview-label" id="pageInfo">Showing 0 entries</span>
                <div class="page-btns" id="paginationBtns">
                    <!-- Pagination JS -->
                </div>
            </div>
        </div>
    </main>

    <!-- Detailed Form View (Hidden by Default) -->
    <main class="main-container" id="authme-view-form">
        <!-- Header -->
        <header class="header">
            <div class="header-left">
                <button class="btn-back" id="btnBackToMain">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                </button>
                <h1 class="page-title">Application Review</h1>
            </div>
            <span class="app-id" id="view-app-id">ID: </span>
        </header>

        <!-- Profile Card -->
        <section class="profile-card">
            <div class="profile-header">
                <div class="avatar" id="view-avatar">?</div>
                <div>
                    <h2 class="profile-name" id="view-name">Loading...</h2>
                    <p class="profile-handle" id="view-username">@loading</p>
                </div>
            </div>
            <div class="contact-details">
                <div class="contact-row dashed-border">
                    <span class="contact-label">Email</span>
                    <span class="contact-value" id="view-email">-</span>
                </div>
                <div class="contact-row">
                    <span class="contact-label">Phone</span>
                    <span class="contact-value" id="view-phone">-</span>
                </div>
            </div>
        </section>

        <!-- Documents Section -->
        <section class="section-mb">
            <h3 class="section-title">Uploaded Documents</h3>
            <div class="doc-list" id="view-doc-list">
                <!-- Dynamically injected -->
            </div>
        </section>

        <!-- Status Section -->
        <section class="section-mb">
            <h3 class="section-title">Application Status</h3>
            <div class="status-wrapper">
                <button class="status-btn" id="statusDropdownBtn">
                    <div class="status-info">
                        <div class="status-dot" id="view-status-dot"></div>
                        <span class="status-text" id="view-status-text">Pending</span>
                    </div>
                </button>
                <div id="statusDropdownMenu" class="status-dropdown-menu">
                    <div class="status-option" data-val="pending">Pending</div>
                    <div class="status-option" data-val="approved">Approve</div>
                    <div class="status-option" data-val="rejected">Reject</div>
                </div>
            </div>
        </section>

        <button class="btn-submit" id="btnSubmitReview">
            <span>Update Status</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
        </button>
    </main>

    <!-- Document Image Modal -->
    <div id="docViewerModal" class="doc-viewer-backdrop">
        <div class="doc-viewer-content">
            <button id="docViewerClose">&times;</button>
            <img id="docViewerImg" src="" alt="Document Preview">
        </div>
    </div>
</div>
