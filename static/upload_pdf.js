




// document.getElementById("uploadForm").addEventListener("submit", async function (e) {
//     e.preventDefault();

//     const fileInput = document.getElementById("pdfFile");
//     const file = fileInput.files[0];
//     const formData = new FormData();
//     formData.append("pdf", file);

//     const resultContainer = document.getElementById("extractedQA");
//     resultContainer.innerHTML = "<p>⏳ Extracting text from PDF...</p>";

//     try {
//         const res = await fetch("/extract_pdf", {
//             method: "POST",
//             body: formData,
//         });

//         const data = await res.json();

//         if (data.error) {
//             resultContainer.innerHTML = `<p style="color:red;">❌ ${data.error}</p>`;
//             return;
//         }

        

//         let rawText = data.text;
       
// const text = rawText; 

        


// const qaPairs = extractQAPairs(text);


//         if (!qaPairs.length) {
//             resultContainer.innerHTML = `<p style="color:red;">❌ No valid Q&A pairs found in PDF.</p>`;
//             return;
//         }

//         displayQAPairs(qaPairs, resultContainer);
//     } catch (err) {
//         resultContainer.innerHTML = `<p style="color:red;">❌ Error: ${err.message}</p>`;
//     }
// });













// function extractQAPairs(text) {
//     const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
//     const pairs = [];

//     let currentQuestion = '';
//     let currentAnswer = '';
//     let collecting = null;

//     for (let line of lines) {
        
//         line = line.replace(/-\s*\n\s*/g, '');  
//         line = line.replace(/\s{2,}/g, ' ');     

//         const isQuestion = /^(Q[\s.:\-]*\d*|^\d+\.)\s*/i.test(line);
//         const isAnswer = /^(Ans|Answer|Solution)[\s.:\-]*/i.test(line);

//         if (isQuestion) {
//             if (currentQuestion && currentAnswer) {
//                 pairs.push({
//                     question: currentQuestion.trim(),
//                     student_answer: currentAnswer.trim()
//                 });
//             }

//             currentQuestion = line.replace(/^(Q[\s.:\-]*\d*|^\d+\.)\s*/i, '');
//             currentAnswer = '';
//             collecting = 'question';
//         } else if (isAnswer) {
//             currentAnswer = line.replace(/^(Ans|Answer|Solution)[\s.:\-]*/i, '');
//             collecting = 'answer';
//         } else {
//             if (collecting === 'question') {
//                 currentQuestion += ' ' + line;
//             } else if (collecting === 'answer') {
//                 currentAnswer += ' ' + line;
//             }
//         }
//     }

    
//     if (currentQuestion && currentAnswer) {
//         pairs.push({
//             question: currentQuestion.trim(),
//             student_answer: currentAnswer.trim()
//         });
//     }

//     return pairs;
// }





// function displayQAPairs(pairs, container) {
//     let currentIndex = 0;
//     const total = pairs.length;

//     const questionField = document.createElement("textarea");
//     questionField.readOnly = true;
//     questionField.style.width = "100%";
//     questionField.style.height = "80px";

//     const studentField = document.createElement("textarea");
//     studentField.readOnly = true;
//     studentField.style.width = "100%";
//     studentField.style.height = "80px";

//     let modelField = document.createElement("textarea");
//     modelField.placeholder = "✍️ Write your model answer here...";
//     modelField.style.width = "100%";
//     modelField.style.height = "80px";

//     const evaluateBtn = document.createElement("button");
//     evaluateBtn.textContent = "🔍 Evaluate Answer";

//     const resultDiv = document.createElement("div");
//     resultDiv.classList.add("result-section");

//     const nav = document.createElement("div");
//     nav.style.marginTop = "10px";
//     const prevBtn = document.createElement("button");
//     prevBtn.textContent = "⬅️ Previous";
//     const nextBtn = document.createElement("button");
//     nextBtn.textContent = "➡️ Next";

//     prevBtn.disabled = true;
//     nextBtn.disabled = total <= 1;

