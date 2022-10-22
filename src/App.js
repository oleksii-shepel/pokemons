import React, { useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import { Typeahead } from 'react-bootstrap-typeahead';
import ListGroup from 'react-bootstrap/ListGroup';
import './App.css';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectPaginationSlice } from './features/pagination/pagination-slice';
import { selectMainListSlice, SortMethod, fetchDataAsync, sort, setSearchString } from './features/mainList/mainList-slice';
import { setNumberOfEntities, setNumberPerPage, setCurrentPage, nextPage, previousPage, firstPage, lastPage } from './features/pagination/pagination-slice';

function App() {
  const dispatch = useDispatch();
  const pagination = useSelector(selectPaginationSlice);
  const mainList = useSelector(selectMainListSlice);

  let pokemonItems = [];

  useEffect(() => {
    dispatch(fetchDataAsync(SortMethod.SortByName));
  }, [dispatch]);

  useEffect(() => {
    if (mainList.status === "fulfilled") {
      dispatch(setNumberOfEntities(mainList.pokemons.length));
    }

  }, [dispatch, mainList.status, mainList.pokemons.length]);

  let pageArray = [];

  if (pagination.currentPage > 1) {
    pageArray.push((<Pagination.First key={"-2"} onClick={(e) => { dispatch(firstPage()); }} />));
    pageArray.push((<Pagination.Prev key={"-1"} onClick={(e) => { dispatch(previousPage()); }} />));
  }

  for (let number = pagination.startPage; number < pagination.startPage + pagination.numberOfVisiblePages; number++) {
    pageArray.push(
      (<Pagination.Item key={number} active={number === pagination.currentPage} onClick={(e) => { dispatch(setCurrentPage(+e.target.text)) }}>
        {number}
      </Pagination.Item>)
    );
  }

  if (pagination.startPage + pagination.numberOfVisiblePages <= pagination.numberOfPages) {
    pageArray.push((<Pagination.Next key={"+1"} onClick={(e) => { dispatch(nextPage()) }} />));
    pageArray.push((<Pagination.Last key={"+2"} onClick={(e) => { dispatch(lastPage()) }} />));
  }

  if (mainList.status === "fulfilled" && !!mainList.pokemons.length) {
    if (!!mainList.searchString.length) {
      pokemonItems = mainList.pokemons.filter((item) => { return item.name === mainList.searchString });
    }
    else {
      let firstItem = (pagination.currentPage - 1) * pagination.numberPerPage;
      let lastItem = pagination.currentPage * pagination.numberPerPage > pagination.numberOfEntities ? pagination.numberOfEntities : pagination.currentPage * pagination.numberPerPage;
      pokemonItems = mainList.pokemons.slice(firstItem, lastItem);
    }
  }

  return (
    <div className="container">
      <header>
        <Form className="d-flex flex-row justify-content-center align-items-end py-3">
          <Form.Group className="px-3">
            <Form.Label>Name</Form.Label>
            <Typeahead
              id="basic-typeahead-single"
              labelKey="name"
              onChange={(e) => { dispatch(setSearchString(e[0])); }}
              options={mainList.names.map(item => item.name)}
              placeholder="Choose a name..."
              selected={!!mainList.searchString.length ? [mainList.searchString] : []}
            />
          </Form.Group>
          <Form.Group className="px-3">
            <Form.Label>Number per Page</Form.Label>
            <Form.Control type="number" value={pagination.numberPerPage} onChange={(e) => dispatch(setNumberPerPage(+e.target.value))} />
          </Form.Group>
          <Form.Group className="px-3">
            <Form.Check
              type="switch"
              label="Sort by Type"
              value={mainList.sorting === SortMethod.SortByType ? true : false} onChange={(e) => { dispatch(sort(e.target.checked)) }} />
          </Form.Group>
        </Form>
        <br />
        <ListGroup as="ol" className="striped-list">
        {!!pokemonItems.length && pokemonItems
              .map(item => (
                <ListGroup.Item as="li" key={item.name} className="list-item d-flex flex-column justify-content-start align-items-start">
                  <div className="fw-bold">{item.name}</div>
                  <div style={{fontSize: '0.8em'}}>type: [{item.types.join(", ")}]</div>
                  <div style={{fontSize: '0.8em'}}>details: [<Link to={`/${item.name}`} key={item.name}>{item.url}</Link>]</div>
                </ListGroup.Item>
              ))}
        </ListGroup>
        <br/>
        <Pagination>
          {pageArray}
        </Pagination>

      </header>
    </div>
  );
}

export default App;
