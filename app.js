// dom queries
const entriesDiv = document.querySelector(".journal-pane");
const entries = document.getElementsByClassName("journal-pane__entry");

// class instances
const journal = new Journal();
const journalUI = new JournalUI(entriesDiv);

// Clock
const currentTime = () => {
  const date = new Date();
  let hour = date.getHours();
  let min = date.getMinutes();
  let sec = date.getSeconds();

  let midday = hour >= 12 ? "PM" : "AM";

  if (hour > 12) {
    hour = hour - 12;
  }

  if (hour === 0) {
    hour = 12;
  }
  h = updateTime(hour);
  m = updateTime(min);
  s = updateTime(sec);

  document.querySelector(".time__clock").innerHTML =
    h + ":" + m + ":" + s + " " + midday;
  document.querySelector(".time__date").innerHTML =
    new Date().toDateString() + " |";
};

const updateTime = (n) => {
  if (n < 10) {
    return "0" + n;
  } else {
    return n;
  }
};

setInterval(currentTime, 500);

// Journal
journalForm.addEventListener("click", (e) => {
  e.preventDefault();
  const entry = journalForm.entry.value.trim();
  if (entry !== "") {
    journal.addEntry(entry);
  }
  journalForm.entry.value = "";
});

entriesDiv.addEventListener("click", (e) => {
  if (e.target.className === "delete") {
    const id = e.target.parentElement.getAttribute("data-id");
    journal.deleteEntry(id);
  }
});

journal.getEntries((doc) => {
  journalUI.render(doc.data(), doc.id);
});

journal.removeEntries((id) => {
  journalUI.removeRender(entries, id);
});
