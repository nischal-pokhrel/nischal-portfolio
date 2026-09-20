from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
from datetime import datetime
import json
import os

app = Flask(__name__)
app.secret_key = 'e13fbdfad40ecad91d8c3d4c9d1624d63d3ae18b4536c6994f50043cab3c063e'

# Data storage (in-memory for simplicity)
courses_data = []
students_data = []
admins_data = []

# Initialize with sample data
def initialize_data():
    global courses_data, students_data, admins_data
    
    # Sample courses
    courses_data = [
        {
            'id': 1,
            'code': 'CS101',
            'name': 'Introduction to Computer Science',
            'instructor': 'Nischal Pokhrel',
            'credits': 3,
            'capacity': 30,
            'enrolled': 15,
            'description': 'Fundamental concepts of computer science and programming',
            'schedule': 'Mon, Wed 10:00 AM - 11:30 AM',
            'room': 'Room 201'
        },
        {
            'id': 2,
            'code': 'MATH201',
            'name': 'Calculus II',
            'instructor': 'Prof. Sabnam Oli',
            'credits': 4,
            'capacity': 25,
            'enrolled': 20,
            'description': 'Advanced calculus concepts and applications',
            'schedule': 'Tue, Thu 2:00 PM - 3:30 PM',
            'room': 'Room 305'
        },
        {
            'id': 3,
            'code': 'ENG101',
            'name': 'English Composition',
            'instructor': 'Dr. Ayush',
            'credits': 3,
            'capacity': 35,
            'enrolled': 28,
            'description': 'Writing and communication skills development',
            'schedule': 'Mon, Wed, Fri 1:00 PM - 2:00 PM',
            'room': 'Room 102'
        },
        {
            'id': 4,
            'code': 'PHY101',
            'name': 'Physics I',
            'instructor': 'Prof. Kishan',
            'credits': 4,
            'capacity': 28,
            'enrolled': 22,
            'description': 'Classical mechanics and thermodynamics',
            'schedule': 'Tue, Thu 9:00 AM - 10:30 AM',
            'room': 'Room 401'
        },
        {
            'id': 5,
            'code': 'BIO101',
            'name': 'Biology I',
            'instructor': 'Dr.Abijeet',
            'credits': 3,
            'capacity': 32,
            'enrolled': 25,
            'description': 'Introduction to biological sciences',
            'schedule': 'Mon, Wed, Fri 11:00 AM - 12:00 PM',
            'room': 'Room 301'
        }
    ]
    
    # Sample students
    students_data = [
        {
            'id': 1,
            'username': 'nischal_123',
            'password': 'password123',
            'name': 'Nischal Pokhrel',
            'email': 'nischalpokhrel69@gmail.com',
            'student_id': 'STU001',
            'major': 'Computer Science',
            'registered_courses': [1, 2]
        },
        {
            'id': 2,
            'username': 'kishan_123',
            'password': 'password123',
            'name': 'Jane Smith',
            'email': 'kishan321@gmail.com',
            'student_id': 'STU002',
            'major': 'Mathematics',
            'registered_courses': [2, 3]
        }
    ]
    
    # Sample admin
    admins_data = [
        {
            'id': 1,
            'username': 'admin',
            'password': 'admin123',
            'name': 'Nischal Pokhrel',
            'email': 'nischal@education.edu'
        }
    ]

# OOP Classes
class Course:
    def __init__(self, course_id, code, name, instructor, credits, capacity, description, schedule, room):
        self.id = course_id
        self.code = code
        self.name = name
        self.instructor = instructor
        self.credits = credits
        self.capacity = capacity
        self.enrolled = 0
        self.description = description
        self.schedule = schedule
        self.room = room
    
    def to_dict(self):
        return {
            'id': self.id,
            'code': self.code,
            'name': self.name,
            'instructor': self.instructor,
            'credits': self.credits,
            'capacity': self.capacity,
            'enrolled': self.enrolled,
            'description': self.description,
            'schedule': self.schedule,
            'room': self.room
        }
    
    def is_available(self):
        return self.enrolled < self.capacity
    
    def enroll_student(self):
        if self.is_available():
            self.enrolled += 1
            return True
        return False
    
    def drop_student(self):
        if self.enrolled > 0:
            self.enrolled -= 1
            return True
        return False

