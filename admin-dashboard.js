// Admin Dashboard Logic

// Check if user is logged in as admin
if (!sessionStorage.getItem('userType') || sessionStorage.getItem('userType') !== 'admin') {
    window.location.href = 'index.html';
}

const adminName = sessionStorage.getItem('userName');

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadUserInfo();
    loadOverview();
    setupNavigation();
    loadAllData();
});

// Load user information
function loadUserInfo() {
    document.getElementById('userName').textContent = adminName;
}

// Setup navigation
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            
            const sectionId = this.dataset.section + '-section';
            document.getElementById(sectionId).classList.add('active');
            
            const titles = {
                overview: { title: 'Admin Dashboard', subtitle: 'Manage your school operations' },
                students: { title: 'Student Management', subtitle: 'View and manage all students' },
                teachers: { title: 'Teacher Management', subtitle: 'View and manage all teachers' },
                parents: { title: 'Parent Management', subtitle: 'View and manage parent accounts' },
                gallery: { title: 'School Gallery', subtitle: 'Upload and manage school photos' },
                payments: { title: 'Payment Records', subtitle: 'View all fee payments' },
                announcements: { title: 'Announcements', subtitle: 'Post school announcements' },
                settings: { title: 'System Settings', subtitle: 'Configure school information' }
            };
            
            const pageInfo = titles[this.dataset.section];
            document.getElementById('pageTitle').textContent = pageInfo.title;
            document.getElementById('pageSubtitle').textContent = pageInfo.subtitle;
            
            loadSectionData(this.dataset.section);
        });
    });
}

// Switch to a specific section programmatically
function switchSection(section) {
    const navItem = document.querySelector(`[data-section="${section}"]`);
    if (navItem) {
        navItem.click();
    }
}

// Load section data
function loadSectionData(section) {
    switch(section) {
        case 'students':
            loadStudents();
            break;
        case 'teachers':
            loadTeachers();
            break;
        case 'parents':
            loadParents();
            break;
        case 'gallery':
            loadGallery();
            break;
        case 'payments':
            loadPayments();
            break;
        case 'announcements':
            loadAnnouncements();
            break;
        case 'settings':
            loadSettings();
            break;
    }
}

// Load all initial data
function loadAllData() {
    loadStudents();
    loadTeachers();
    loadParents();
    loadGallery();
    loadPayments();
    loadAnnouncements();
    loadSettings();
}

// Load overview statistics
function loadOverview() {
    const students = SchoolData.students;
    const teachers = SchoolData.teachers;
    const parents = SchoolData.parents;
    const payments = SchoolData.payments;
    
    document.getElementById('totalStudents').textContent = students.length;
    document.getElementById('totalTeachers').textContent = teachers.length;
    document.getElementById('totalParents').textContent = parents.length;
    
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
    document.getElementById('totalRevenue').textContent = '₦' + totalRevenue.toLocaleString();
}

// Load students
function loadStudents() {
    const classFilter = document.getElementById('classFilter')?.value || '';
    let students = SchoolData.students;
    
    if (classFilter) {
        students = students.filter(s => s.class === classFilter);
    }
    
    const tbody = document.getElementById('studentsBody');
    
    if (students.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No students found</td></tr>';
        return;
    }
    
    tbody.innerHTML = students.map(student => `
        <tr>
            <td><strong>${student.admissionNumber}</strong></td>
            <td>${student.name}</td>
            <td>${student.class}</td>
            <td>${student.parentEmail || 'N/A'}</td>
            <td><span class="grade-badge grade-A">Active</span></td>
            <td>
                <button class="btn btn-secondary btn-small" onclick="viewStudent('${student.id}')">View</button>
            </td>
        </tr>
    `).join('');
}

function filterStudents() {
    loadStudents();
}

