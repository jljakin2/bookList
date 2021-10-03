// 3 classes are needed:
//      1. Book class - represents a book
//      2. UI Class - handle UI related tasks
//      3. Store Class - handles the storage of the books

// 3 events are needed:
//      1. Display books
//      2. Add book
//      3. Remove boo

// CLASSES
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  static displayBooks() {
    // checks local storage to see if books are saved, if not, sets books to empty
    const books = Store.getBooks();

    books.forEach(book => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const list = document.querySelector("#book-list");

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
      `;

    list.appendChild(row);
  }

  static deleteBook(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    container.insertBefore(div, form);

    // vanish in 3 seconds
    setTimeout(() => document.querySelector(".alert").remove(), 3000);
  }

  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  }
}

class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }

    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();
    const newBooks = books.filter(book => book.isbn !== isbn);
    localStorage.setItem("books", JSON.stringify(books));
  }
}

// LOGIC
// wait for all content to be loaded, then display book event
document.addEventListener("DOMContentLoaded", UI.displayBooks());

// add the book event
document.querySelector("#book-form").addEventListener("submit", e => {
  e.preventDefault();

  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;

  if (title === "" || author === "" || isbn === "") {
    UI.showAlert("Please fill in all fields", "danger");
  } else {
    const book = new Book(title, author, isbn);

    // update UI to show new book
    UI.addBookToList(book);

    // update data storage to keep track of new book
    Store.addBook(book);

    // tell user their action was successful
    UI.showAlert("Book Added", "success");

    // clear form fields for UX
    UI.clearFields();
  }
});

// delete book event
document.querySelector("#book-list").addEventListener("click", e => {
  // update UI to show book was deleted. note: e.target identifies the specific
  // book that was clicked on even though the event listener is on the parent list
  UI.deleteBook(e.target);

  // update data source to reflect removed book. note: since delete button is inside of row,
  // we have to do some DOM traversal to get the isbn to check in the removeBook method
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  // update user so they know action is complete
  UI.showAlert("Book Removed", "success");
});
