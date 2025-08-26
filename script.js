class TeamWorkApp {
    constructor() {
        this.loadDataFromURL();
        this.currentEditingTask = null;
        this.init();
    }

    loadDataFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const sharedData = urlParams.get('data');
        
        if (sharedData) {
            try {
                const decoded = JSON.parse(atob(sharedData));
                this.members = decoded.members || [];
                this.tasks = decoded.tasks || [];
                // Save to localStorage for persistence
                this.saveData();
            } catch (e) {
                console.warn('Invalid shared data, loading from localStorage');
                this.loadFromLocalStorage();
            }
        } else {
            this.loadFromLocalStorage();
        }
    }

    loadFromLocalStorage() {
        this.members = JSON.parse(localStorage.getItem('teamMembers')) || [];
        this.tasks = JSON.parse(localStorage.getItem('teamTasks')) || [];
    }

    init() {
        this.setupEventListeners();
        this.renderDashboard();
        this.renderTeam();
        this.renderTasks();
        this.updateAssigneeOptions();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchSection(e.target.dataset.section));
        });

        // Forms
        document.getElementById('member-form').addEventListener('submit', (e) => this.addMember(e));
        document.getElementById('task-form').addEventListener('submit', (e) => this.addTask(e));

        // Filters
        document.getElementById('task-filter').addEventListener('change', () => this.renderTasks());
        document.getElementById('category-filter').addEventListener('change', () => this.renderTasks());
        document.getElementById('member-filter').addEventListener('change', () => this.renderTasks());

        // Modal clicks
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });
    }

    switchSection(section) {
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        
        document.getElementById(section).classList.add('active');
        document.querySelector(`[data-section="${section}"]`).classList.add('active');
    }

    addMember(e) {
        e.preventDefault();
        const name = document.getElementById('member-name').value;
        const role = document.getElementById('member-role').value;
        const email = document.getElementById('member-email').value;

        const member = {
            id: Date.now(),
            name,
            role,
            email,
            joinDate: new Date().toLocaleDateString()
        };

        this.members.push(member);
        this.saveData();
        this.renderTeam();
        this.renderDashboard();
        this.updateAssigneeOptions();
        this.closeModal('member-modal');
        document.getElementById('member-form').reset();
    }

    addTask(e) {
        e.preventDefault();
        const title = document.getElementById('task-title').value;
        const description = document.getElementById('task-description').value;
        const priority = document.getElementById('task-priority').value;
        const startDate = document.getElementById('task-start-date').value;
        const endDate = document.getElementById('task-end-date').value;
        const assigneeId = document.getElementById('task-assignee').value;

        if (this.currentEditingTask) {
            const taskIndex = this.tasks.findIndex(t => t.id === this.currentEditingTask);
            this.tasks[taskIndex] = {
                ...this.tasks[taskIndex],
                title, description, priority, startDate, endDate, assigneeId
            };
            this.currentEditingTask = null;
        } else {
            const task = {
                id: Date.now(),
                title, description, priority, startDate, endDate, assigneeId,
                status: 'pending',
                createdDate: new Date().toLocaleDateString()
            };
            this.tasks.push(task);
            this.addActivity(`New task "${title}" was created`);
        }

        this.saveData();
        this.renderTasks();
        this.renderDashboard();
        this.closeModal('task-modal');
        document.getElementById('task-form').reset();
        document.getElementById('task-modal-title').textContent = 'Add New Task';
        document.getElementById('task-submit-btn').textContent = 'Add Task';
    }

    editTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        this.currentEditingTask = taskId;
        document.getElementById('task-title').value = task.title;
        document.getElementById('task-description').value = task.description;
        document.getElementById('task-priority').value = task.priority;
        document.getElementById('task-start-date').value = task.startDate;
        document.getElementById('task-end-date').value = task.endDate;
        document.getElementById('task-assignee').value = task.assigneeId;
        
        document.getElementById('task-modal-title').textContent = 'Edit Task';
        document.getElementById('task-submit-btn').textContent = 'Update Task';
        this.openModal('task-modal');
    }

    deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            const task = this.tasks.find(t => t.id === taskId);
            this.tasks = this.tasks.filter(t => t.id !== taskId);
            this.saveData();
            this.renderTasks();
            this.renderDashboard();
            this.addActivity(`Task "${task.title}" was deleted`);
        }
    }

    updateTaskStatus(taskId, status) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.status = status;
            this.saveData();
            this.renderTasks();
            this.renderDashboard();
        }
    }

    renderDashboard() {
        document.getElementById('total-members').textContent = this.members.length;
        document.getElementById('total-tasks').textContent = this.tasks.length;
        document.getElementById('completed-tasks').textContent = this.tasks.filter(t => t.status === 'completed').length;
        document.getElementById('pending-tasks').textContent = this.tasks.filter(t => t.status === 'in-progress').length;
    }

    renderTeam() {
        const teamGrid = document.getElementById('team-grid');
        teamGrid.innerHTML = this.members.map(member => `
            <div class="member-card">
                <div class="member-avatar">${member.name.charAt(0).toUpperCase()}</div>
                <h3>${member.name}</h3>
                <p>${member.role}</p>
                <p><i class="fas fa-envelope"></i> ${member.email}</p>
                <p><small>Joined: ${member.joinDate}</small></p>
            </div>
        `).join('');
    }

    renderTasks() {
        const container = document.getElementById('tasks-container');
        const statusFilter = document.getElementById('task-filter').value;
        const categoryFilter = document.getElementById('category-filter').value;
        const memberFilter = document.getElementById('member-filter').value;

        let filteredTasks = this.tasks;
        if (statusFilter !== 'all') {
            filteredTasks = filteredTasks.filter(task => task.status === statusFilter);
        }
        if (categoryFilter !== 'all') {
            filteredTasks = filteredTasks.filter(task => task.category === categoryFilter);
        }
        if (memberFilter !== 'all') {
            filteredTasks = filteredTasks.filter(task => task.assigneeId == memberFilter);
        }

        container.innerHTML = filteredTasks.map(task => {
            const assignee = this.members.find(m => m.id == task.assigneeId);
            return `
                <div class="task-card priority-${task.priority}">
                    <div class="task-header">
                        <div>
                            <div class="task-title">${task.title}</div>
                            <div class="task-meta">
                                <span><i class="fas fa-calendar"></i> ${task.startDate} - ${task.endDate}</span>
                                ${assignee ? `<span><i class="fas fa-user"></i> ${assignee.name}</span>` : ''}
                            </div>
                        </div>
                        <div>
                            <span class="status-badge status-${task.status}">${task.status.replace('-', ' ')}</span>
                        </div>
                    </div>
                    <p>${task.description}</p>
                    <div style="margin-top: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        <select onchange="app.updateTaskStatus(${task.id}, this.value)" style="width: auto; padding: 5px;">
                            <option value="pending" ${task.status === 'pending' ? 'selected' : ''}>Pending</option>
                            <option value="in-progress" ${task.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                            <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>Completed</option>
                        </select>
                        <button onclick="app.editTask(${task.id})" class="btn-secondary" style="padding: 5px 10px; font-size: 0.8rem;">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button onclick="app.deleteTask(${task.id})" class="btn-secondary" style="padding: 5px 10px; font-size: 0.8rem; background: #dc3545;">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateAssigneeOptions() {
        const taskSelect = document.getElementById('task-assignee');
        const filterSelect = document.getElementById('member-filter');
        
        const memberOptions = this.members.map(member => `<option value="${member.id}">${member.name}</option>`).join('');
        
        taskSelect.innerHTML = '<option value="">Unassigned</option>' + memberOptions;
        filterSelect.innerHTML = '<option value="all">All Members</option><option value="">Unassigned</option>' + memberOptions;
    }

    addActivity(message) {
        const activities = JSON.parse(localStorage.getItem('activities')) || [];
        activities.unshift({
            message,
            timestamp: new Date().toLocaleString()
        });
        activities.splice(10); // Keep only last 10 activities
        localStorage.setItem('activities', JSON.stringify(activities));
        this.renderActivities();
    }

    renderActivities() {
        const activities = JSON.parse(localStorage.getItem('activities')) || [];
        const container = document.getElementById('activity-list');
        container.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <strong>${activity.message}</strong>
                <br><small>${activity.timestamp}</small>
            </div>
        `).join('') || '<div class="activity-item">No recent activity</div>';
    }

    clearActivity() {
        localStorage.removeItem('activities');
        this.renderActivities();
    }

    saveData() {
        localStorage.setItem('teamMembers', JSON.stringify(this.members));
        localStorage.setItem('teamTasks', JSON.stringify(this.tasks));
        this.updateShareURL();
    }

    updateShareURL() {
        const data = {
            members: this.members,
            tasks: this.tasks
        };
        const encoded = btoa(JSON.stringify(data));
        const newURL = `${window.location.origin}${window.location.pathname}?data=${encoded}`;
        window.history.replaceState({}, '', newURL);
    }

    getShareableURL() {
        const data = {
            members: this.members,
            tasks: this.tasks
        };
        const encoded = btoa(JSON.stringify(data));
        return `${window.location.origin}${window.location.pathname}?data=${encoded}`;
    }

    copyShareURL() {
        const url = this.getShareableURL();
        navigator.clipboard.writeText(url).then(() => {
            alert('Share URL copied to clipboard!');
        }).catch(() => {
            prompt('Copy this URL to share:', url);
        });
    }

    openModal(modalId) {
        document.getElementById(modalId).style.display = 'block';
    }

    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }
}

// Global functions for HTML onclick events
function openModal(modalId) {
    app.openModal(modalId);
}

function closeModal(modalId) {
    app.closeModal(modalId);
}

// Initialize app
const app = new TeamWorkApp();

// Load activities on startup
app.renderActivities();
