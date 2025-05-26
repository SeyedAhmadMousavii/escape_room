import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import logo from '../assets/images/logo.png';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <header className="header">
        <img src={logo} alt="لوگو انجمن علمی" className="logo" />
      </header>

      <main className="main-content">
        <h1 className="title">
          به اتاق فرار انجمن علمی کامپیوتر خوش آمدید!
        </h1>
        
        <div className="game-info">
          <p>چالش هیجان‌انگیز رمزگشایی و حل معما</p>
          <p>۵ نفر برتر جایزه دریافت می‌کنند!</p>
        </div>

        <button 
          className="start-button"
          onClick={() => navigate('/game')}
        >
          شروع بازی
        </button>
      </main>

      <footer className="footer">
        طراحی شده توسط انجمن علمی کامپیوتر دانشگاه علم و صنعت
      </footer>
    </div>
  );
};

export default HomePage;