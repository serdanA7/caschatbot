const chatWindow = document.getElementById('chat-window');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const menuBtn = document.getElementById('menu-btn');
const menuPopup = document.getElementById('menu-popup');
const closeMenuBtn = document.getElementById('close-menu');
const questionsList = document.getElementById('questions-list');
// const suggestionsDiv = document.getElementById('suggestions'); // removed

// All hardcoded questions (sync with backend)
const allQuestions = [
  'Care este numărul maxim de medicamente compensate sau gratuite pe care le pot primi lunar pe o rețetă?',
  'Câte consultații pot avea cu o singură trimitere de la medicul de familie?',
  'Cum verific dacă sunt asigurat?',
  'Ce fac dacă nu sunt angajat dar vreau să fiu asigurat?',
  'Cine poate fi coasigurat pe cardul meu de sănătate?',
  'Pot primi servicii dacă nu am certificat de asigurat fizic?',
  'Cât este valabil cardul național de sănătate?',
  'Ce include pachetul de bază al serviciilor medicale?',
  'Am dreptul la vizite medicale la domiciliu?',
  'Sunt incluse medicamentele pentru boli cronice?',
  'Pot schimba medicul de familie?',
  'Screening-urile preventive sunt decontate?',
  'Copiii trebuie să fie asigurați separat?',
  'Sunt acoperite consultațiile prenatale și nașterea?',
  'Cum dovedești calitatea de asigurat?',
  'Ce servicii sunt decontate gratuit de CNAS?',
  'Ce nu decontează CNAS?',
  'Un cetățean străin poate beneficia de asigurare în România?',
  'De ce trebuie să plătesc contribuție CASS?',
  'Am certificat de handicap și nu lucrez — pot fi asigurat?',
  'Ce sunt programele naționale de sănătate?',
  'Pot lucra ca liber-profesionist și fiu asigurat?',
  'Cum obțin cardul european de asigurări?'
];

let lastBotWasFallback = false;

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function appendMessage(text, sender, time = new Date(), typing = false) {
  const msgDiv = document.createElement('div');
  msgDiv.className = 'message ' + sender;
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  if (typing) {
    bubble.innerHTML = '<span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>';
  } else {
    bubble.textContent = text;
  }
  const timestamp = document.createElement('div');
  timestamp.className = 'timestamp';
  timestamp.textContent = formatTime(time);
  msgDiv.appendChild(bubble);
  msgDiv.appendChild(timestamp);
  chatWindow.appendChild(msgDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return { msgDiv, bubble };
}

// Typing animation for bot reply
async function typeBotMessage(fullText, msgDiv, bubble, time = new Date()) {
  bubble.textContent = '';
  for (let i = 0; i < fullText.length; i++) {
    bubble.textContent += fullText[i];
    chatWindow.scrollTop = chatWindow.scrollHeight;
    await new Promise(r => setTimeout(r, 14 + Math.random() * 18));
  }
  // update timestamp in case of long messages
  msgDiv.querySelector('.timestamp').textContent = formatTime(time);

  // If fallback, show escalate button
  if (lastBotWasFallback) {
    showEscalateButton(msgDiv);
    lastBotWasFallback = false;
  }
}

function showEscalateButton(msgDiv) {
  let btn = document.createElement('button');
  btn.className = 'escalate-btn';
  btn.textContent = 'Contactează un operator';
  btn.onclick = () => {
    openSupportModal();
  };
  msgDiv.appendChild(btn);
}

// Support modal logic
function openSupportModal() {
  document.getElementById('support-modal').classList.remove('hidden');
}
function contactBack() {
  document.querySelector('.support-email').style.display = 'none';
  document.querySelector('.contact-back').style.display = 'none';
  document.getElementById('support-thankyou').classList.remove('hidden');
}
function closeSupportModal() {
  document.getElementById('support-modal').classList.add('hidden');
  // Reset modal for next use
  document.querySelector('.support-email').style.display = '';
  document.querySelector('.contact-back').style.display = '';
  document.getElementById('support-thankyou').classList.add('hidden');
}

// Show welcome message from cas chatbot
window.addEventListener('DOMContentLoaded', () => {
  appendMessage("Salut! Eu sunt CAS Chatbot, asistentul tau virtual. Cum te pot ajuta?", 'bot');
});

// function showRandomSuggestions() { ... } // removed
// function sendQuestion(question) { ... } // removed

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const question = userInput.value.trim();
  if (!question) return;
  appendMessage(question, 'user');
  userInput.value = '';

  // Show typing animation
  const { msgDiv, bubble } = appendMessage('', 'bot', new Date(), true);

  try {
    const res = await fetch('/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question })
    });
    const data = await res.json();
    // Check if fallback
    lastBotWasFallback = data.answer && data.answer.startsWith('Sorry');
    await new Promise(r => setTimeout(r, 400 + Math.random() * 400)); // Simulate thinking
    await typeBotMessage(data.answer, msgDiv, bubble);
  } catch (err) {
    lastBotWasFallback = true;
    await typeBotMessage('Error connecting to server.', msgDiv, bubble);
  }
});

// Menu popup logic
menuBtn.addEventListener('click', () => {
  menuPopup.classList.remove('hidden');
  renderQuestionsList();
});
closeMenuBtn.addEventListener('click', () => {
  menuPopup.classList.add('hidden');
});

function renderQuestionsList() {
  questionsList.innerHTML = '';
  allQuestions.forEach(q => {
    const li = document.createElement('li');
    li.textContent = q;
    li.onclick = () => {
      menuPopup.classList.add('hidden');
      userInput.value = q;
      chatForm.dispatchEvent(new Event('submit'));
    };
    questionsList.appendChild(li);
  });
} 