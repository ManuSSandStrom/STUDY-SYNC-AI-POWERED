// Select form and lists
const studyForm = document.getElementById("studyForm");
const studyPlanList = document.getElementById("studyPlanList");
const pendingList = document.getElementById("pendingList");
const completedList = document.getElementById("completedList");

// Load stored study plans on page load
document.addEventListener("DOMContentLoaded", function () {
    console.log("Loading Study Plans...");
    loadStudyPlans();
    updateStudyStatus(); // Ensure pending & completed topics are updated
});

// Handle form submission
studyForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Get input values
    let branch = document.getElementById("branch").value;
    let subject = document.getElementById("subject").value.trim();
    let examDate = document.getElementById("examDate").value;
    let examMarks = document.getElementById("examMarks").value;
    let examDuration = document.getElementById("examDuration").value;
    let priority = document.getElementById("priority").value;

    if (!subject || !examDate || !examMarks || !examDuration) {
        alert("Please fill in all fields.");
        return;
    }

    // Calculate study and revision time
    let studyTime = calculateStudyTime(priority);
    let revisionTime = Math.round(studyTime * 0.3); // 30% for revision

    // Create a new study plan object
    let studyPlan = {
        id: Date.now(),
        branch,
        subject,
        examDate,
        examMarks,
        examDuration,
        priority,
        studyTime,
        revisionTime,
        status: "pending"
    };

    // Save to Local Storage
    saveStudyPlan(studyPlan);

    // **Display immediately in UI**
    addStudyPlanToUI(studyPlan);

    // Reset form
    studyForm.reset();
    console.log("Study Plan Created:", studyPlan);

    // Update pending & completed topics
    updateStudyStatus();
});

// Function to calculate study time based on priority
function calculateStudyTime(priority) {
    return priority === "High" ? 4 : priority === "Medium" ? 3 : 2;
}

// Function to save study plan in Local Storage
function saveStudyPlan(plan) {
    let plans = JSON.parse(localStorage.getItem("studyPlans")) || [];
    plans.push(plan);
    localStorage.setItem("studyPlans", JSON.stringify(plans));
}

// Function to load study plans from Local Storage
function loadStudyPlans() {
    console.log("Loading Study Plans...");

    let plans = JSON.parse(localStorage.getItem("studyPlans")) || [];
    studyPlanList.innerHTML = ""; // Clear previous entries

    if (plans.length === 0) {
        studyPlanList.innerHTML = "<tr><td colspan='8'>No study plan added yet.</td></tr>";
        return;
    }

    plans.forEach(plan => addStudyPlanToUI(plan)); // Add each plan to the UI
}

// Function to add study plan to UI
function addStudyPlanToUI(plan) {
    let row = document.createElement("tr");

    row.innerHTML = `
        <td>${plan.subject}</td>
        <td>${plan.examDate}</td>
        <td>${plan.examMarks}</td>
        <td>${plan.examDuration} hrs</td>
        <td>${plan.priority}</td>
        <td>${plan.studyTime} hrs/day</td>
        <td>${plan.revisionTime} hrs/day</td>
        <td>
            <button onclick="markAsCompleted(${plan.id})" style="background: green; color: white;">✔ Complete</button>
            <button onclick="deletePlan(${plan.id})" style="background: red; color: white;">✖ Delete</button>
            <button onclick="getExamGuidance('${plan.subject}', ${plan.examMarks})" style="background: #ff9800; color: white;">📝 Guidance</button>
        </td>
    `;

    studyPlanList.appendChild(row);
}

// Function to mark study plan as completed
function markAsCompleted(id) {
    let plans = JSON.parse(localStorage.getItem("studyPlans")) || [];
    plans = plans.map(plan => {
        if (plan.id === id) {
            plan.status = "completed";
        }
        return plan;
    });

    localStorage.setItem("studyPlans", JSON.stringify(plans));
    reloadUI();
}

// Function to delete a study plan
function deletePlan(id) {
    let plans = JSON.parse(localStorage.getItem("studyPlans")) || [];
    plans = plans.filter(plan => plan.id !== id);
    localStorage.setItem("studyPlans", JSON.stringify(plans));
    reloadUI();
}

// Function to reload the UI
function reloadUI() {
    console.log("Reloading UI...");
    studyPlanList.innerHTML = "";
    loadStudyPlans();
    updateStudyStatus();
}

// Function to update Pending & Completed lists
function updateStudyStatus() {
    let plans = JSON.parse(localStorage.getItem("studyPlans")) || [];

    pendingList.innerHTML = "";
    completedList.innerHTML = "";

    let pendingCount = 0;
    let completedCount = 0;

    plans.forEach(plan => {
        let li = document.createElement("li");
        li.textContent = `${plan.subject} - ${plan.examDate}`;

        if (plan.status === "pending") {
            pendingList.appendChild(li);
            pendingCount++;
        } else {
            completedList.appendChild(li);
            completedCount++;
        }
    });

    // Update section titles with count
    document.getElementById("pendingTitle").innerText = `Pending Topics (${pendingCount})`;
    document.getElementById("completedTitle").innerText = `Completed Topics (${completedCount})`;
}

// Function to provide exam writing guidance
function getExamGuidance(subject, marks) {
    let guidance = `- Always start with a clear **definition**.\n- Provide a **structured explanation** with examples.\n- Highlight important **keywords** and use bullet points.\n- Practice **time management** and include diagrams if necessary.\n\n`;

    if (subject.includes("Java") || subject.includes("AI") || subject.includes("CNS")) {
        guidance += `For **${marks} marks**:\n- **10 Marks**: Definition → Explanation → Example.\n- **20 Marks**: Add real-life applications and a conclusion.`;
    } else if (subject.includes("Math") || subject.includes("DSA")) {
        guidance += `For **${marks} marks**:\n- **10 Marks**: Definition → Small Example → Algorithm.\n- **20 Marks**: Add time complexity analysis and a code snippet.`;
    } else if (subject.includes("Research") || subject.includes("Management")) {
        guidance += `For **${marks} marks**:\n- **10 Marks**: Definition → Brief Explanation → Key Points.\n- **20 Marks**: Add real-world case studies and a conclusion.`;
    }

    alert(guidance);
}