//     prevBtn.onclick = () => {
//         if (currentIndex > 0) {
//             currentIndex--;
//             updateFields();
//         }
//     };

//     nextBtn.onclick = () => {
//         if (currentIndex < total - 1) {
//             currentIndex++;
//             updateFields();
//         }
//     };

//     evaluateBtn.onclick = async () => {
//         const question = questionField.value;
//         const student_answer = studentField.value;
//         const model_answer = modelField.value;

//         if (!model_answer.trim()) {
//             alert("Please provide a model answer before evaluating.");
//             return;
//         }

//         const res = await fetch("/evaluate", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ question, model_answer, student_answer }),
//         });

//         const result = await res.json();

//         if (result.error) {
//             resultDiv.innerHTML = `<p style="color:red;">❌ ${result.error}</p>`;
//             return;
//         }

//         resultDiv.innerHTML = `
//             <p><strong>Grammar Mistakes:</strong> ${result.grammar_mistakes}</p>
//             <p><strong>Grammar Feedback:</strong> ${result.grammar_feedback}</p>
//             <p><strong>Keywords Used:</strong> ${result.keywords_used.join(', ')}</p>
//             <p><strong>Similarity Score:</strong> ${result.similarity_score.toFixed(2)}</p>
//             <p><strong>Final Score:</strong> ${result.final_score}</p>
//             <p><strong>Remark:</strong> ${result.remark}</p>
//         `;
//     };

//     function updateFields() {
//         const pair = pairs[currentIndex];
//         questionField.value = pair.question;
//         studentField.value = pair.student_answer;
//         modelField.value = '';
//         resultDiv.innerHTML = '';
//         prevBtn.disabled = currentIndex === 0;
//         nextBtn.disabled = currentIndex === total - 1;
//     }

//     updateFields();

//     container.innerHTML = '';
//     container.appendChild(document.createElement("hr"));
//     container.appendChild(document.createTextNode("📚 Question:"));
//     container.appendChild(questionField);
//     container.appendChild(document.createTextNode("👩‍🎓 Student Answer:"));
//     container.appendChild(studentField);
//     container.appendChild(document.createTextNode("✅ Your Model Answer:"));
//     container.appendChild(modelField);
//     container.appendChild(evaluateBtn);
//     container.appendChild(resultDiv);
//     nav.appendChild(prevBtn);
//     nav.appendChild(nextBtn);
//     container.appendChild(nav);
// }




document.getElementById("uploadForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const fileInput = document.getElementById("pdfFile");
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("pdf", file);

    const resultContainer = document.getElementById("extractedQA");
    resultContainer.innerHTML = `
  <div class="loading-animation">
    <lottie-player 
      src="https://assets10.lottiefiles.com/packages/lf20_usmfx6bp.json" 
      background="transparent" 
      speed="1" 
      style="width: 60px; height: 60px;" 
      loop 
      autoplay>
    </lottie-player>
    <p>Extracting text from PDF...</p>
  </div>
`;

    try {
        const res = await fetch("/extract_pdf", {
            method: "POST",
            body: formData,
        });

       
        

    const resText = await res.text();

// ✅ Handle server errors that return HTML
if (resText.trim().startsWith('<')) {
    resultContainer.innerHTML = `
        <p style="color:red;">❌ Server returned HTML instead of JSON. This likely means a Flask error occurred.</p>
        <pre style="white-space:pre-wrap; max-height:300px; overflow:auto;">${resText}</pre>
    `;
    return;
}

const data = JSON.parse(resText); // ✅ now safe to parse


        if (data.error) {
            resultContainer.innerHTML = `<p style="color:red;">❌ ${data.error}</p>`;
            return;
        }

        const text = data.text;
        console.log("🧾 Extracted Text:\n", text); // Debugging

        const qaPairs = extractQAPairs(text);

        if (!qaPairs.length) {
            resultContainer.innerHTML = `<p style="color:red;">❌ No valid Q&A pairs found in PDF.</p>`;
            return;
        }

        displayQAPairs(qaPairs, resultContainer);
    } catch (err) {
        resultContainer.innerHTML = `<p style="color:red;">❌ Error: ${err.message}</p>`;
    }
});




