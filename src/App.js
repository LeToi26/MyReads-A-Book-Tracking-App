
import React from 'react';
import Shelf from './Shelf';
import Search from './Search';
import { Route, Link } from 'react-router-dom';
import * as BooksAPI from './BooksAPI';
import './App.css';

class BooksApp extends React.Component {
  state = {
    books: [],
    searchBooks: [],
    isLoading: true,
  }

  getData() {
    BooksAPI.getAll().then(books => {
      this.setState({
        books,
        isLoading: false,
      })
    });
  };

  componentDidMount() {
    this.getData();
  };

  shelfUpdateBook = (addedbook, shelf) => {
    BooksAPI.update(addedbook, shelf).then(() => {
      addedbook.shelf = shelf
    })

    const BooksNew = this.state.books.filter(book => book.id !== addedbook.id)
    BooksNew.push(addedbook);
    this.setState({ books: BooksNew })
    this.setState({ searchBooks: [] })
    this.componentDidMount()
  };

  searchData = (query) => {
    if (query.length !== 0) {
      BooksAPI.search(query).then(searchBooks => {
        let searchResult = [];
        for (const itemSearch of searchBooks) {
          for (const book of this.state.books) {
            if (itemSearch.id === book.id) {
              itemSearch.shelf = book.shelf
            }
          }
          searchResult.push(itemSearch)
        }
        return searchResult
      }).then((searchBooks) => {
        this.setState(() => ({ searchBooks: searchBooks }))
      }).catch(() => this.setState({ searchBooks: [] }))
    } else {
      this.setState({ searchBooks: [] })
    }
  };

  render() {
    return (
      <div className="app">
        <Route exact path="/" render={() => (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <Shelf
                books={this.state.books}
                shelfUpdate={this.shelfUpdateBook}
              />
            </div>
            <div className="open-search">
              <Link to="/search">Add a book</Link>
            </div>
          </div>
        )} />

        <Route path="/search" render={() => (
          <Search
            searchBooks={this.state.searchBooks}
            search={this.searchData}
            shelfUpdate={this.shelfUpdateBook}
          />
        )}
        />
      </div>
    )
  }
}

export default BooksApp