class Student:
    def __init__(self, student_id, username, password, name, email, student_id_code, major):
        self.id = student_id
        self.username = username
        self.password = password
        self.name = name
        self.email = email
        self.student_id = student_id_code
        self.major = major
        self.registered_courses = []
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'password': self.password,
            'name': self.name,
            'email': self.email,
            'student_id': self.student_id,
            'major': self.major,
            'registered_courses': self.registered_courses
        }
    
    def register_course(self, course_id):
        if course_id not in self.registered_courses:
            self.registered_courses.append(course_id)
            return True
        return False
    
    def drop_course(self, course_id):
        if course_id in self.registered_courses:
            self.registered_courses.remove(course_id)
            return True
        return False
    
    def get_registered_courses(self):
        return self.registered_courses

class Admin:
    def __init__(self, admin_id, username, password, name, email):
        self.id = admin_id
        self.username = username
        self.password = password
        self.name = name
        self.email = email
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'password': self.password,
            'name': self.name,
            'email': self.email
        }

# Helper functions
def find_student_by_username(username):
    for student in students_data:
        if student['username'] == username:
            return student
    return None

def find_admin_by_username(username):
    for admin in admins_data:
        if admin['username'] == username:
            return admin
    return None

def find_course_by_id(course_id):
    for course in courses_data:
        if course['id'] == course_id:
            return course
    return None

def get_next_id(items):
    if not items:
        return 1
    return max(item['id'] for item in items) + 1

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user_type = request.form['user_type']
        
        if user_type == 'student':
            student = find_student_by_username(username)
            if student and student['password'] == password:
                session['user_id'] = student['id']
                session['user_type'] = 'student'
                session['username'] = student['username']
                flash('Login successful!', 'success')
                return redirect(url_for('student_dashboard'))
        elif user_type == 'admin':
            admin = find_admin_by_username(username)
            if admin and admin['password'] == password:
                session['user_id'] = admin['id']
                session['user_type'] = 'admin'
                session['username'] = admin['username']
                flash('Login successful!', 'success')
                return redirect(url_for('admin_dashboard'))
        
        flash('Invalid username or password!', 'error')
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        name = request.form['name']
        email = request.form['email']
        major = request.form['major']
        
        # Check if username already exists
        if find_student_by_username(username):
            flash('Username already exists!', 'error')
            return render_template('register.html')
        
        # Create new student
        new_student = {
            'id': get_next_id(students_data),
            'username': username,
            'password': password,
            'name': name,
            'email': email,
            'student_id': f"STU{get_next_id(students_data):03d}",
            'major': major,
            'registered_courses': []
        }
        
        students_data.append(new_student)
        flash('Registration successful! Please login.', 'success')
        return redirect(url_for('login'))
    
    return render_template('register.html')

@app.route('/logout')
def logout():
    session.clear()
    flash('Logged out successfully!', 'success')
    return redirect(url_for('index'))

@app.route('/student/dashboard')
def student_dashboard():
    if 'user_type' not in session or session['user_type'] != 'student':
        return redirect(url_for('login'))
    
    student = find_student_by_username(session['username'])
    registered_courses = [find_course_by_id(course_id) for course_id in student['registered_courses']]
    available_courses = [course for course in courses_data if course['id'] not in student['registered_courses']]
    
    return render_template('student_dashboard.html', 
                         student=student, 
                         registered_courses=registered_courses,
                         available_courses=available_courses,
                         courses_data=courses_data)

@app.route('/admin/dashboard')
def admin_dashboard():
    if 'user_type' not in session or session['user_type'] != 'admin':
        return redirect(url_for('login'))
    
    admin = find_admin_by_username(session['username'])
    return render_template('admin_dashboard.html', 
                         admin=admin,
                         courses=courses_data,
                         students=students_data)

