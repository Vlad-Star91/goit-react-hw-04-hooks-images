import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import s from './Searchbar.module.css';

const Searchbar = ({ onSubmit }) => {
  const [searchRequest, setSearchRequest] = useState('');

  const onChangeInput = e => {
    setSearchRequest(e.currentTarget.value);
  };

  const onSearchSubmit = event => {
    event.preventDefault();

    if (!searchRequest) {
      toast.error('Please, enter a name!');
      return;
    }
    setSearchRequest('');

    onSubmit(searchRequest);
  };

  return (
    <header className={s.Searchbar}>
      <form onSubmit={onSearchSubmit} className={s.SearchForm}>
        <button type="submit" className={s.SearchForm__button}>
          <span className={s.SearchForm__button__label}>Search</span>
        </button>

        <input
          className={s.SearchForm__input}
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          onChange={onChangeInput}
          value={searchRequest}
        />
      </form>
    </header>
  );
};

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export { Searchbar };
