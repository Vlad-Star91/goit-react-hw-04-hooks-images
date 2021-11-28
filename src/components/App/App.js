import './App.css';
import '../../styles/styles.css';
import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Searchbar } from '../Searchbar/Searchbar.jsx';
import { Modal } from '../Modal/Modal.jsx';
import { ImageGallery } from '../ImageGallery/ImageGallery';
import { Button } from '../Button/Button.jsx';
import { GetImagesApi } from '../../Api/fetchApi';
import { Load } from '../Loader/Loader.jsx';
import scrollPageDown from '../../js/scrollPageDown';

import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';

export default function App() {
  const [showModal, setShowModal] = useState(false);
  const [pictures, setPictures] = useState([]);
  const [searchRequest, setSearchRequest] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [largeImageSrc, setLargeImageSrc] = useState('');
  const [alt, setAlt] = useState('');

  useEffect(() => {
    getData(searchRequest, page, 'searchBtn');
  }, [searchRequest]);
  useEffect(() => {
    getData(searchRequest, page, 'loadMoreBtn');
  }, [page]);
  useEffect(() => {
    setPictures(pictures);
  }, [pictures]);
  const isFirstRun = useRef(true);
  useLayoutEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
  });
  const getData = (request, page, target) => {
    GetImagesApi(request, page)
      .then(response => {
        if (response.status === 200 && searchRequest.trim().length) {
          if (target === 'searchBtn') {
            setPictures([...response.data.hits]);
          }
          if (response.data.hits.length === 0) {
            toast.error('Error request!');
          }
          if (target === 'loadMoreBtn') {
            setPictures([...pictures, ...response.data.hits]);
          }
        }
        if (response.status === 404) {
          throw new Error(response.message || 'pictures not exist');
        }
      })
      .then(() => setLoading(false))
      .finally(() => {
        scrollPageDown();
      });
  };

  const handleFormSubmit = request => {
    setLoading(true);
    setSearchRequest(request);
    getData(request, page);
  };
  const pageIncrement = () => {
    setPage(page + 1);
    setLoading(true);
    getData(searchRequest, page + 1);
    scrollPageDown();
    return;
  };
  const toggleModal = () => {
    setShowModal(!showModal);
  };
  const setCurrentPictureSrc = (largeImageSrc, alt) => {
    setShowModal(!showModal);
    if (largeImageSrc !== undefined) {
      setLargeImageSrc(largeImageSrc);
      setAlt(alt);
    }
  };
  return (
    <div className="App">
      <ToastContainer autoClose={2000} newestOnTop={true} />
      <Searchbar onSubmit={handleFormSubmit} />
      {pictures.length !== 0 && (
        <ImageGallery
          setCurrentPicture={setCurrentPictureSrc}
          images={pictures}
        />
      )}
      {showModal && (
        <Modal onClose={toggleModal}>
          <img src={largeImageSrc} alt={alt} />
        </Modal>
      )}
      {loading && <Load />}
      {pictures.length > 0 && (
        <div className={'container'}>
          <Button onClick={pageIncrement} />
        </div>
      )}
    </div>
  );
}
