// Student Dashboard Logic

// Check if user is logged in
if (!sessionStorage.getItem('userType') || sessionStorage.getItem('userType') !== 'student') {
    window.location.href = 'index.html';
}

const studentId = sessionStorage.getItem('userId');
const studentName = sessionStorage.getItem('userName');
const studentClass = sessionStorage.getItem('userClass');

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadUserInfo();
    loadOverview();
    setupNavigation();
    loadSubjectFilters();
});

// Load user information
function loadUserInfo() {
    document.getElementById('userName').textContent = studentName;
    document.getElementById('userClass').textContent = studentClass;
    
    const avatar = document.getElementById('userAvatar');
    avatar.textContent = studentName.charAt(0).toUpperCase();
}

// Setup navigation
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Hide all sections
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Show selected section
            const sectionId = this.dataset.section + '-section';
            document.getElementById(sectionId).classList.add('active');
            
            // Update page title
            const titles = {
                overview: { title: 'Dashboard Overview', subtitle: 'Welcome back to your learning portal' },
                performance: { title: 'Academic Performance', subtitle: 'View your grades and progress' },
                notes: { title: 'Lesson Notes', subtitle: 'Download and study lesson materials' },
                videos: { title: 'Video Library', subtitle: 'Watch educational videos' },
                assessments: { title: 'Assessments', subtitle: 'View continuous assessment scores' },
                gallery: { title: 'School Gallery', subtitle: 'Browse school events and activities' },
                settings: { title: 'Account Settings', subtitle: 'Manage your account preferences' }
            };
            
            const pageInfo = titles[this.dataset.section];
            document.getElementById('pageTitle').textContent = pageInfo.title;
            document.getElementById('pageSubtitle').textContent = pageInfo.subtitle;
            
            // Load section data
            loadSectionData(this.dataset.section);
        });
    });
}

// Load section data
function loadSectionData(section) {
    switch(section) {
        case 'performance':
            loadPerformance();
            break;
        case 'notes':
            loadLessonNotes();
            break;
        case 'videos':
            loadVideos();
            break;
        case 'assessments':
            loadAssessments();
            break;
        case 'gallery':
            loadGallery();
            break;
    }
}

// Load overview statistics
function loadOverview() {
    const student = SchoolData.getStudentById(studentId);
    
    if (student) {
        // Total subjects
        document.getElementById('totalSubjects').textContent = student.subjects.length;
        
        // Attendance
        document.getElementById('attendance').textContent = (student.attendance || 95) + '%';
        
        // Average score
        const results = SchoolData.getStudentResults(studentId);
        if (results.length > 0) {
            const average = results.reduce((sum, r) => sum + r.total, 0) / results.length;
            document.getElementById('averageScore').textContent = average.toFixed(1) + '%';
        }
        
        // Total notes
        const notes = SchoolData.lessonNotes.filter(n => n.class === studentClass);
        document.getElementById('totalNotes').textContent = notes.length;
    }
}

// Load performance data
function loadPerformance() {
    const term = document.getElementById('termFilter').value;
    const results = SchoolData.getStudentResults(studentId).filter(r => r.term === term);
    
    const tbody = document.getElementById('performanceBody');
    
    if (results.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No results available for this term</td></tr>';
        return;
    }
    
    tbody.innerHTML = results.map(result => `
        <tr>
            <td>${result.subject}</td>
            <td>${result.ca}</td>
            <td>${result.exam}</td>
            <td><strong>${result.total}</strong></td>
            <td><span class="grade-badge grade-${result.grade}">${result.grade}</span></td>
            <td>${result.remark}</td>
        </tr>
    `).join('');
}

// Load lesson notes
function loadLessonNotes() {
    const subjectFilter = document.getElementById('subjectFilter').value;
    let notes = SchoolData.getLessonNotesByClass(studentClass);
    
    if (subjectFilter) {
        notes = notes.filter(n => n.subject === subjectFilter);
    }
    
    const grid = document.getElementById('notesGrid');
    
    if (notes.length === 0) {
        grid.innerHTML = '<p class="empty-state">No lesson notes available</p>';
        return;
    }
    
    grid.innerHTML = notes.map(note => `
        <div class="resource-card">
            <h4>${note.title}</h4>
            <p><strong>Subject:</strong> ${note.subject}</p>
            <p><strong>Topic:</strong> ${note.topic}</p>
            <p><strong>Date:</strong> ${new Date(note.date).toLocaleDateString()}</p>
            <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                <button class="btn btn-primary btn-small" onclick="downloadNote('${note.id}')">
                    📥 Download
                </button>
                <button class="btn btn-secondary btn-small" onclick="printNote('${note.id}')">
                    🖨️ Print
                </button>
            </div>
        </div>
    `).join('');
}

