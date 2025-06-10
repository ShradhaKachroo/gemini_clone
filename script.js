document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector('.typing-form');
    const input = document.getElementById('text-input');
    const chatArea = document.getElementById('chat-area');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const userMessage = input.value.trim();
        if (!userMessage) return;

        appendMessage(userMessage, 'input-chat');
        input.value = '';

        const loadingBubble = appendMessage("...", 'output-chat', true);

        try {
            const aiReply = await fetchApiResponse(userMessage);
            loadingBubble.innerText = aiReply;
            loadingBubble.style.opacity = 1;
        } catch (error) {
            loadingBubble.innerText = "Sorry, there was an error.";
            loadingBubble.style.opacity = 1;
        }
    });

    function appendMessage(text, className, isLoading = false) {
        const div = document.createElement('div');
        div.className = className;
        div.innerText = text;
        if (isLoading) div.style.opacity = 0.6;
        chatArea.appendChild(div);
        chatArea.scrollTop = chatArea.scrollHeight;
        return div;
    }

    async function fetchApiResponse(chat) {
        const resp = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=[YOUR_API_KEY]', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            { text: chat }
                        ]
                    }
                ]
            })
        });

        const response = await resp.json();
        if (
            response &&
            response.candidates &&
            response.candidates[0] &&
            response.candidates[0].content &&
            response.candidates[0].content.parts &&
            response.candidates[0].content.parts[0] &&
            response.candidates[0].content.parts[0].text
        ) {
            return response.candidates[0].content.parts[0].text;
        } else {
            throw new Error("Invalid response from Gemini API");
        }
    }
});
