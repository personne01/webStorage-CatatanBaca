const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author, 
    year,
    isCompleted
  };
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function isStorageExist() /* boolean */ {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

/**
 * Fungsi ini digunakan untuk menyimpan data ke localStorage
 * berdasarkan KEY yang sudah ditetapkan sebelumnya.
 */
function saveData() {
  if (isStorageExist()) {
    const parsed /* string */ = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBook(bookObject) {
  const {id, title, author, year, isCompleted} = bookObject;

  const judulBuku = document.createElement('h3');
  judulBuku.innerText = title;

  const penulisBuku = document.createElement('p');
  penulisBuku.innerText = `Penulis : ${author}`

  const tahunBuku = document.createElement('p');
  tahunBuku.innerText = `Tahun : ${year}`

  const textContainer = document.createElement('div');
  textContainer.classList.add('card');
  textContainer.append(judulBuku, penulisBuku, tahunBuku);
  textContainer.setAttribute('id', `bookId - ${id}`)

  if (isCompleted == 'true') {
    const undoButton = document.createElement('button');
    undoButton.classList.add('undo-button');
    undoButton.addEventListener('click', function () {
      moveToUncompleted(id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
    trashButton.addEventListener('click', function () {
      removeBooks(id);
    })
    
    textContainer.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement('button');
    checkButton.classList.add('check-button');
    checkButton.addEventListener('click', function () {
      moveToCompleted(id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
    trashButton.addEventListener('click', function () {
      removeBooks(id);
    })
    textContainer.append(checkButton, trashButton);
  }
  return textContainer;
}

function addBook() {
  const getId = generateId();
  const getTitle = document.getElementById('title').value;
  const getAuthor = document.getElementById('author').value;
  const getYear = document.getElementById('year').value;
  const getStatus = document.getElementById('isCompleted').value;
  
  const bookObject = generateBookObject(getId, getTitle, getAuthor, getYear, getStatus);
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addBooksToCompleted(BookId) {
  const bookTarget = findBook(BookId);

  if (bookTarget == null) return;
  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addBooksToUncompleted(BookId) {
  const bookTarget = findBook(BookId);

  if (bookTarget == null) return;
  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function moveToCompleted(BookId) {
  const bookTarget = findBook(BookId);

  if (bookTarget == null) return;
  bookTarget.isCompleted = 'true';
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function moveToUncompleted(BookId) {
  const bookTarget = findBook(BookId);

  if (bookTarget == null) return;
  bookTarget.isCompleted = 'false';
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBooks(BookId) {
  
  if (confirm("Yakin menghapus data tersebut?")) {
    const bookTarget = findBookIndex(BookId);

    if (bookTarget === -1) return;
  
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  } else {
      return
  }
  
}

document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('form')
  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(SAVED_EVENT, () => {
  console.log('Data berhasil disimpan.');
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBookList = document.getElementById('belum-selesai')
  const completedBook = document.getElementById('selesai');

  uncompletedBookList.innerHTML = '';
  completedBook.innerHTML = '';

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (bookItem.isCompleted == 'true') {
      completedBook.append(bookElement);
    } else{
      uncompletedBookList.append(bookElement);
    }
  }
});


function search() {
  let cards = document.querySelectorAll('.card')
  let search_query = document.getElementById("searchbox").value;
  for (var i = 0; i < cards.length; i++) {
    if(cards[i].innerText.toLowerCase()
      .includes(search_query.toLowerCase())) {
        
        cards[i].classList.remove("is-hidden");
    } else {
      cards[i].classList.add("is-hidden");
    }
  }
}