// Load teachers
function loadTeachers() {
    const teachers = SchoolData.teachers;
    const tbody = document.getElementById('teachersBody');
    
    if (teachers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No teachers registered yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = teachers.map(teacher => `
        <tr>
            <td>${teacher.name}</td>
            <td>${teacher.email}</td>
            <td>${teacher.subjects.join(', ')}</td>
            <td>${new Date(teacher.dateJoined).toLocaleDateString()}</td>
            <td>
                <button class="btn btn-secondary btn-small" onclick="viewTeacher('${teacher.id}')">View</button>
            </td>
        </tr>
    `).join('');
}

// Load parents
function loadParents() {
    const parents = SchoolData.parents;
    const tbody = document.getElementById('parentsBody');
    
    if (parents.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No parents registered yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = parents.map(parent => {
        const child = SchoolData.getStudentById(parent.childId);
        return `
            <tr>
                <td>${parent.name}</td>
                <td>${parent.email}</td>
                <td>${child ? child.name : 'N/A'}</td>
                <td>${parent.childAdmissionNumber}</td>
                <td>${parent.phoneNumber || 'N/A'}</td>
                <td>
                    <button class="btn btn-secondary btn-small" onclick="viewParent('${parent.id}')">View</button>
                </td>
            </tr>
        `;
    }).join('');
}

// Load gallery
function loadGallery() {
    const gallery = SchoolData.gallery;
    const grid = document.getElementById('galleryGrid');
    
    if (gallery.length === 0) {
        grid.innerHTML = '<p class="empty-state">No photos uploaded yet. Use the form above to add photos.</p>';
        return;
    }
    
    grid.innerHTML = gallery.map((item, index) => `
        <div class="gallery-item">
            <img src="${item.url}" alt="${item.title}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22200%22%3E%3Crect fill=%22%23e2e8f0%22 width=%22300%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 fill=%22%2364748b%22%3E${item.title}%3C/text%3E%3C/svg%3E'">
            <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.8); color: white; padding: 1rem;">
                <h4 style="margin: 0; font-size: 0.95rem;">${item.title}</h4>
                <small>${item.category}</small>
                <p style="font-size: 0.8rem; margin: 0.5rem 0 0 0;">${item.description || ''}</p>
                <button onclick="deleteGalleryItem(${index})" class="btn btn-danger btn-small" style="margin-top: 0.5rem;">Delete</button>
            </div>
        </div>
    `).join('');
}

// Load payments
function loadPayments() {
    const payments = SchoolData.payments;
    const tbody = document.getElementById('paymentsBody');
    
    if (payments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No payments recorded yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = payments.map(payment => {
        const student = SchoolData.getStudentById(payment.studentId);
        return `
            <tr>
                <td>${new Date(payment.date).toLocaleDateString()}</td>
                <td>${student ? student.name : 'N/A'}</td>
                <td>${payment.term}</td>
                <td><strong>₦${payment.amount.toLocaleString()}</strong></td>
                <td style="font-family: monospace; font-size: 0.85rem;">${payment.reference}</td>
                <td><span class="grade-badge grade-A">${payment.status}</span></td>
            </tr>
        `;
    }).join('');
}

// Load announcements
function loadAnnouncements() {
    const announcements = SchoolData.announcements;
    const container = document.getElementById('announcementsList');
    
    if (announcements.length === 0) {
        container.innerHTML = '<p class="empty-state">No announcements yet</p>';
        return;
    }
    
    container.innerHTML = announcements.map((announcement, index) => `
        <div class="announcement-item">
            <h4 style="margin-bottom: 0.5rem;">${announcement.title}</h4>
            <p style="margin-bottom: 0.5rem;">${announcement.message}</p>
            <small>${new Date(announcement.date).toLocaleDateString()}</small>
            <button onclick="deleteAnnouncement(${index})" class="btn btn-danger btn-small" style="margin-top: 0.5rem;">Delete</button>
        </div>
    `).join('');
}

// Load settings
function loadSettings() {
    const settings = SchoolData.settings;
    
    document.getElementById('schoolName').value = settings.schoolName;
    document.getElementById('schoolAddress').value = settings.address;
    document.getElementById('schoolPhone').value = settings.phone;
    document.getElementById('schoolEmail').value = settings.email;
    document.getElementById('currentSession').value = settings.currentSession;
    document.getElementById('currentTerm').value = settings.currentTerm;
    document.getElementById('bankName').value = settings.bankAccount.bankName;
    document.getElementById('accountNumber').value = settings.bankAccount.accountNumber;
    document.getElementById('accountName').value = settings.bankAccount.accountName;
}

// Upload photo form
document.getElementById('uploadPhotoForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const photo = {
        id: SchoolData.generateId('GAL'),
        title: document.getElementById('photoTitle').value,
        category: document.getElementById('photoCategory').value,
        url: document.getElementById('photoUrl').value,
        description: document.getElementById('photoDescription').value,
        date: new Date().toISOString()
    };
    
    SchoolData.addGalleryItem(photo);
    
    alert('Photo uploaded successfully!');
    this.reset();
    loadGallery();
});

// Add announcement form
document.getElementById('addAnnouncementForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const announcement = {
        id: SchoolData.generateId('ANN'),
        title: document.getElementById('announcementTitle').value,
        message: document.getElementById('announcementMessage').value,
        date: new Date().toISOString()
    };
    
    SchoolData.addAnnouncement(announcement);
    
    alert('Announcement posted successfully!');
    this.reset();
    loadAnnouncements();
});

