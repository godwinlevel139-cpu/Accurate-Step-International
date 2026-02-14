// Main JavaScript for Accurate Step International School Portal

// Modal functions
function openLoginModal(type) {
    const modal = document.getElementById('loginModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalSubtitle = document.getElementById('modalSubtitle');
    
    // Hide all forms
    document.getElementById('studentForms').style.display = 'none';
    document.getElementById('teacherForms').style.display = 'none';
    document.getElementById('parentForms').style.display = 'none';
    document.getElementById('adminForms').style.display = 'none';
    
    // Show appropriate form
    switch(type) {
        case 'student':
            modalTitle.textContent = 'Student Portal';
            modalSubtitle.textContent = 'Login or register to access your dashboard';
            document.getElementById('studentForms').style.display = 'block';
            break;
        case 'teacher':
            modalTitle.textContent = 'Teacher Portal';
            modalSubtitle.textContent = 'Login or register to manage your classes';
            document.getElementById('teacherForms').style.display = 'block';
            break;
        case 'parent':
            modalTitle.textContent = 'Parent Portal';
            modalSubtitle.textContent = 'Login to monitor your child\'s progress';
            document.getElementById('parentForms').style.display = 'block';
            break;
        case 'admin':
            modalTitle.textContent = 'Admin Portal';
            modalSubtitle.textContent = 'Administrative access only';
            document.getElementById('adminForms').style.display = 'block';
            break;
    }
    
    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('loginModal').classList.remove('active');
    hideAlert();
}

// Toggle between login and register forms
function toggleStudentForm() {
    const loginForm = document.getElementById('studentLoginForm');
    const registerForm = document.getElementById('studentRegisterForm');
    
    if (loginForm.style.display === 'none') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    }
    hideAlert();
}

function toggleTeacherForm() {
    const loginForm = document.getElementById('teacherLoginForm');
    const registerForm = document.getElementById('teacherRegisterForm');
    
    if (loginForm.style.display === 'none') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    }
    hideAlert();
}

// Alert functions
function showAlert(message, type) {
    const alertBox = document.getElementById('alertBox');
    alertBox.textContent = message;
    alertBox.className = `alert ${type} active`;
}

function hideAlert() {
    const alertBox = document.getElementById('alertBox');
    alertBox.classList.remove('active');
}

// Validate password strength for teachers
function validatePassword(password) {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    return hasUpperCase && hasLowerCase && hasNumber && password.length >= 6;
}

// Student Login
document.getElementById('studentLoginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('studentLoginName').value;
    const admission = document.getElementById('studentLoginAdmission').value;
    
    // Get students from database
    const student = SchoolData.students.find(s => 
        s.name.toLowerCase() === name.toLowerCase() && 
        s.admissionNumber === admission
    );
    
    if (student) {
        // Store session
        sessionStorage.setItem('userType', 'student');
        sessionStorage.setItem('userId', student.id);
        sessionStorage.setItem('userName', student.name);
        sessionStorage.setItem('userClass', student.class);
        
        // Redirect to student dashboard
        window.location.href = 'student-dashboard.html';
    } else {
        showAlert('Invalid credentials. Please check your name and admission number.', 'error');
    }
});

// Student Registration
document.getElementById('studentRegisterForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('studentRegName').value;
    const admission = document.getElementById('studentRegAdmission').value;
    const studentClass = document.getElementById('studentClass').value;
    
    // Check if already exists
    const exists = SchoolData.students.find(s => s.admissionNumber === admission);
    
    if (exists) {
        showAlert('This admission number is already registered. Please login instead.', 'error');
        return;
    }
    
    // Create new student
    const newStudent = {
        id: 'STU' + Date.now(),
        name: name,
        admissionNumber: admission,
        class: studentClass,
        password: admission, // Default password is admission number
        canChangePassword: true,
        subjects: getSubjectsByClass(studentClass),
        results: [],
        attendance: []
    };
    
    SchoolData.students.push(newStudent);
    SchoolData.saveData();
    
    showAlert('Registration successful! You can now login with your credentials.', 'success');
    
    // Switch to login form after 2 seconds
    setTimeout(() => {
        toggleStudentForm();
        hideAlert();
    }, 2000);
});

