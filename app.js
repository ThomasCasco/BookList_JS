//Book Class: Representa un libro.
class Book{
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}
//UI Class: Tarea de la UI
class UI {
    static displayBooks() {
        const books = Store.getBooks();

        books.forEach((book) => UI.addBookTolList(book));
    }

    static addBookTolList(book){
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');

        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);
    }

    static deleteBook(el) {
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove();
        } 
    }

    static showAlert(message, className){
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);
        
        // 3 regla de los 3 segundos
        setTimeout(() => document.querySelector('.alert').remove(),3000);
    }

    static clearFields(){
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}
//Store Class: Maneja el LocalStorage
class Store {
    static getBooks(){
        let books;
        if(localStorage.getItem('books')=== null){
            books = [];
        } else{
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book){
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books',JSON.stringify(books));
    }

    static removeBook(isbn){
        const books = Store.getBooks();
        
        books.forEach((book, index) => {
            if(book.isbn === isbn){
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books',JSON.stringify(books));
    }
}
// Eventos: Mostrar Libros
document.addEventListener('DOMContentLoaded',UI.displayBooks);

// Eventos: A??adir un libro
document.querySelector('#book-form').addEventListener('submit', (e) => {
        //obtener valores del form
        const title = document.querySelector('#title').value;
        const author = document.querySelector('#author').value; 
        const isbn = document.querySelector('#isbn').value; 

        // Validar campos
        if(title === '' || author === '' || isbn === '') {
            UI.showAlert('Please Fill in all fields', 'danger')
        }else{
            // instanciar un libro
        const book = new Book(title, author, isbn);

        // A??adir libro a la UI
        UI.addBookTolList(book);

        // A??adir book al storage
        Store.addBook(book);

        // Mostrar mensaje de libro a??adido corrrectamente
        UI.showAlert('Book Added', 'success');    

        //Limpiar fields
        UI.clearFields();
        }
    });

// Eventos: Quitar un libro
document.querySelector('#book-list').addEventListener('click', (e) => {
    // Eliminar el libro de la UI
    UI.deleteBook(e.target);

    // Mostrar mensaje de libro removido corrrectamente
    UI.showAlert('Book Removed', 'success');    

  
    // Eliminar libro de la tienda
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
  });