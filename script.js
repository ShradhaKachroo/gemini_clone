const chatArea = document.getElementById("chatArea");

function fetchResults(event) {
    event.preventDefault(); // Prevent form submission
    let chat = document.getElementById("text-input").value.trim();
    if (!chat) return; // Do nothing if input is empty

    AppendMessage("input-chat", chat); // Show user's message
    document.getElementById("text-input").value = "";
    functionfetchApiResponse(chat);
}

async function functionfetchApiResponse(chat) {
    try {
        const resp = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyC6yDHbWaHGD8IJS1Zt5MGsRcQMqnBK-Vo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: chat
                            }
                        ]
                    }
                ]
            })
        });

        const response = await resp.json();
        // Defensive: check if response has expected structure
        const reply = response?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, no response.";
        AppendMessage("output-chat", reply);
    } catch (error) {
        console.error("Error fetching from Gemini API:", error);
        AppendMessage("output-chat", "Error: Could not fetch response.");
    }
}

function AppendMessage(className, chat) {
    const msgElement = document.createElement('div');
    msgElement.className = className;
    msgElement.innerHTML = `<p>${chat}</p>`;
    chatArea.appendChild(msgElement);
    chatArea.scrollTop = chatArea.scrollHeight; // Scroll to bottom
}

// Attach event listener to the form
document.addEventListener("DOMContentLoaded", function() {
    document.querySelector(".typing-form").addEventListener("submit", fetchResults);
});
