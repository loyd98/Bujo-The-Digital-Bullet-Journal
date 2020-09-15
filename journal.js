const journalForm = document.querySelector(".entry-pane__form");
const textarea = document.querySelector(".entry-area");

class JournalUI {
  constructor(list) {
    this.list = list;
  }

  truncate(input) {
    if (input.length > 20) {
      return input.substring(0, 20) + "...";
    }
    return input;
  }

  render(data, id) {
    const when = dateFns.distanceInWordsToNow(data.created_at.toDate(), {
      addSuffix: true,
    });

    const content = this.truncate(data.entry);
    const html = `
              <div class="journal-pane__entry" data-id="${id}">
                  <div class="side"></div>
                  <span class="delete">x</span>
                  <span class="timestamp">${when}</span>
                  <div class="content">${content}</div>
              </div>
          `;

    this.list.innerHTML += html;
  }

  removeRender(list, id) {
    const arr = Array.from(list);
    arr.forEach((item) => {
      if (item.getAttribute("data-id") === id) {
        item.remove();
      }
    });
  }
}

class Journal {
  constructor() {
    this.journalEntries = db.collection("journal_entries");
  }

  async addEntry(message) {
    const now = new Date();

    const entry = {
      entry: message,
      created_at: firebase.firestore.Timestamp.fromDate(now),
    };

    const response = await this.journalEntries.add(entry);
    return response;
  }

  async deleteEntry(id) {
    const response = await this.journalEntries.doc(id).delete();
    return response;
  }

  getEntries(callback) {
    this.journalEntries.orderBy("created_at", "desc").onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          callback(change.doc);
        }
      });
    });
  }

  removeEntries(callback) {
    this.journalEntries.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "removed") {
          const id = change.doc.id;
          callback(id);
        }
      });
    });
  }
}
