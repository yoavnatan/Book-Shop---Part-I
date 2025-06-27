'use strict'

const STORAGE_KEY = 'books'

var gBooks
_createBooks()
console.log(gBooks)

function getBooks(filterBy) {
    if (!filterBy) return gBooks

    return gBooks.filter(book => book.title.toLowerCase().includes(filterBy.toLowerCase()))

}

function getBookById(bookId) {
    return gBooks.find(book => book.id === bookId)

}

function removeBook(bookId) {
    const idx = gBooks.findIndex(book => book.id === bookId)
    gBooks.splice(idx, 1)
    _saveBooks()
}

function updatePrice(bookId, newPrice) {
    console.log('bookId', bookId)
    const book = getBookById(bookId)
    console.log(book)
    book.price = newPrice

    _saveBooks()
    return book
}

function addBook(title, price, img) {

    const newBook = _createBook(title, price, img)
    gBooks.push(newBook)

    _saveBooks()
    return newBook
}

function _createBooks() {
    gBooks = loadFromStorage(STORAGE_KEY)
    if (gBooks && gBooks.length > 0) return

    gBooks = [
        _createBook('The Adventures of Lori Ipsi', 120, 'imgs/advanture.jpg', 'Siki & Lori is about a Siamese cat boy named Siki and a golden retriever dog named Lori. That go on exciting adventures & most haunting and action type series. They encounter many villains slowly twists over to cursed odjects, possessed pets and people. With scary monsters & ghosts although it gets bloody during in the futher chapters of Siki and Lori.'),
        _createBook('World Atlas', 300, 'imgs/atlas.jpg', 'lorem ipsum'),
        _createBook('Zorba the Greek', 87, 'imgs/zorba.jpg', 'lorem ipsum')
    ]

    _saveBooks()
}

function _createBook(title, price, img, description) {
    return {
        id: makeid(),
        title,
        price,
        img,
        description,
        rate: 0,
    }
}

function _saveBooks() {
    saveToStorage(STORAGE_KEY, gBooks)
}

function updateRating(bookId, diff) {
    const book = getBookById(bookId)
    book.rate += diff
    _saveBooks()
    return book
}

function addBookByModal(title, price, img) {
    addBook(title, price, img)
    _saveBooks

}