// Load videos
function loadVideos() {
    const subjectFilter = document.getElementById('videoSubjectFilter').value;
    let videos = SchoolData.videos.filter(v => v.class === studentClass);
    
    if (subjectFilter) {
        videos = videos.filter(v => v.subject === subjectFilter);
    }
    
    const grid = document.getElementById('videosGrid');
    
    if (videos.length === 0) {
        grid.innerHTML = '<p class="empty-state">No videos available</p>';
        return;
    }
    
    grid.innerHTML = videos.map(video => `
        <div class="resource-card">
            <h4>${video.title}</h4>
            <p><strong>Subject:</strong> ${video.subject}</p>
            <p><strong>Topic:</strong> ${video.topic}</p>
            <p><strong>Duration:</strong> ${video.duration || 'N/A'}</p>
            <button class="btn btn-success btn-small" onclick="watchVideo('${video.url}')">
                ▶️ Watch Video
            </button>
        </div>
    `).join('');
}

// Load assessments
function loadAssessments() {
    const assessments = SchoolData.assessments.filter(a => a.class === studentClass);
    const grid = document.getElementById('assessmentsGrid');
    
    if (assessments.length === 0) {
        grid.innerHTML = '<p class="empty-state">No assessments available</p>';
        return;
    }
    
    grid.innerHTML = assessments.map(assessment => `
        <div class="resource-card">
            <h4>${assessment.title}</h4>
            <p><strong>Subject:</strong> ${assessment.subject}</p>
            <p><strong>Type:</strong> ${assessment.type}</p>
            <p><strong>Due Date:</strong> ${new Date(assessment.dueDate).toLocaleDateString()}</p>
            <button class="btn btn-primary btn-small">View Assessment</button>
        </div>
    `).join('');
}

// Load gallery
function loadGallery() {
    const gallery = SchoolData.gallery;
    const grid = document.getElementById('galleryGrid');
    
    if (gallery.length === 0) {
        grid.innerHTML = '<p class="empty-state">No gallery items yet</p>';
        return;
    }
    
    grid.innerHTML = gallery.map(item => `
        <div class="gallery-item">
            <img src="${item.url}" alt="${item.title}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22200%22%3E%3Crect fill=%22%23e2e8f0%22 width=%22300%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 fill=%22%2364748b%22%3E${item.title}%3C/text%3E%3C/svg%3E'">
            <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.7); color: white; padding: 1rem;">
                <h4 style="margin: 0; font-size: 0.95rem;">${item.title}</h4>
                <small>${item.category}</small>
            </div>
        </div>
    `).join('');
}

// Load subject filters
function loadSubjectFilters() {
    const student = SchoolData.getStudentById(studentId);
    if (!student) return;
    
    const subjects = student.subjects;
    
    const subjectFilter = document.getElementById('subjectFilter');
    const videoSubjectFilter = document.getElementById('videoSubjectFilter');
    
    subjects.forEach(subject => {
        const option1 = document.createElement('option');
        option1.value = subject;
        option1.textContent = subject;
        subjectFilter.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = subject;
        option2.textContent = subject;
        videoSubjectFilter.appendChild(option2);
    });
}

// Change password
document.getElementById('changePasswordForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    const student = SchoolData.getStudentById(studentId);
    
    if (currentPassword !== student.password) {
        alert('Current password is incorrect');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        alert('New passwords do not match');
        return;
    }
    
    if (newPassword.length < 6) {
        alert('Password must be at least 6 characters');
        return;
    }
    
    SchoolData.updateStudent(studentId, { password: newPassword });
    alert('Password changed successfully!');
    this.reset();
});

// Utility functions
function downloadNote(noteId) {
    const note = SchoolData.lessonNotes.find(n => n.id === noteId);
    if (note) {
        alert(`Downloading: ${note.title}\n\nNote: In a real application, this would download the actual file.`);
    }
}

function printNote(noteId) {
    const note = SchoolData.lessonNotes.find(n => n.id === noteId);
    if (note) {
        alert(`Printing: ${note.title}\n\nNote: In a real application, this would open the print dialog.`);
    }
}

function watchVideo(url) {
    if (url.startsWith('http')) {
        window.open(url, '_blank');
    } else {
        alert('Video URL: ' + url);
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.clear();
        window.location.href = 'index.html';
    }
}

// Term filter change
document.getElementById('termFilter').addEventListener('change', loadPerformance);
document.getElementById('subjectFilter').addEventListener('change', loadLessonNotes);
document.getElementById('videoSubjectFilter').addEventListener('change', loadVideos);
