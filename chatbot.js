(function () {
  const backendUrl = "https://maharaniweddings-maharani-chatbot.hf.space/chat";
  const flagUrl = "https://maharaniweddings-maharani-chatbot.hf.space/flag";

  /* ------------------------------ LOAD MARKED ------------------------------ */
  if (typeof window.marked === "undefined") {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/marked/marked.min.js";
    document.head.appendChild(script);
  }

  /* ------------------------------ STYLES ------------------------------ */
  const style = document.createElement("style");
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Poppins:wght@400;500&display=swap');

    .chat-toggle, .chat-widget { position: relative; }
    .chat-toggle {
      position: fixed;
      bottom: 25px;
      right: 25px;
      width: 68px;
      height: 68px;
      border-radius: 50%;
      background: linear-gradient(135deg, #d42f70, #f7b3cc);
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 0 0 25px rgba(212,47,112,0.45);
      cursor: pointer;
      z-index: 10000;
      overflow: hidden;
      transition: all 0.5s ease;
      backdrop-filter: blur(8px);
    }
    .chat-toggle:hover { transform: scale(1.08); box-shadow: 0 0 35px rgba(212,47,112,0.55); }
    .chat-toggle::after {
      content: "";
      position: absolute;
      inset: -10px;
      background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.5), transparent 70%);
      opacity: 0.5;
      filter: blur(6px);
    }
    .chat-toggle.rotate { transform: rotate(180deg); }
    .chat-toggle img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; transition: opacity 0.3s ease; }
    .chat-toggle .close-icon { position: absolute; font-size: 34px; color: white; opacity: 0; transition: opacity 0.3s ease; }
    .chat-toggle.open img { opacity: 0; }
    .chat-toggle.open .close-icon { opacity: 1; }

    .chat-widget {
      position: fixed;
      bottom: 100px;
      right: 25px;
      width: 370px;
      max-width: 90vw;
      height: 520px;
      display: flex;
      flex-direction: column;
      border-radius: 24px;
      overflow: hidden;
      font-family: 'Poppins', sans-serif;
      z-index: 9999;
      transform: translateY(30px);
      opacity: 0;
      pointer-events: none;
      transition: all 0.45s ease;
      backdrop-filter: blur(20px);
      background: rgba(255,255,255,0.6);
      border: 1px solid rgba(255,182,193,0.4);
      box-shadow: 0 8px 40px rgba(0,0,0,0.15);
    }
    .chat-widget::before {
      content: "";
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at top right, rgba(255,182,193,0.15), transparent 70%);
      pointer-events: none;
    }
    .chat-widget.active { opacity: 1; pointer-events: auto; transform: translateY(0); }

    .chat-header {
      background: linear-gradient(135deg, #d42f70, #f7b3cc, #fbe6ef);
      background-size: 200% 200%;
      animation: shimmer 5s infinite linear;
      color: #fff;
      padding: 14px 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-family: 'Playfair Display', serif;
      font-size: 1.1rem;
      letter-spacing: 0.3px;
      text-shadow: 0 1px 3px rgba(0,0,0,0.2);
    }
    @keyframes shimmer { 0% {background-position:0% 50%;} 50% {background-position:100% 50%;} 100% {background-position:0% 50%;} }

    .chat-header img.header-icon { width: 34px; height: 34px; border-radius: 50%; margin-right: 10px; }
    .chat-title { flex-grow: 1; font-weight: 600; }

    .chat-box {
      flex-grow: 1;
      padding: 14px;
      overflow-y: auto;
      scroll-behavior: smooth;
      background: linear-gradient(to bottom right, rgba(255,250,252,0.9), rgba(255,240,245,0.7));
    }

    .chat-message {
      margin-bottom: 12px;
      max-width: 80%;
      border-radius: 16px;
      padding: 10px 14px;
      line-height: 1.55;
      font-size: 14px;
      animation: bubbleIn 0.35s ease;
      transform-origin: bottom;
      word-break: break-word;
    }
    @keyframes bubbleIn { from {opacity:0; transform:scale(0.95) translateY(10px);} to {opacity:1; transform:scale(1) translateY(0);} }

    .chat-message.user {
      background: linear-gradient(135deg, #f5e8e4, #fdf8f8);
      color: #333;
      align-self: flex-end;
      border-bottom-right-radius: 4px;
      margin-left: auto;
      box-shadow: 0 2px 6px rgba(0,0,0,0.05);
    }

    .chat-message.bot {
      background: rgba(255,255,255,0.85);
      border: 1px solid rgba(247,179,204,0.6);
      color: #333;
      align-self: flex-start;
      border-bottom-left-radius: 4px;
      box-shadow: 0 2px 8px rgba(212,47,112,0.08);
    }

    /* Markdown Styling */
    .chat-message.bot p { margin: 6px 0; }
    .chat-message.bot ul { margin-left: 18px; list-style: disc; }
    .chat-message.bot code {
      background: rgba(0,0,0,0.05);
      padding: 2px 5px;
      border-radius: 4px;
      font-family: monospace;
    }
    .chat-message.bot pre {
      background: #f7f7f7;
      padding: 8px;
      border-radius: 8px;
      overflow-x: auto;
      font-family: monospace;
    }

    .typing { display: flex; align-items: center; gap: 3px; }
    .dot { width: 6px; height: 6px; background: #d42f70; border-radius: 50%; animation: blink 1.3s infinite both; }
    .dot:nth-child(2){ animation-delay:0.2s; }
    .dot:nth-child(3){ animation-delay:0.4s; }
    @keyframes blink { 0%,80%,100%{opacity:0;} 40%{opacity:1;} }

    .chat-input-area {
      display: flex;
      border-top: 1px solid rgba(247,179,204,0.4);
      background: rgba(255,255,255,0.7);
      padding: 10px;
      align-items: center;
      backdrop-filter: blur(8px);
    }
    .chat-input-area input {
      flex-grow: 1;
      border: none;
      padding: 10px;
      border-radius: 14px;
      background: rgba(255,255,255,0.6);
      font-size: 14px;
      outline: none;
      box-shadow: inset 0 1px 2px rgba(0,0,0,0.05);
    }

    .send-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, #d42f70, #f7b3cc);
      border: none;
      color: #fff;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      margin-left: 8px;
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.3s ease;
      box-shadow: 0 4px 12px rgba(212,47,112,0.3);
    }
    .send-btn svg { width: 18px; height: 18px; fill: white; transform: translateX(1px); }
    .send-btn:active { transform: scale(0.9); box-shadow: 0 2px 6px rgba(212,47,112,0.3); }

    .flag-btn {
      display: block;
      margin-top: 6px;
      font-size: 12px;
      background: none;
      color: #d42f70;
      border: none;
      cursor: pointer;
      text-decoration: underline;
      text-align: left;
    }

    @media (max-width: 500px) {
      .chat-widget { right: 10px; bottom: 90px; width: calc(100% - 20px); height: 70vh; }
    }
  `;
  document.head.appendChild(style);

  /* ------------------------------ STRUCTURE ------------------------------ */
  const widgetHTML = `
    <div id="chat-toggle" class="chat-toggle">
      <img src="./bridal-icon2.png" alt="Chat" />
      <div class="close-icon">&times;</div>
    </div>

    <div id="chat-widget" class="chat-widget">
      <div class="chat-header">
        <img src="./bridal-icon.png" class="header-icon" alt="Maharani Icon" />
        <span class="chat-title">MaharaniWeddings Assistant</span>
      </div>

      <div id="chat-box" class="chat-box"></div>

      <div class="chat-input-area">
        <input type="text" id="user-input" placeholder="Ask about your wedding..." />
        <button id="send-btn" class="send-btn">
          <svg viewBox="0 0 24 24"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>
        </button>
      </div>
    </div>
  `;
  const container = document.createElement("div");
  container.innerHTML = widgetHTML;
  document.body.appendChild(container);

  /* ------------------------------ VARIABLES ------------------------------ */
  const chatWidget = document.getElementById("chat-widget");
  const chatToggle = document.getElementById("chat-toggle");
  const chatBox = document.getElementById("chat-box");
  const sendBtn = document.getElementById("send-btn");
  const userInput = document.getElementById("user-input");
  const conversationMap = [];

  let threadId = localStorage.getItem("maharani_thread_id");
  if (!threadId) {
    threadId = "thread_" + crypto.randomUUID();
    localStorage.setItem("maharani_thread_id", threadId);
  }

  /* ------------------------------ TOGGLE CHAT ------------------------------ */
  const toggleChat = () => {
    chatWidget.classList.toggle("active");
    chatToggle.classList.toggle("open");
    chatToggle.classList.toggle("rotate");
    if (chatWidget.classList.contains("active") && !chatBox.hasChildNodes()) {
      addMessage("Hi lovely! 💐 I’m the **MaharaniWeddings Assistant** — how can I help you plan your dream wedding today?", "bot");
    }
  };
  chatToggle.addEventListener("click", toggleChat);

  /* ------------------------------ ADD MESSAGE ------------------------------ */
  function addMessage(content, sender, conversationId = null) {
    const message = document.createElement("div");
    message.classList.add("chat-message", sender);

    if (sender === "bot") {
      if (window.marked) {
        message.innerHTML = marked.parse(content);
      } else {
        message.innerHTML = content;
      }

      message.querySelectorAll("a").forEach(link => {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      });

      if (conversationId) {
        const flagBtn = document.createElement("button");
        flagBtn.textContent = "🚩 Flag this message";
        flagBtn.className = "flag-btn";
        flagBtn.onclick = () => flagConversation(conversationId);
        message.appendChild(flagBtn);
      }
    } else {
      message.textContent = content;
    }

    chatBox.appendChild(message);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  /* ------------------------------ TYPING ANIMATION ------------------------------ */
  function showTyping() {
    const typing = document.createElement("div");
    typing.className = "chat-message bot typing";
    typing.innerHTML = `<div class="dot"></div><div class="dot"></div><div class="dot"></div>`;
    chatBox.appendChild(typing);
    chatBox.scrollTop = chatBox.scrollHeight;
    return typing;
  }

  /* ------------------------------ SEND MESSAGE ------------------------------ */
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
        body: JSON.stringify({ query, thread_id: threadId })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      typingMsg.remove();
      conversationMap.push(data.conversation_id);
      addMessage(data.response, "bot", data.conversation_id);
    } catch (err) {
      typingMsg.remove();
      addMessage("⚠️ Connection error. Please try again.", "bot");
    }
  }

  /* ------------------------------ FLAG CONVERSATION ------------------------------ */
  async function flagConversation(conversationId) {
    if (!confirm("🚩 Flag this conversation for admin review?")) return;
    try {
      await fetch(flagUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          thread_id: threadId,
          conversation_id: conversationId,
          assigned_to: "admin"
        })
      });
      alert("✅ Conversation flagged for review.");
    } catch {
      alert("⚠️ Could not flag conversation.");
    }
  }

  /* ------------------------------ EVENTS ------------------------------ */
  sendBtn.addEventListener("click", sendMessage);
  userInput.addEventListener("keypress", e => e.key === "Enter" && sendMessage());
})();