// Settings form
document.getElementById('settingsForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const updates = {
        schoolName: document.getElementById('schoolName').value,
        address: document.getElementById('schoolAddress').value,
        phone: document.getElementById('schoolPhone').value,
        email: document.getElementById('schoolEmail').value,
        currentSession: document.getElementById('currentSession').value,
        currentTerm: document.getElementById('currentTerm').value,
        bankAccount: {
            bankName: document.getElementById('bankName').value,
            accountNumber: document.getElementById('accountNumber').value,
            accountName: document.getElementById('accountName').value
        }
    };
    
    SchoolData.updateSettings(updates);
    
    const newPassword = document.getElementById('newAdminPassword').value;
    if (newPassword) {
        // In a real system, this would be more secure
        localStorage.setItem('adminPassword', newPassword);
        alert('Settings and password updated successfully!');
    } else {
        alert('Settings updated successfully!');
    }
    
    document.getElementById('newAdminPassword').value = '';
});

// Utility functions
function viewStudent(studentId) {
    const student = SchoolData.getStudentById(studentId);
    if (student) {
        alert(`Student Details:\n\nName: ${student.name}\nAdmission No: ${student.admissionNumber}\nClass: ${student.class}\nEmail: ${student.email || 'N/A'}\nParent Email: ${student.parentEmail || 'N/A'}`);
    }
}

function viewTeacher(teacherId) {
    const teacher = SchoolData.getTeacherById(teacherId);
    if (teacher) {
        alert(`Teacher Details:\n\nName: ${teacher.name}\nEmail: ${teacher.email}\nSubjects: ${teacher.subjects.join(', ')}\nJoined: ${new Date(teacher.dateJoined).toLocaleDateString()}`);
    }
}

function viewParent(parentId) {
    const parent = SchoolData.getParentById(parentId);
    const child = SchoolData.getStudentById(parent.childId);
    if (parent) {
        alert(`Parent Details:\n\nName: ${parent.name}\nEmail: ${parent.email}\nPhone: ${parent.phoneNumber}\nChild: ${child ? child.name : 'N/A'}\nChild Admission: ${parent.childAdmissionNumber}`);
    }
}

function deleteGalleryItem(index) {
    if (confirm('Are you sure you want to delete this photo?')) {
        const data = SchoolData.getData();
        data.gallery.splice(index, 1);
        localStorage.setItem('schoolData', JSON.stringify(data));
        loadGallery();
        alert('Photo deleted successfully!');
    }
}

function deleteAnnouncement(index) {
    if (confirm('Are you sure you want to delete this announcement?')) {
        const data = SchoolData.getData();
        data.announcements.splice(index, 1);
        localStorage.setItem('schoolData', JSON.stringify(data));
        loadAnnouncements();
        alert('Announcement deleted successfully!');
    }
}

function showAddStudentForm() {
    alert('Student registration is handled through the Student Portal.\n\nStudents can register themselves using:\n1. Go to homepage\n2. Click "Student Portal"\n3. Click "Register here"\n4. Fill in details\n\nYou can also manually add students by modifying the school-data.js file.');
}

function showAddParentForm() {
    const studentAdmission = prompt('Enter the student\'s admission number:');
    if (!studentAdmission) return;
    
    const student = SchoolData.students.find(s => s.admissionNumber === studentAdmission);
    if (!student) {
        alert('Student not found with that admission number!');
        return;
    }
    
    const parentName = prompt('Enter parent\'s full name:');
    if (!parentName) return;
    
    const parentEmail = prompt('Enter parent\'s email address:');
    if (!parentEmail) return;
    
    const parentPhone = prompt('Enter parent\'s phone number:');
    if (!parentPhone) return;
    
    const newParent = {
        id: SchoolData.generateId('PAR'),
        name: parentName,
        email: parentEmail,
        childId: student.id,
        childAdmissionNumber: studentAdmission,
        phoneNumber: parentPhone,
        feesPaid: []
    };
    
    const data = SchoolData.getData();
    data.parents.push(newParent);
    localStorage.setItem('schoolData', JSON.stringify(data));
    
    alert('Parent account created successfully!\n\nLogin credentials:\nEmail: ' + parentEmail + '\nChild Admission: ' + studentAdmission);
    
    loadParents();
    loadOverview();
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.clear();
        window.location.href = 'index.html';
    }
}
