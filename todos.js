const todosForm = document.querySelector(".todos__form");

class TodosUI {
  constructor(list) {
    this.list = list;
  }

  render(data, id) {
    const html = `
        <li data-id="${id}" class="todos__item">
            ${data.content}
            <button class="todos__delete"></button>
         </li>
        `;

    this.list.innerHTML += html;
  }

  removeRender(list, id) {
    const arr = Array.from(list);
    arr.forEach((todo) => {
      if (todo.getAttribute("data-id") === id) {
        todo.remove();
      }
    });
  }
}

class Todos {
  constructor() {
    this.todos = db.collection("todos");
  }

  async addTodo(content) {
    const now = new Date();
    const todo = {
      content,
      created_at: firebase.firestore.Timestamp.fromDate(now),
    };

    const response = await this.todos.add(todo);
    return response;
  }

  async deleteTodo(id) {
    const response = await this.todos.doc(id).delete();
    return response;
  }

  getTodos(callback) {
    this.todos.orderBy("created_at", "asc").onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          callback(change.doc);
        }
      });
    });
  }

  removeTodos(callback) {
    this.todos.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "removed") {
          callback(change.doc.id);
        }
      });
    });
  }
}
