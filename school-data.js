// School Data Management System
// This file handles all data storage using localStorage

const SchoolData = {
    // Initialize or load existing data
    init() {
        if (!localStorage.getItem('schoolData')) {
            // Initialize with default data
            const defaultData = {
                students: [
                    {
                        id: 'STU001',
                        name: 'John Doe',
                        admissionNumber: 'AS2024001',
                        class: 'JSS 1',
                        password: 'AS2024001',
                        canChangePassword: true,
                        email: 'john.doe@student.com',
                        parentEmail: 'parent.doe@email.com',
                        subjects: ['Mathematics', 'English Language', 'Basic Science', 'Social Studies', 'Computer Studies', 'Civic Education'],
                        results: [],
                        attendance: 95,
                        dateEnrolled: '2024-09-01'
                    }
                ],
                teachers: [
                    {
                        id: 'TCH001',
                        name: 'Mrs. Sarah Johnson',
                        email: 'sarah.johnson@accuratestep.edu.ng',
                        password: 'Teacher@123',
                        subjects: ['Mathematics', 'Further Mathematics'],
                        classes: ['JSS 1', 'SS 2 Ruby (Science)'],
                        dateJoined: '2020-01-15',
                        lessonNotes: [],
                        videos: [],
                        assessments: []
                    }
                ],
                parents: [
                    {
                        id: 'PAR001',
                        name: 'Mr. Doe',
                        email: 'parent.doe@email.com',
                        childId: 'STU001',
                        childAdmissionNumber: 'AS2024001',
                        phoneNumber: '+234 XXX XXX XXXX',
                        feesPaid: []
                    }
                ],
                lessonNotes: [],
                videos: [],
                assessments: [],
                results: [],
                gallery: [],
                payments: [],
                announcements: [],
                settings: {
                    schoolName: 'Accurate Step International School',
                    address: 'Kabusa, Behind Living Faith Church, Abuja',
                    email: 'info@accuratestepschool.edu.ng',
                    phone: '+234 XXX XXX XXXX',
                    currentSession: '2024/2025',
                    currentTerm: 'First Term',
                    bankAccount: {
                        bankName: 'First Bank of Nigeria',
                        accountNumber: '1234567890',
                        accountName: 'Accurate Step International School'
                    }
                }
            };
            
            localStorage.setItem('schoolData', JSON.stringify(defaultData));
        }
    },
    
    // Get all data
    getData() {
        return JSON.parse(localStorage.getItem('schoolData'));
    },
    
    // Save data
    saveData() {
        localStorage.setItem('schoolData', JSON.stringify(this.getData()));
    },
    
    // Students
    get students() {
        return this.getData().students;
    },
    
    getStudentById(id) {
        return this.students.find(s => s.id === id);
    },
    
    getStudentsByClass(className) {
        return this.students.filter(s => s.class === className);
    },
    
    addStudent(student) {
        const data = this.getData();
        data.students.push(student);
        localStorage.setItem('schoolData', JSON.stringify(data));
    },
    
    updateStudent(id, updates) {
        const data = this.getData();
        const index = data.students.findIndex(s => s.id === id);
        if (index !== -1) {
            data.students[index] = { ...data.students[index], ...updates };
            localStorage.setItem('schoolData', JSON.stringify(data));
        }
    },
    
    // Teachers
    get teachers() {
        return this.getData().teachers;
    },
    
    getTeacherById(id) {
        return this.teachers.find(t => t.id === id);
    },
    
    addTeacher(teacher) {
        const data = this.getData();
        data.teachers.push(teacher);
        localStorage.setItem('schoolData', JSON.stringify(data));
    },
    
    // Parents
    get parents() {
        return this.getData().parents;
    },
    
    getParentById(id) {
        return this.parents.find(p => p.id === id);
    },
    
    // Lesson Notes
    get lessonNotes() {
        return this.getData().lessonNotes || [];
    },
    
    addLessonNote(note) {
        const data = this.getData();
        if (!data.lessonNotes) data.lessonNotes = [];
        data.lessonNotes.push(note);
        localStorage.setItem('schoolData', JSON.stringify(data));
    },
    
    getLessonNotesBySubject(subject) {
        return this.lessonNotes.filter(n => n.subject === subject);
    },
    
    getLessonNotesByClass(className) {
        return this.lessonNotes.filter(n => n.class === className);
    },
    
    // Videos
    get videos() {
        return this.getData().videos || [];
    },
    
    addVideo(video) {
        const data = this.getData();
        if (!data.videos) data.videos = [];
        data.videos.push(video);
        localStorage.setItem('schoolData', JSON.stringify(data));
    },
    
    getVideosBySubject(subject) {
        return this.videos.filter(v => v.subject === subject);
    },
    
    // Assessments
    get assessments() {
        return this.getData().assessments || [];
    },
    
    addAssessment(assessment) {
        const data = this.getData();
        if (!data.assessments) data.assessments = [];
        data.assessments.push(assessment);
        localStorage.setItem('schoolData', JSON.stringify(data));
    },
    
    // Results
    get results() {
        return this.getData().results || [];
    },
    
    addResult(result) {
        const data = this.getData();
        if (!data.results) data.results = [];
        data.results.push(result);
        localStorage.setItem('schoolData', JSON.stringify(data));
    },
    
    getStudentResults(studentId) {
        return this.results.filter(r => r.studentId === studentId);
    },
    
    getResultsByClass(className, subject, term) {
        return this.results.filter(r => 
            r.class === className && 
            r.subject === subject && 
            r.term === term
        );
    },
    
    // Gallery
    get gallery() {
        return this.getData().gallery || [];
    },
    
    addGalleryItem(item) {
        const data = this.getData();
        if (!data.gallery) data.gallery = [];
        data.gallery.push(item);
        localStorage.setItem('schoolData', JSON.stringify(data));
    },
    
    // Payments
    get payments() {
        return this.getData().payments || [];
    },
    
    addPayment(payment) {
        const data = this.getData();
        if (!data.payments) data.payments = [];
        data.payments.push(payment);
        localStorage.setItem('schoolData', JSON.stringify(data));
    },
    
    getStudentPayments(studentId) {
        return this.payments.filter(p => p.studentId === studentId);
    },
    
    // Announcements
    get announcements() {
        return this.getData().announcements || [];
    },
    
    addAnnouncement(announcement) {
        const data = this.getData();
        if (!data.announcements) data.announcements = [];
        data.announcements.push(announcement);
        localStorage.setItem('schoolData', JSON.stringify(data));
    },
    
    // Settings
    get settings() {
        return this.getData().settings;
    },
    
    updateSettings(updates) {
        const data = this.getData();
        data.settings = { ...data.settings, ...updates };
        localStorage.setItem('schoolData', JSON.stringify(data));
    },
    
    // Utility functions
    generateId(prefix) {
        return prefix + Date.now() + Math.random().toString(36).substr(2, 9);
    },
    
    getCurrentSession() {
        return this.settings.currentSession;
    },
    
    getCurrentTerm() {
        return this.settings.currentTerm;
    },
    
    // Classes list
    classes: [
        'JSS 1',
        'JSS 2 Diamond',
        'JSS 2 Silver',
        'JSS 3 Crystal',
        'SS 1 Pearl',
        'SS 2 Ruby (Science)',
        'SS 2 Sapphire (Art & Commercial)',
        'SS 3 Beryl (Science)',
        'SS 3 Jasper (Art & Commercial)'
    ],
    
    // Subjects list
    allSubjects: [
        'Mathematics',
        'English Language',
        'Biology',
        'Chemistry',
        'Physics',
        'Economics',
        'Geography',
        'Government',
        'Literature',
        'Computer Science',
        'Further Mathematics',
        'Agricultural Science',
        'Commerce',
        'Accounting',
        'Civic Education',
        'Basic Science',
        'Basic Technology',
        'Social Studies',
        'Computer Studies',
        'Cultural & Creative Arts'
    ]
};

// Initialize data on load
SchoolData.init();
