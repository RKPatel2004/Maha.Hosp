import React, { useEffect, useState } from 'react';
import './bulletin.css';
import bulletinImage from '../../assets/home/bulletin.png';
import Navbar from '../header_footer/navbar';
import Footer from '../header_footer/footer';

const BULLETINS_PER_PAGE = 15;

const Bulletin = () => {
  const [bulletins, setBulletins] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch bulletins
  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/MahavirHospital/api/bulletins')
      .then(res => res.json())
      .then(data => {
        setBulletins(data.data || []);
        setFiltered(data.data || []);
        setLoading(false);
      });
  }, []);

  // Search handler
  const handleSearch = (e) =>{ 
    e.preventDefault();
    const filteredList = bulletins.filter(b =>
      b.Title.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(filteredList);
    setPage(1);
  };

  // Reset search
  const handleReset = () => {
    setSearch('');
    setFiltered(bulletins);
    setPage(1);
  };

  // Pagination
  const totalPages = Math.ceil(filtered.length / BULLETINS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * BULLETINS_PER_PAGE,
    page * BULLETINS_PER_PAGE
  );

  return (
    <div className="bulletin-main-bg">
      <div className="navbar-wrapper">
        <Navbar />
      </div>
      <div className="bulletin-header">
        <h2>Bulletin</h2>
        <div className="breadcrumb">
          <a href="/">Home</a> / Bulletin
        </div>
      </div>
      <div className="bulletin-content">
        <h1 className="bulletin-title">Latest News, Events & Announcements Right Here!</h1>
        <form className="bulletin-searchbar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Enter Bulletin Title"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button type="submit" className="search-btn">Search</button>
          <button type="button" className="reset-btn" onClick={handleReset}>Reset</button>
        </form>
        {/* Pagination controls directly after search bar */}
        <div className="bulletin-pagination">
          <button
            onClick={() => setPage(1)}
            disabled={page === 1}
            type="button"
          >{'<<'}</button>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            type="button"
          >{'<'}</button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx + 1}
              className={page === idx + 1 ? 'active' : ''}
              onClick={() => setPage(idx + 1)}
              type="button"
            >
              {idx + 1}
            </button>
          ))}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            type="button"
          >{'>'}</button>
          <button
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
            type="button"
          >{'>>'}</button>
        </div>
        <div className="bulletin-count">
          {filtered.length > 0 &&
            <span>
              {((page - 1) * BULLETINS_PER_PAGE) + 1}
              {' - '}
              {Math.min(page * BULLETINS_PER_PAGE, filtered.length)}
              {' of '}
              {filtered.length}
            </span>
          }
        </div>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="bulletin-list">
            {paginated.length === 0 ? (
              <div className="no-bulletins">No bulletins found.</div>
            ) : (
              paginated.map(bulletin => (
                <div className="bulletin-item" key={bulletin._id}>
                  <img src={bulletinImage} alt="Bulletin" className="bulletin-img" />
                  <div className="bulletin-info">
                    <h2 className="bulletin-item-title">{bulletin.Title}</h2>
                    <p className="bulletin-item-desc">{bulletin.Description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      {/* Footer at the bottom */}
      <Footer />
    </div>
  );
};

export default Bulletin;