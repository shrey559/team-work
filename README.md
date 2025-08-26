<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TeamWork - Collaboration Hub</title>
    <link rel="stylesheet" href="style.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body>
    <header>
        <div class="container">
            <h1><i class="fas fa-users"></i> TeamWork</h1>
            <nav>
                <button class="nav-btn active" data-section="dashboard">Dashboard</button>
                <button class="nav-btn" data-section="team">Team</button>
                <button class="nav-btn" data-section="tasks">Tasks</button>
                <button class="btn-share" onclick="app.copyShareURL()" title="Share this workspace">
                    <i class="fas fa-share-alt"></i> Share
                </button>
            </nav>
        </div>
    </header>

    <main class="container">
        <!-- Dashboard Section -->
        <section id="dashboard" class="section active">
            <h2>Project Overview</h2>
            <div class="stats-grid">
                <div class="stat-card">
                    <i class="fas fa-users"></i>
                    <h3 id="total-members">0</h3>
                    <p>Team Members</p>
                </div>
                <div class="stat-card">
                    <i class="fas fa-tasks"></i>
                    <h3 id="total-tasks">0</h3>
                    <p>Total Tasks</p>
                </div>
                <div class="stat-card">
                    <i class="fas fa-check-circle"></i>
                    <h3 id="completed-tasks">0</h3>
                    <p>Completed</p>
                </div>
                <div class="stat-card">
                    <i class="fas fa-clock"></i>
                    <h3 id="pending-tasks">0</h3>
                    <p>In Progress</p>
                </div>
            </div>
            <div class="recent-activity">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <h3>Recent Activity</h3>
                    <button class="btn-secondary" onclick="app.clearActivity()" style="padding: 5px 10px; font-size: 0.8rem;">
                        <i class="fas fa-trash"></i> Clear
                    </button>
                </div>
                <div id="activity-list" class="activity-list"></div>
            </div>
        </section>

        <!-- Team Section -->
        <section id="team" class="section">
            <div class="section-header">
                <h2>Team Members</h2>
                <button class="btn-primary" onclick="openModal('member-modal')">
                    <i class="fas fa-plus"></i> Add Member
                </button>
            </div>
            <div id="team-grid" class="team-grid"></div>
        </section>

        <!-- Tasks Section -->
        <section id="tasks" class="section">
            <div class="section-header">
                <h2>Tasks</h2>
                <div class="task-controls">
                    <select id="task-filter">
                        <option value="all">All Tasks</option>
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                    <select id="category-filter">
                        <option value="all">All Categories</option>
                        <option value="development">Development</option>
                        <option value="design">Design</option>
                        <option value="testing">Testing</option>
                        <option value="documentation">Documentation</option>
                        <option value="meeting">Meeting</option>
                    </select>
                    <select id="member-filter">
                        <option value="all">All Members</option>
                    </select>
                    <button class="btn-primary" onclick="openModal('task-modal')">
                        <i class="fas fa-plus"></i> Add Task
                    </button>
                </div>
            </div>
            <div id="tasks-container" class="tasks-container"></div>
        </section>
    </main>

    <!-- Member Modal -->
    <div id="member-modal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Add Team Member</h3>
                <span class="close" onclick="closeModal('member-modal')">&times;</span>
            </div>
            <form id="member-form">
                <div class="form-group">
                    <label>Name</label>
                    <input type="text" id="member-name" required>
                </div>
                <div class="form-group">
                    <label>Role</label>
                    <input type="text" id="member-role" placeholder="e.g., Developer, Designer">
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="member-email">
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="closeModal('member-modal')">Cancel</button>
                    <button type="submit" class="btn-primary">Add Member</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Task Modal -->
    <div id="task-modal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="task-modal-title">Add New Task</h3>
                <span class="close" onclick="closeModal('task-modal')">&times;</span>
            </div>
            <form id="task-form">
                <div class="form-group">
                    <label>Task Title</label>
                    <input type="text" id="task-title" required>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea id="task-description" rows="3"></textarea>
                </div>
                <div class="form-group">
                    <label>Priority</label>
                    <select id="task-priority">
                        <option value="low">Low</option>
                        <option value="medium" selected>Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Start Date</label>
                        <input type="date" id="task-start-date" required>
                    </div>
                    <div class="form-group">
                        <label>End Date</label>
                        <input type="date" id="task-end-date" required>
                    </div>
                </div>
                <div class="form-group">
                    <label>Assign to</label>
                    <select id="task-assignee">
                        <option value="">Unassigned</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="closeModal('task-modal')">Cancel</button>
                    <button type="submit" class="btn-primary" id="task-submit-btn">Add Task</button>
                </div>
            </form>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>
