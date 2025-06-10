document.addEventListener("DOMContentLoaded", () => {
    const form     = document.querySelector('.typing-form');
    const input    = document.getElementById('text-input');
    const chatArea = document.getElementById('chat-area');

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;

      appendMessage(text, 'user');
      input.value = '';
      const aiBubble = appendMessage('...', 'ai', true);

      try {
        const reply = await fetchApiResponse(text);
        // sanitize & convert markdown → HTML
        aiBubble.innerHTML = DOMPurify.sanitize(marked.parse(reply));
        aiBubble.closest('.message').classList.remove('loading');
      } catch {
        aiBubble.innerText = 'Oops! Something went wrong.';
        aiBubble.closest('.message').classList.remove('loading');
      }
    });

    function appendMessage(content, sender, isLoading = false) {
      const msg = document.createElement('div');
      msg.className = `message ${sender}` + (isLoading ? ' loading' : '');
      const bubble = document.createElement('div');
      bubble.className = 'bubble';

      bubble.innerText = content;
      msg.appendChild(bubble);
      chatArea.appendChild(msg);
      chatArea.scrollTop = chatArea.scrollHeight;
      return bubble;
    }

    async function fetchApiResponse(chat) {
      const res = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=[ YOUR_API_KEY ]',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: chat
              }]
            }]
          })
        }
      );
      const json = await res.json();
      if (json?.candidates?.[0]?.content?.parts?.[0]?.text)
        return json.candidates[0].content.parts[0].text;
      throw new Error('Invalid response');
    }
  });