// Teacher Login
document.getElementById('teacherLoginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('teacherLoginEmail').value;
    const password = document.getElementById('teacherLoginPassword').value;
    
    const teacher = SchoolData.teachers.find(t => 
        t.email.toLowerCase() === email.toLowerCase() && 
        t.password === password
    );
    
    if (teacher) {
        sessionStorage.setItem('userType', 'teacher');
        sessionStorage.setItem('userId', teacher.id);
        sessionStorage.setItem('userName', teacher.name);
        sessionStorage.setItem('userSubjects', JSON.stringify(teacher.subjects));
        
        window.location.href = 'teacher-dashboard.html';
    } else {
        showAlert('Invalid email or password.', 'error');
    }
});

// Teacher Registration
document.getElementById('teacherRegisterForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('teacherRegName').value;
    const email = document.getElementById('teacherRegEmail').value;
    const password = document.getElementById('teacherRegPassword').value;
    const subjectSelect = document.getElementById('teacherSubject');
    const subjects = Array.from(subjectSelect.selectedOptions).map(option => option.value);
    
    // Validate password
    if (!validatePassword(password)) {
        showAlert('Password must contain uppercase, lowercase letters and numbers (min 6 characters).', 'error');
        return;
    }
    
    // Check if already exists
    const exists = SchoolData.teachers.find(t => t.email.toLowerCase() === email.toLowerCase());
    
    if (exists) {
        showAlert('This email is already registered. Please login instead.', 'error');
        return;
    }
    
    if (subjects.length === 0) {
        showAlert('Please select at least one subject.', 'error');
        return;
    }
    
    // Create new teacher
    const newTeacher = {
        id: 'TCH' + Date.now(),
        name: name,
        email: email,
        password: password,
        subjects: subjects,
        classes: [],
        dateJoined: new Date().toISOString()
    };
    
    SchoolData.teachers.push(newTeacher);
    SchoolData.saveData();
    
    showAlert('Registration successful! You can now login.', 'success');
    
    setTimeout(() => {
        toggleTeacherForm();
        hideAlert();
    }, 2000);
});

// Parent Login
document.getElementById('parentLoginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('parentLoginEmail').value;
    const childAdmission = document.getElementById('parentChildAdmission').value;
    
    const parent = SchoolData.parents.find(p => 
        p.email.toLowerCase() === email.toLowerCase() && 
        p.childAdmissionNumber === childAdmission
    );
    
    if (parent) {
        sessionStorage.setItem('userType', 'parent');
        sessionStorage.setItem('userId', parent.id);
        sessionStorage.setItem('userName', parent.name);
        sessionStorage.setItem('childId', parent.childId);
        
        window.location.href = 'parent-dashboard.html';
    } else {
        showAlert('Invalid credentials. Please contact the school admin for access.', 'error');
    }
});

// Admin Login
document.getElementById('adminLoginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    
    // Default admin credentials (should be changed in production)
    if (username === 'admin' && password === 'Admin@123') {
        sessionStorage.setItem('userType', 'admin');
        sessionStorage.setItem('userId', 'ADMIN001');
        sessionStorage.setItem('userName', 'School Administrator');
        
        window.location.href = 'admin-dashboard.html';
    } else {
        showAlert('Invalid admin credentials.', 'error');
    }
});

// Helper function to get subjects by class
function getSubjectsByClass(className) {
    const commonSubjects = ['Mathematics', 'English Language', 'Civic Education'];
    
    if (className.includes('JSS')) {
        return [...commonSubjects, 'Basic Science', 'Basic Technology', 'Social Studies', 
                'Computer Studies', 'Agricultural Science', 'Cultural & Creative Arts'];
    } else if (className.includes('Science')) {
        return [...commonSubjects, 'Biology', 'Chemistry', 'Physics', 'Further Mathematics', 
                'Computer Science', 'Agricultural Science'];
    } else {
        return [...commonSubjects, 'Economics', 'Geography', 'Government', 'Literature', 
                'Commerce', 'Accounting', 'Computer Science'];
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('loginModal');
    if (event.target === modal) {
        closeModal();
    }
}