function extractQAPairs(text) {
    const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
    const pairs = [];

    let currentQuestion = '';
    let currentAnswer = '';
    let state = 'searching'; // 'question' or 'answer'

    const isQuestionStart = line => /^((Q[\s.:]*)?\d{1,2}[\)\.:]?)\s*/i.test(line);
    const isAnswerStart = line => /^(Ans|Answer|Solution)[\s.:\-]*/i.test(line);

    for (let line of lines) {
        // Handle unexpected artifacts
        line = line.replace(/-\s*\n\s*/g, '');
        line = line.replace(/\s{2,}/g, ' ');

        if (isQuestionStart(line)) {
            if (currentQuestion && currentAnswer) {
                pairs.push({ question: currentQuestion.trim(), student_answer: currentAnswer.trim() });
                currentQuestion = '';
                currentAnswer = '';
            }
            currentQuestion = line.replace(/^((Q[\s.:]*)?\d{1,2}[\)\.:]?)\s*/i, '');
            state = 'question';
        } else if (isAnswerStart(line)) {
            currentAnswer = line.replace(/^(Ans|Answer|Solution)[\s.:\-]*/i, '');
            state = 'answer';
        } else {
            if (state === 'question') {
                currentQuestion += ' ' + line;
            } else if (state === 'answer') {
                currentAnswer += ' ' + line;
            }
        }
    }

    // Add final Q&A pair if valid
    if (currentQuestion && currentAnswer) {
        pairs.push({ question: currentQuestion.trim(), student_answer: currentAnswer.trim() });
    }

    return pairs;
}


// function displayQAPairs(pairs, container) {
//     let currentIndex = 0;
//     const total = pairs.length;

//     const questionField = document.createElement("textarea");
//     questionField.readOnly = true;
//     questionField.style.width = "100%";
//     questionField.style.height = "80px";

//     const studentField = document.createElement("textarea");
//     studentField.readOnly = true;
//     studentField.style.width = "100%";
//     studentField.style.height = "80px";

//     const modelField = document.createElement("textarea");
//     modelField.placeholder = "✍️ Write your model answer here...";
//     modelField.style.width = "100%";
//     modelField.style.height = "80px";

//     const evaluateBtn = document.createElement("button");
//     evaluateBtn.textContent = "🔍 Evaluate Answer";
//     evaluateBtn.style.backgroundColor = "linear-gradient(90deg, #4A6CF7 0%, #9F8FEF 100%);"

//     const resultDiv = document.createElement("div");
//     resultDiv.classList.add("result-section");

//     const nav = document.createElement("div");
//     nav.style.marginTop = "10px";
//     const prevBtn = document.createElement("button");
//     prevBtn.textContent = "⬅️ Previous";
//     const nextBtn = document.createElement("button");
//     nextBtn.textContent = "➡️ Next";

//     prevBtn.disabled = true;
//     nextBtn.disabled = total <= 1;

//     prevBtn.onclick = () => {
//         if (currentIndex > 0) {
//             currentIndex--;
//             updateFields();
//         }
//     };

//     nextBtn.onclick = () => {
//         if (currentIndex < total - 1) {
//             currentIndex++;
//             updateFields();
//         }
//     };

//     evaluateBtn.onclick = async () => {
//         const question = questionField.value;
//         const student_answer = studentField.value;
//         const model_answer = modelField.value;

//         if (!model_answer.trim()) {
//             alert("Please provide a model answer before evaluating.");
//             return;
//         }

//         const res = await fetch("/evaluate", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ question, model_answer, student_answer }),
//         });

//         const result = await res.json();

//         if (result.error) {
//             resultDiv.innerHTML = `<p style="color:red;">❌ ${result.error}</p>`;
//             return;
//         }

