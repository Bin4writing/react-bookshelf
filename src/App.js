import React from 'react'
import './App.css'
import { Route } from 'react-router-dom'
import BookSearch from './BookSearch'
import BookList from './BookList'
import * as BooksAPI from './BooksAPI'

class BooksApp extends React.Component {

  // so search doesn't show up at BookList
  state = {
    books: [],
    searchedBooks: [],
    filteredBooks: [],
  }

    // represents books currently in the shelf
  componentDidMount() {
    BooksAPI.getAll().then((books) => {
      this.setState({ books })
    })
  }

  // BooksAPI needs book object and shelf string, so need to pass it to changeShelf
  changeShelf = (book, shelf) => {

    // check if search results already exist in booklist

    BooksAPI.update(book, shelf).then(response => {
      book.shelf = shelf
      this.setState((state) => ({
        books: this.state.books.filter((b) => b.id !== book.id).concat([ book ])
      }))
    })
  }

  submitQuery = (query, searchedBooks) => {
    if (query !== '') {
      this.setState({ query: query })

      const { books } = this.state

      // returns from BooksAPI.search() and BooksAPI.getAll() are not consistent
      // check if any search results already exist in your list of books
      // if result exists in personal list of books, change it to the appropriate shelf type
      
      BooksAPI.search(query, 100).then(searchedBooks => {
              searchedBooks.forEach(sb => {
                books.forEach(b => {
                  if(b.id === sb.id) {
                    sb.shelf = b.shelf;
                  }
                })
              })
            
          this.setState({ searchedBooks: searchedBooks })
      }).catch(e => { // catch error if query can't be found
        this.setState({ searchedBooks: []}) 
      }) 
    }
  }

  render() {
    
    return (

      <div className="app">

          <Route exact path="/" render={({ history }) => (
            <BookList books={this.state.books} 
                      changeShelf={this.changeShelf}
                      /> )} />
                      

          <Route exact path="/search" render={({ history }) => (
            <BookSearch searchedBooks={this.state.searchedBooks}
                        changeShelf={this.changeShelf}
                        submitQuery={this.submitQuery}
                        /> )} />
          
      </div>
    )
  }
}

export default BooksApp
