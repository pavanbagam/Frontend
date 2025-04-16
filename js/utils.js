function renderCard(content) {
    const div = document.createElement("div");
    div.className = "match-card";
    div.innerHTML = content;
    return div;
  }
  