//         resultDiv.innerHTML = `
//             <p><strong>Grammar Mistakes:</strong> ${result.grammar_mistakes}</p>
//             <p><strong>Grammar Feedback:</strong> ${result.grammar_feedback}</p>
//             <p><strong>Keywords Used:</strong> ${result.keywords_used.join(', ')}</p>
//             <p><strong>Similarity Score:</strong> ${result.similarity_score.toFixed(2)}</p>
//             <p><strong>Final Score:</strong> ${result.final_score}</p>
//             <p><strong>Remark:</strong> ${result.remark}</p>
//         `;
//     };

//     function updateFields() {
//         const pair = pairs[currentIndex];
//         questionField.value = pair.question;
//         studentField.value = pair.student_answer;
//         modelField.value = '';
//         resultDiv.innerHTML = '';
//         prevBtn.disabled = currentIndex === 0;
//         nextBtn.disabled = currentIndex === total - 1;
//     }

//     updateFields();

//     container.innerHTML = '';
//     container.appendChild(document.createElement("hr"));
//     container.appendChild(document.createTextNode("📚 Question:"));
//     container.appendChild(questionField);
//     container.appendChild(document.createTextNode("👩‍🎓 Student Answer:"));
//     container.appendChild(studentField);
//     container.appendChild(document.createTextNode("✅ Your Model Answer:"));
//     container.appendChild(modelField);
//     container.appendChild(evaluateBtn);
//     container.appendChild(resultDiv);
//     nav.appendChild(prevBtn);
//     nav.appendChild(nextBtn);
//     container.appendChild(nav);
// }



