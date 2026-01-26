// BibleGateway translation
const BG_VERSION = "CEB";

function toBibleGatewayQuery(ref) {
  let s = (ref || "").trim();
  s = s.replace(/–/g, "-").replace(/—/g, "-");
  s = s.replace(/\s+/g, " ");
  // Special case in the plan: "2 & 3 John 1, 1" -> "2 John 1; 3 John 1"
  s = s.replace(/\b(\d)\s*&\s*(\d)\s+John\s+1,\s*1\b/i, "$1 John 1; $2 John 1");
  return encodeURIComponent(s);
}

function makeLink(text, url) {
  const a = document.createElement("a");
  a.href = url;
  a.textContent = text;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  return a;
}

function setLinkedText(el, displayText) {
  el.innerHTML = "";
  const url = `https://www.biblegateway.com/passage/?search=${toBibleGatewayQuery(displayText)}&version=${encodeURIComponent(BG_VERSION)}`;
  el.appendChild(makeLink(displayText, url));
}

function renderDay(index) {
  const day = PLAN[index];

  document.getElementById("day-title").textContent = `Day ${day.day}`;
  document.getElementById("day-count").textContent = `${day.day} of ${PLAN.length}`;

  setLinkedText(document.getElementById("scripture"), day.scripture);
  setLinkedText(document.getElementById("psalm"), day.psalm);

  const list = document.getElementById("resources");
  const noRes = document.getElementById("no-resources");
  list.innerHTML = "";

  if (day.resources && day.resources.length) {
    noRes.hidden = true;
    day.resources.forEach(r => {
      const li = document.createElement("li");
      if (!r.url) {
        li.textContent = r.label;
      } else {
        li.appendChild(makeLink(r.label, r.url));
      }
      list.appendChild(li);
    });
  } else {
    noRes.hidden = false;
  }

  document.getElementById("prev").disabled = index === 0;
  document.getElementById("next").disabled = index === PLAN.length - 1;
}

function init() {
  const status = document.getElementById("status");

  // Fail loudly with a helpful message if plan.js didn't load
  if (typeof PLAN === "undefined" || !Array.isArray(PLAN) || PLAN.length === 0) {
    if (status) status.textContent = "Error: plan.js did not load. Confirm plan.js is in the same folder as index.html and not renamed.";
    throw new Error("PLAN data not loaded. Make sure plan.js is in the same folder and loaded before script.js.");
  }

let currentIndex = 0;

  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  const input = document.getElementById("day-search");
  const help = document.getElementById("jump-help");
  const form = document.getElementById("jump-form");

  input.max = String(PLAN.length);
  help.textContent = `Enter a day number from 1 to ${PLAN.length}.`;
  if (status) status.textContent = "";

  function jumpToDay(dayNumber) {
    if (!Number.isInteger(dayNumber)) return false;
    if (dayNumber < 1 || dayNumber > PLAN.length) return false;
    currentIndex = dayNumber - 1;
    renderDay(currentIndex);
    return true;
  }

  nextBtn.addEventListener("click", () => {
    if (currentIndex < PLAN.length - 1) {
      currentIndex++;
      renderDay(currentIndex);
    }
  });

  prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      renderDay(currentIndex);
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const dayNum = parseInt(input.value, 10);
    if (!jumpToDay(dayNum)) {
      help.textContent = `Please enter a valid day number (1–${PLAN.length}).`;
      input.focus();
      input.select?.();
    } else {
      help.textContent = `Showing Day ${dayNum}.`;
    }
  });

  renderDay(currentIndex);
}

document.addEventListener("DOMContentLoaded", init);
