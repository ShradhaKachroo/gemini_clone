function fetchResults() {
    let chat = document.getElementById("text-input").value;
    document.getElementById("user-message").innerText = chat;
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
        const aiReply=response.candidates[0].content.parts[0].text;
        document.getElementById("ai-response").innerText = aiReply;
    } catch (error) {
        console.error("Error fetching from Gemini API:", error);
    }
}