function displayQAPairs(pairs, container) {
    let currentIndex = 0;
    const total = pairs.length;

    // Create Q&A card container
    const qaCard = document.createElement("div");
    qaCard.className = "qa-card";

    // Labels and fields
    const qLabel = document.createElement("div");
    qLabel.className = "qa-label";
    qLabel.textContent = "📚 Question:";
    const questionField = document.createElement("textarea");
    questionField.readOnly = true;
    questionField.className = "qa-field";
    questionField.setAttribute("aria-label", "Question");

    const sLabel = document.createElement("div");
    sLabel.className = "qa-label";
    sLabel.textContent = "👩‍🎓 Student Answer:";
    const studentField = document.createElement("textarea");
    studentField.readOnly = true;
    studentField.className = "qa-field";
    studentField.setAttribute("aria-label", "Student Answer");

    const mLabel = document.createElement("div");
    mLabel.className = "qa-label";
    mLabel.textContent = "✅ Your Model Answer:";
    const modelField = document.createElement("textarea");
    modelField.placeholder = "✍️ Write your model answer here...";
    modelField.className = "qa-field";
    modelField.setAttribute("aria-label", "Model Answer");

    // Evaluate button
    const evaluateBtn = document.createElement("button");
    evaluateBtn.textContent = "🔍 Evaluate Answer";
    evaluateBtn.className = "evaluate-btn";

    // Result display
    const resultDiv = document.createElement("div");
    resultDiv.classList.add("result-section");

    // Navigation
    const nav = document.createElement("div");
    nav.style.marginTop = "10px";
    nav.style.textAlign = "center";
    const prevBtn = document.createElement("button");
    prevBtn.textContent = "⬅️ Previous";
    prevBtn.className = "nav-btn";
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "➡️ Next";
    nextBtn.className = "nav-btn";

    prevBtn.disabled = true;
    nextBtn.disabled = total <= 1;

    // Animation helper
    function animateCardSwap(direction = 'left') {
        qaCard.style.transition = 'opacity 0.3s, transform 0.4s cubic-bezier(.68,-0.55,.27,1.55)';
        qaCard.style.opacity = 0;
        qaCard.style.transform = `translateX(${direction === 'left' ? '-40px' : '40px'})`;
        setTimeout(() => {
            qaCard.style.transition = 'none';
            qaCard.style.transform = `translateX(${direction === 'left' ? '40px' : '-40px'})`;
            setTimeout(() => {
                qaCard.style.transition = 'opacity 0.3s, transform 0.4s cubic-bezier(.68,-0.55,.27,1.55)';
                qaCard.style.transform = 'translateX(0)';
                qaCard.style.opacity = 1;
            }, 10);
        }, 300);
    }

    prevBtn.onclick = () => {
        if (currentIndex > 0) {
            currentIndex--;
            animateCardSwap('right');
            setTimeout(updateFields, 300);
        }
    };

    nextBtn.onclick = () => {
        if (currentIndex < total - 1) {
            currentIndex++;
            animateCardSwap('left');
            setTimeout(updateFields, 300);
        }
    };

    evaluateBtn.onclick = async () => {
        const question = questionField.value;
        const student_answer = studentField.value;
        const model_answer = modelField.value;

        if (!model_answer.trim()) {
            resultDiv.innerHTML = `<div class="error-banner">Please provide a model answer before evaluating.</div>`;
            return;
        }

        resultDiv.innerHTML = `
            <div class="loading-animation">
                <lottie-player 
                  src="https://assets10.lottiefiles.com/packages/lf20_usmfx6bp.json" 
                  background="transparent" 
                  speed="1" 
                  style="width: 60px; height: 60px;" 
                  loop 
                  autoplay>
                </lottie-player>
                <p>Evaluating answer...</p>
            </div>
        `;

        try {
            const res = await fetch("/evaluate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question, model_answer, student_answer }),
            });

            const result = await res.json();

            if (result.error) {
                resultDiv.innerHTML = `<div class="error-banner">❌ ${result.error}</div>`;
                return;
            }

            resultDiv.innerHTML = `
                <div class="result-content">
                    <h3>📚 Question</h3>
                    <div class="result-block">${escapeHTML(result.question)}</div>
                    <h3>👩‍🎓 Student Answer</h3>
                    <div class="result-block">${escapeHTML(result.student_answer)}</div>
                    <h3>✅ Keywords Used</h3>
                    <div class="result-block">${result.keywords_used && result.keywords_used.length ? result.keywords_used.map(escapeHTML).join(", ") : "None"}</div>
                    <h3>🧠 Similarity Score</h3>
                    <div class="result-block"><strong>${result.similarity_score}%</strong></div>
                    <h3>🔍 Grammar Mistakes</h3>
                    <div class="result-block">${result.grammar_mistakes}</div>
                    <h3>🛠 Grammar Feedback</h3>
                    <ul class="result-block">
                        ${result.grammar_feedback && result.grammar_feedback.length ? result.grammar_feedback.map(msg => `<li>${escapeHTML(msg)}</li>`).join("") : "<li>No feedback.</li>"}
                    </ul>
                    <h3>🎯 Final Score</h3>
                    <div class="result-block" style="color: green; font-size: 1.3em;"><strong>${result.final_score} / 100</strong></div>
                    <h3>💬 Remark</h3>
                    <div class="result-block"><em>${escapeHTML(result.remark || "")}</em></div>
                </div>
            `;
        } catch (err) {
            resultDiv.innerHTML = `<div class="error-banner">❌ Server error. Please try again later.</div>`;
        }
    };

    function updateFields() {
        const pair = pairs[currentIndex];
        questionField.value = pair.question;
        studentField.value = pair.student_answer;
        modelField.value = '';
        resultDiv.innerHTML = '';
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === total - 1;
    }

    // Initial display
    updateFields();

    // Build the card
    qaCard.innerHTML = '';
    qaCard.appendChild(qLabel);
    qaCard.appendChild(questionField);
    qaCard.appendChild(sLabel);
    qaCard.appendChild(studentField);
    qaCard.appendChild(mLabel);
    qaCard.appendChild(modelField);
    qaCard.appendChild(evaluateBtn);
    qaCard.appendChild(resultDiv);

    container.innerHTML = '';
    container.appendChild(qaCard);
    nav.appendChild(prevBtn);
    nav.appendChild(nextBtn);
    container.appendChild(nav);
}

// Utility to escape HTML (prevents XSS if backend is not sanitizing)
function escapeHTML(str) {
    if (!str) return "";
    return str.replace(/[&<>"']/g, function(m) {
        return ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        })[m];
    });
}