@app.route('/student/register_course/<int:course_id>', methods=['POST'])
def register_course(course_id):
    if 'user_type' not in session or session['user_type'] != 'student':
        return redirect(url_for('login'))
    
    student = find_student_by_username(session['username'])
    course = find_course_by_id(course_id)
    
    if not course:
        flash('Course not found!', 'error')
        return redirect(url_for('student_dashboard'))
    
    if course_id in student['registered_courses']:
        flash('You are already registered for this course!', 'error')
        return redirect(url_for('student_dashboard'))
    
    if course['enrolled'] >= course['capacity']:
        flash('Course is full!', 'error')
        return redirect(url_for('student_dashboard'))
    
    # Register for course
    student['registered_courses'].append(course_id)
    course['enrolled'] += 1
    
    flash(f'Successfully registered for {course["name"]}!', 'success')
    return redirect(url_for('student_dashboard'))

@app.route('/student/drop_course/<int:course_id>', methods=['POST'])
def drop_course(course_id):
    if 'user_type' not in session or session['user_type'] != 'student':
        return redirect(url_for('login'))
    
    student = find_student_by_username(session['username'])
    course = find_course_by_id(course_id)
    
    if not course:
        flash('Course not found!', 'error')
        return redirect(url_for('student_dashboard'))
    
    if course_id not in student['registered_courses']:
        flash('You are not registered for this course!', 'error')
        return redirect(url_for('student_dashboard'))
    
    # Drop course
    student['registered_courses'].remove(course_id)
    course['enrolled'] -= 1
    
    flash(f'Successfully dropped {course["name"]}!', 'success')
    return redirect(url_for('student_dashboard'))

@app.route('/admin/add_course', methods=['GET', 'POST'])
def add_course():
    if 'user_type' not in session or session['user_type'] != 'admin':
        return redirect(url_for('login'))
    
    if request.method == 'POST':
        new_course = {
            'id': get_next_id(courses_data),
            'code': request.form['code'],
            'name': request.form['name'],
            'instructor': request.form['instructor'],
            'credits': int(request.form['credits']),
            'capacity': int(request.form['capacity']),
            'enrolled': 0,
            'description': request.form['description'],
            'schedule': request.form['schedule'],
            'room': request.form['room']
        }
        
        courses_data.append(new_course)
        flash('Course added successfully!', 'success')
        return redirect(url_for('admin_dashboard'))
    
    return render_template('add_course.html')

@app.route('/admin/remove_course/<int:course_id>', methods=['POST'])
def remove_course(course_id):
    if 'user_type' not in session or session['user_type'] != 'admin':
        return redirect(url_for('login'))
    
    course = find_course_by_id(course_id)
    if not course:
        flash('Course not found!', 'error')
        return redirect(url_for('admin_dashboard'))
    
    # Remove course from all students
    for student in students_data:
        if course_id in student['registered_courses']:
            student['registered_courses'].remove(course_id)
    
    # Remove course
    courses_data.remove(course)
    flash('Course removed successfully!', 'success')
    return redirect(url_for('admin_dashboard'))

@app.route('/student/profile', methods=['GET', 'POST'])
def student_profile():
    if 'user_type' not in session or session['user_type'] != 'student':
        return redirect(url_for('login'))
    
    student = find_student_by_username(session['username'])
    
    if request.method == 'POST':
        student['name'] = request.form['name']
        student['email'] = request.form['email']
        student['major'] = request.form['major']
        flash('Profile updated successfully!', 'success')
        return redirect(url_for('student_dashboard'))
    
    return render_template('student_profile.html', student=student)

@app.route('/api/search_courses')
def search_courses():
    query = request.args.get('q', '').lower()
    if not query:
        return jsonify(courses_data)
    
    filtered_courses = []
    for course in courses_data:
        if (query in course['name'].lower() or 
            query in course['code'].lower() or 
            query in course['instructor'].lower()):
            filtered_courses.append(course)
    
    return jsonify(filtered_courses)

if __name__ == '__main__':
    initialize_data()
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port) 