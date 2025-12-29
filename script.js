let currentIndex = 0;

function renderDay(index) {
  const day = PLAN[index];
  document.getElementById("day-title").textContent = `Day ${day.day}`;
  document.getElementById("scripture").textContent = day.scripture;
  document.getElementById("psalm").textContent = day.psalm;

  const list = document.getElementById("resources");
  list.innerHTML = "";

  day.resources.forEach(r => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = r.url;
    a.textContent = r.label;
    a.target = "_blank";
    li.appendChild(a);
    list.appendChild(li);
  });
}

document.getElementById("next").onclick = () => {
  if (currentIndex < PLAN.length - 1) {
    currentIndex++;
    renderDay(currentIndex);
  }
};

document.getElementById("prev").onclick = () => {
  if (currentIndex > 0) {
    currentIndex--;
    renderDay(currentIndex);
  }
};

document.getElementById("day-search").addEventListener("change", e => {
  const dayNum = parseInt(e.target.value, 10);
  if (dayNum >= 1 && dayNum <= PLAN.length) {
    currentIndex = dayNum - 1;
    renderDay(currentIndex);
  }
});

renderDay(currentIndex);
