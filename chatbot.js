(function () {
  const backendUrl = "https://maharani-chatbot-1028160150875.us-west1.run.app/chat";
  const flagUrl = "https://maharani-chatbot-1028160150875.us-west1.run.app/flag";

  /* --------------------------- LOAD MARKED LIBRARY --------------------------- */
  if (typeof window.marked === "undefined") {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/marked/marked.min.js";
    document.head.appendChild(script);
  }

  /* --------------------------- STYLES --------------------------- */
  const style = document.createElement("style");
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Playfair+Display:wght@600&display=swap');

    .chat-toggle {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: #c23b7a;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 14px rgba(0,0,0,0.15);
      cursor: pointer;
      transition: all 0.3s ease;
      z-index: 10000;
    }
    .chat-toggle:hover { background: #d44c8a; transform: scale(1.05); }
    .chat-toggle img { width: 100%; border-radius: 50%; }
    .chat-toggle .close-icon {
      position: absolute;
      color: white;
      font-size: 28px;
      opacity: 0;
      transition: opacity 0.3s;
    }
    .chat-toggle.open img { opacity: 0; }
    .chat-toggle.open .close-icon { opacity: 1; }

    .chat-widget {
      position: fixed;
      bottom: 100px;
      right: 25px;
      width: 360px;
      max-width: 90vw;
      height: 520px;
      border-radius: 20px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.1);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      font-family: 'Inter', sans-serif;
      background: #fff;
      border: 1px solid #eee;
      transform: translateY(25px);
      opacity: 0;
      pointer-events: none;
      transition: all 0.3s ease;
      z-index: 9999;
    }
    .chat-widget.active { opacity: 1; pointer-events: auto; transform: translateY(0); }

    .chat-header {
      background: #ffffff;
      border-bottom: 1px solid #f0f0f0;
      display: flex;
      align-items: center;
      padding: 10px 14px;
      font-family: 'Playfair Display', serif;
      font-weight: 600;
      color: #222;
    }
    .chat-header img { width: 34px; height: 34px; border-radius: 50%; margin-right: 10px; }
    .chat-header .chat-title { flex: 1; }
    .chat-header .chat-version {
      font-size: 10px;
      color: #bbb;
      margin-left: 6px;
      user-select: none;
    }

    .chat-box {
      flex: 1;
      padding: 14px;
      overflow-y: auto;
      background: #fafafa;
      scroll-behavior: smooth;
    }

    .chat-message {
      margin-bottom: 12px;
      padding: 10px 14px;
      border-radius: 12px;
      font-size: 14px;
      line-height: 1.5;
      max-width: 85%;
      word-wrap: break-word;
      animation: fadeIn 0.3s ease;
      position: relative;
    }
    @keyframes fadeIn { from {opacity:0; transform:translateY(8px);} to {opacity:1; transform:translateY(0);} }

    .chat-message.user {
      background: #eac6d3;
      color: #222;
      align-self: flex-end;
      border-top-right-radius: 4px;
    }

    .chat-message.bot {
      background: #f0f0f3;
      color: #111;
      align-self: flex-start;
      border-top-left-radius: 4px;
    }

    .chat-message.bot p { margin: 6px 0; }
    .chat-message.bot a { color: #c23b7a; text-decoration: underline; }

    .flag-btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: none;
      border: none;
      color: #999;
      font-size: 12px;
      cursor: pointer;
      margin-top: 8px;
      transition: color 0.2s ease;
    }
    .flag-btn:hover { color: #c23b7a; }
    .flag-btn svg { width: 14px; height: 14px; }

    .typing { display: flex; gap: 4px; align-items: center; }
    .dot { width: 6px; height: 6px; background: #c23b7a; border-radius: 50%; animation: blink 1.4s infinite; }
    .dot:nth-child(2){ animation-delay:0.2s; }
    .dot:nth-child(3){ animation-delay:0.4s; }
    @keyframes blink { 0%,80%,100%{opacity:0;} 40%{opacity:1;} }

    .chat-input-area {
      border-top: 1px solid #f0f0f0;
      display: flex;
      align-items: center;
      background: #fff;
      padding: 10px;
    }
    .chat-input-area input {
      flex: 1;
      border: none;
      font-size: 14px;
      background: #f8f8f8;
      border-radius: 18px;
      padding: 10px 14px;
      outline: none;
    }
    .send-btn {
      background: #c23b7a;
      border: none;
      color: white;
      border-radius: 50%;
      width: 38px;
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .send-btn:hover { background: #d44c8a; }
    .send-btn svg { width: 16px; height: 16px; fill: white; transform: translateX(1px); }

    @media (max-width: 480px) {
      .chat-widget { right: 10px; bottom: 90px; width: calc(100% - 20px); height: 70vh; }
    }
  `;
  document.head.appendChild(style);

  /* --------------------------- STRUCTURE --------------------------- */
  const widgetHTML = `
    <div id="chat-toggle" class="chat-toggle">
      <img src="./bridal.png" alt="Chat" />
      <div class="close-icon">&times;</div>
    </div>

    <div id="chat-widget" class="chat-widget">
      <div class="chat-header">
        <img src="./bridal.png" alt="icon">
        <div class="chat-title">Maharani AI <span class="chat-version">v2.0</span></div>
      </div>

      <div id="chat-box" class="chat-box"></div>

      <div class="chat-input-area">
        <input type="text" id="user-input" placeholder="Ask Away!" />
        <button id="send-btn" class="send-btn">
          <svg viewBox="0 0 24 24"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>
        </button>
      </div>
    </div>
  `;
  const container = document.createElement("div");
  container.innerHTML = widgetHTML;
  document.body.appendChild(container);

  /* --------------------------- VARIABLES --------------------------- */
  const chatWidget = document.getElementById("chat-widget");
  const chatToggle = document.getElementById("chat-toggle");
  const chatBox = document.getElementById("chat-box");
  const sendBtn = document.getElementById("send-btn");
  const userInput = document.getElementById("user-input");

  let threadId = localStorage.getItem("maharani_thread_id");
  if (!threadId) {
    threadId = "thread_" + crypto.randomUUID();
    localStorage.setItem("maharani_thread_id", threadId);
  }

  /* --------------------------- TOGGLE --------------------------- */
  chatToggle.addEventListener("click", () => {
    chatWidget.classList.toggle("active");
    chatToggle.classList.toggle("open");
    if (chatWidget.classList.contains("active") && !chatBox.hasChildNodes()) {
      addMessage("Hi lovely 💐 — I’m the MaharaniWeddings Assistant! How can I help plan your dream celebration today?", "bot", true);
    }
  });

  /* --------------------------- MESSAGE RENDER --------------------------- */
  function addMessage(content, sender, isWelcome = false) {
    const msg = document.createElement("div");
    msg.classList.add("chat-message", sender);

    // Render content with Markdown if available
    msg.innerHTML = sender === "bot" && window.marked ? marked.parse(content) : content;

    // Add flag icon only to bot messages (not welcome message)
    if (sender === "bot" && !isWelcome) {
      const flagBtn = document.createElement("button");
      flagBtn.classList.add("flag-btn");
      flagBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5h16l-4 6 4 6H4V5z" />
        </svg>
        Flag
      `;
      flagBtn.onclick = async () => {
        const confirmFlag = confirm("Are you sure you want to flag this message?");
        if (!confirmFlag) return;
        try {
          await fetch(flagUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: content, thread_id: threadId }),
          });
          flagBtn.textContent = "Flagged ✅";
          flagBtn.style.color = "#c23b7a";
        } catch {
          flagBtn.textContent = "Error ❌";
        }
      };
      msg.appendChild(document.createElement("br"));
      msg.appendChild(flagBtn);
    }

    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function showTyping() {
    const typing = document.createElement("div");
    typing.className = "chat-message bot typing";
    typing.innerHTML = `<div class="dot"></div><div class="dot"></div><div class="dot"></div>`;
    chatBox.appendChild(typing);
    chatBox.scrollTop = chatBox.scrollHeight;
    return typing;
  }

  /* --------------------------- SEND --------------------------- */
  async function sendMessage() {
    const query = userInput.value.trim();
    if (!query) return;
    addMessage(query, "user");
    userInput.value = "";
    const typingMsg = showTyping();
    try {
      const res = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, thread_id: threadId }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      typingMsg.remove();
      addMessage(data.response, "bot");
    } catch {
      typingMsg.remove();
      addMessage("⚠️ Connection issue. Please try again soon.", "bot");
    }
  }

  sendBtn.addEventListener("click", sendMessage);
  userInput.addEventListener("keypress", e => e.key === "Enter" && sendMessage());
})();



