// ===== ELEMENTS =====

const promptInput = document.getElementById("promptInput");
const charCount = document.getElementById("charCount");
const clearInput = document.getElementById("clearInput");
const improveBtn = document.getElementById("improveBtn");

const resultSection = document.getElementById("resultSection");
const originalResult = document.getElementById("originalResult");
const improvedResult = document.getElementById("improvedResult");
const copyBtn = document.getElementById("copyBtn");

const historyList = document.getElementById("historyList");
const clearHistory = document.getElementById("clearHistory");

const historySection = document.getElementById("historySection");
const historyBtn = document.getElementById("historyBtn");
const homeBtn = document.getElementById("homeBtn");

const categoryButtons = document.querySelectorAll(".category-btn");

let selectedCategory = "Coding";


// ===== CATEGORY SELECTION =====

categoryButtons.forEach(button => {

    button.addEventListener("click", () => {

        categoryButtons.forEach(btn => {
            btn.classList.remove("selected");
        });

        button.classList.add("selected");

        selectedCategory = button.dataset.category;

    });

});


// ===== CHARACTER COUNTER =====

promptInput.addEventListener("input", () => {

    charCount.textContent =
        promptInput.value.length + " / 5000";

});


// ===== CLEAR INPUT =====

clearInput.addEventListener("click", () => {

    promptInput.value = "";
    charCount.textContent = "0 / 5000";

});


// ===== IMPROVE PROMPT =====

improveBtn.addEventListener("click", () => {

    const originalPrompt = promptInput.value.trim();

    if (originalPrompt === "") {

        alert("Please enter a prompt first!");

        return;
    }

    const improvedPrompt = createImprovedPrompt(
        originalPrompt,
        selectedCategory
    );

    originalResult.textContent = originalPrompt;
    improvedResult.textContent = improvedPrompt;

    resultSection.classList.add("show");

    saveHistory(originalPrompt, improvedPrompt);

    resultSection.scrollIntoView({
        behavior: "smooth"
    });

});


// ===== DEMO PROMPT IMPROVER =====

function createImprovedPrompt(prompt, category) {

    const instructions = {

        Coding:
        "Act as an experienced software developer. " +
        "Help me with the following task. " +
        "Explain the approach, provide clean and beginner-friendly code, " +
        "include important comments, and mention possible errors or improvements.",

        Education:
        "Act as a knowledgeable tutor. " +
        "Explain the following topic in a clear, structured and easy-to-understand way. " +
        "Include examples, key concepts and a short summary.",

        Writing:
        "Act as a professional writer. " +
        "Improve the following writing task. " +
        "Use clear language, appropriate tone, good structure and engaging content.",

        Business:
        "Act as a business strategist. " +
        "Analyze the following business task. " +
        "Provide a practical, structured response with ideas, strategy and actionable steps.",

        "Image Generation":
        "Create a detailed image-generation prompt based on the following idea. " +
        "Include the subject, composition, lighting, background, visual style, " +
        "details and atmosphere."
    };

    return instructions[category] +
        "\n\nTask or idea: " + prompt +
        "\n\nProvide a relevant, organized and detailed response.";
}


// ===== COPY PROMPT =====

copyBtn.addEventListener("click", async () => {

    const text = improvedResult.textContent;

    try {

        await navigator.clipboard.writeText(text);

        copyBtn.innerHTML = "✓ Copied!";

        setTimeout(() => {

            copyBtn.innerHTML = "▣ Copy";

        }, 1500);

    } catch (error) {

        alert("Copy failed. Please copy the text manually.");

    }

});


// ===== SAVE HISTORY =====

function saveHistory(original, improved) {

    let history = JSON.parse(
        localStorage.getItem("promptHistory") || "[]"
    );

    const item = {

        original: original,
        improved: improved,
        category: selectedCategory,
        date: new Date().toLocaleString()

    };

    history.unshift(item);

    history = history.slice(0, 20);

    localStorage.setItem(
        "promptHistory",
        JSON.stringify(history)
    );

    displayHistory();

}


// ===== DISPLAY HISTORY =====

function displayHistory() {

    const history = JSON.parse(
        localStorage.getItem("promptHistory") || "[]"
    );

    if (history.length === 0) {

        historyList.innerHTML = `
            <div class="empty-history">
                <span>◷</span>
                <p>No prompt history yet.</p>
            </div>
        `;

        return;
    }

    historyList.innerHTML = "";

    history.forEach((item, index) => {

        const card = document.createElement("div");

        card.className = "history-item";

        card.innerHTML = `
            <div class="history-item-header">
                <span class="history-category">
                    ${escapeHTML(item.category)}
                </span>

                <span class="history-date">
                    ${escapeHTML(item.date)}
                </span>
            </div>

            <p>${escapeHTML(item.original)}</p>
        `;

        card.addEventListener("click", () => {

            promptInput.value = item.original;

            charCount.textContent =
                promptInput.value.length + " / 5000";

            selectedCategory = item.category;

            categoryButtons.forEach(button => {

                button.classList.toggle(
                    "selected",
                    button.dataset.category === item.category
                );

            });

            originalResult.textContent = item.original;
            improvedResult.textContent = item.improved;

            resultSection.classList.add("show");

            resultSection.scrollIntoView({
                behavior: "smooth"
            });

        });

        historyList.appendChild(card);

    });

}


// ===== HTML SAFETY =====

function escapeHTML(text) {

    return String(text).replace(/[&<>"']/g, character => {

        const entities = {

            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"

        };

        return entities[character];

    });

}


// ===== CLEAR HISTORY =====

clearHistory.addEventListener("click", () => {

    const confirmClear = confirm(
        "Are you sure you want to clear your prompt history?"
    );

    if (confirmClear) {

        localStorage.removeItem("promptHistory");

        displayHistory();

    }

});


// ===== HOME BUTTON =====

homeBtn.addEventListener("click", () => {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});


// ===== HISTORY BUTTON =====

historyBtn.addEventListener("click", () => {

    historySection.scrollIntoView({
        behavior: "smooth"
    });

});


// ===== LOAD HISTORY ON START =====

displayHistory();