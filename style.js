let questions = []; // Stores all quiz questions
let records = [];   // Stores student scores
let currentStudent = "";

const PASSCODE = "Winners2026";

// Tab Switching
function showTab(id) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    event.currentTarget.classList.add('active');
}

// Admin Sub-tabs
function showAdminSub(id) {
    document.getElementById('sub-manage').classList.add('hidden');
    document.getElementById('sub-dashboard').classList.add('hidden');
    document.getElementById('nav-manage').classList.remove('active-sub');
    document.getElementById('nav-dashboard').classList.remove('active-sub');
    
    document.getElementById('sub-' + id).classList.remove('hidden');
    document.getElementById('nav-' + id).classList.add('active-sub');
    if(id === 'dashboard') renderRecords();
}

function adminLogin() {
    if(document.getElementById('adminPass').value === PASSCODE) {
        document.getElementById('admin-login').classList.add('hidden');
        document.getElementById('admin-panel').classList.remove('hidden');
    } else { alert("Wrong Passcode"); }
}

function toggleInputs() {
    const type = document.getElementById('qType').value;
    document.getElementById('mcq-options').classList.toggle('hidden', type !== 'mcq');
    document.getElementById('tf-options').classList.toggle('hidden', type !== 'tf');
}

// Save Question
function saveQuestion() {
    const text = document.getElementById('qText').value;
    const type = document.getElementById('qType').value;
    let questionObj = { text, type };

    if(type === 'mcq') {
        const opts = Array.from(document.querySelectorAll('.opt')).map(i => i.value);
        const correctIdx = document.querySelector('input[name="correct"]:checked').value;
        questionObj.options = opts;
        questionObj.correct = opts[correctIdx];
    } else {
        questionObj.correct = document.querySelector('input[name="correct-tf"]:checked').value;
    }

    questions.push(questionObj);
    renderAdminQuestions();
    alert("Question Added!");
}

function renderAdminQuestions() {
    const list = document.getElementById('admin-questions-list');
    list.innerHTML = questions.map((q, i) => `
        <div class="quiz-card">
            <button onclick="deleteQuestion(${i})" style="float:right; background:none; border:none; color:red;">❌</button>
            <strong>Q${i+1}: ${q.text}</strong><br>
            <small>Correct: ${q.correct}</small>
        </div>
    `).join('');
}

function deleteQuestion(i) {
    questions.splice(i, 1);
    renderAdminQuestions();
}

// Student Logic
function startQuiz() {
    currentStudent = document.getElementById('studentName').value;
    if(!currentStudent) return alert("Enter your name");
    
    document.getElementById('student-auth').classList.add('hidden');
    document.getElementById('quiz-area').classList.remove('hidden');
    document.getElementById('display-student-name').innerText = "Student: " + currentStudent;
    
    renderQuiz();
}

function renderQuiz() {
    const container = document.getElementById('questions-container');
    if(questions.length === 0) {
        container.innerHTML = "No questions available yet.";
        return;
    }
    
    container.innerHTML = questions.map((q, i) => `
        <div class="quiz-card">
            <p>${i+1}. ${q.text}</p>
            ${q.type === 'mcq' ? 
                q.options.map(opt => `<label><input type="radio" name="q${i}" value="${opt}"> ${opt}</label><br>`).join('') :
                `<label><input type="radio" name="q${i}" value="True"> True</label><br>
                 <label><input type="radio" name="q${i}" value="False"> False</label>`
            }
        </div>
    `).join('');
}

function submitQuiz() {
    let score = 0;
    questions.forEach((q, i) => {
        const selected = document.querySelector(`input[name="q${i}"]:checked`);
        if(selected && selected.value === q.correct) score++;
    });

    const percent = Math.round((score / questions.length) * 100) || 0;
    records.push({ name: currentStudent, score: percent + "%", date: new Date().toLocaleTimeString() });
    
    alert(`Quiz Submitted! Your score: ${percent}%`);
    location.reload(); // Resets for next user
}

function renderRecords() {
    const list = document.getElementById('records-list');
    list.innerHTML = records.map(r => `
        <div class="quiz-card">
            <strong>${r.name}</strong> - ${r.score} <br>
            <small>${r.date}</small>
        </div>
    `).join('');
}
