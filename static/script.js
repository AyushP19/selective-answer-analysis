



// document.getElementById('answerForm').onsubmit = async function(event) {
//     event.preventDefault();

//     const question = document.getElementById('question').value.trim();
//     const modelAnswer = document.getElementById('model_answer').value.trim();
//     const studentAnswer = document.getElementById('student_answer').value.trim();
//     const fileInput = document.getElementById('file');

//     const formData = new FormData();
//     if (fileInput.files.length > 0) {
//         formData.append("file", fileInput.files[0]);
//     }
//     formData.append("question", question);
//     formData.append("model_answer", modelAnswer);
//     formData.append("student_answer", studentAnswer);

//     try {
//         const response = await fetch('/upload_pdf', {
//             method: 'POST',
//             body: formData
//         });

//         const result = await response.json();

//         if (result.error) {
//             document.getElementById('result').innerHTML = `<span style="color: red;">❌ ${result.error}</span>`;
//             return;
//         }

//         // Populate extracted text (if available)
//         if (result.extracted_text) {
//             const preview = document.getElementById("extractedText");
//             if (preview) {
//                 preview.value = result.extracted_text;
//             }
//         }

//         // Display results
//         document.getElementById('result').innerHTML = `
//             <div class="result-content">
//                 <h3>📚 Student Answer</h3>
//                 <p>${escapeHTML(result.student_answer)}</p>

//                 <h3>✅ Keywords Used</h3>
//                 <p>${result.keywords_used.join(", ")}</p>

//                 <h3>🧠 Similarity Score</h3>
//                 <p><strong>${result.similarity_score}%</strong></p>

//                 <h3>🔍 Grammar Mistakes</h3>
//                 <p>${result.grammar_mistakes}</p>

//                 <h3>🛠 Grammar Feedback</h3>
//                 <ul>
//                     ${result.grammar_feedback.map(msg => `<li>${escapeHTML(msg)}</li>`).join("")}
//                 </ul>

//                 <h3>🎯 Final Score</h3>
//                 <p style="color: green; font-size: 20px;"><strong>${result.final_score} / 100</strong></p>
//             </div>
//         `;
//     } catch (err) {
//         document.getElementById('result').innerHTML = `<span style="color: red;">⚠️ Error occurred: ${err.message}</span>`;
//     }
// };

// // Helper function to prevent XSS from user inputs
// function escapeHTML(text) {
//     const div = document.createElement("div");
//     div.textContent = text;
//     return div.innerHTML;
// }


document.getElementById('answerForm').onsubmit = async function(event) {
    event.preventDefault();

    const response = await fetch('/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            question: document.getElementById('question').value,
            model_answer: document.getElementById('model_answer').value,
            student_answer: document.getElementById('student_answer').value
        })
    });

    const result = await response.json();

    if (result.error) {
        document.getElementById('result').innerHTML = `<span style="color: red;">❌ ${result.error}</span>`;
        return;
    }

    document.getElementById('result').innerHTML = `
        <div class="result-content">
            <h3>📚 Question</h3>
            <p>${result.question}</p>

            <h3>👩‍🎓 Student Answer</h3>
            <p>${result.student_answer}</p>

            <h3>✅ Keywords Used</h3>
            <p>${result.keywords_used.join(", ")}</p>

            <h3>🧠 Similarity Score</h3>
            <p><strong>${result.similarity_score}%</strong></p>

            <h3>🔍 Grammar Mistakes</h3>
            <p>${result.grammar_mistakes}</p>

            <h3>🛠 Grammar Feedback</h3>
            <ul>
                ${result.grammar_feedback.map(msg => `<li>${msg}</li>`).join("")}
            </ul>

            <h3>🎯 Final Score</h3>
            <p style="color: green; font-size: 20px;"><strong>${result.final_score} / 100</strong></p>
        </div>
    `;
};
