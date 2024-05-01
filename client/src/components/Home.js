import React, { useEffect, useState } from 'react';
import NavBar from './navbar';
import Tilt from 'react-parallax-tilt';

const Home = () => {
  const [showWelcomeText, setShowWelcomeText] = useState(true);
  const [showIntroText, setShowIntroText] = useState(false);
  const [introText, setIntroText] = useState('');
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    // Show welcome text for 5 seconds
    const welcomeTimer = setTimeout(() => {
      setShowWelcomeText(false);
      setShowIntroText(true);
    }, 1000);

    return () => clearTimeout(welcomeTimer);
  }, []);

  useEffect(() => {
    // Display intro text letter by letter
    if (showIntroText && textIndex < 'Let\'s start blogging'.length) {
      const introTimer = setTimeout(() => {
        setIntroText(prevText => prevText + 'Let\'s start blogging'[textIndex]);
        setTextIndex(prevIndex => prevIndex + 1);
      }, 20); // Adjust the speed of displaying each letter

      return () => clearTimeout(introTimer);
    }
  }, [showIntroText, textIndex]);

  const [gradientPosition, setGradientPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setGradientPosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const calculateGradient = () => {
    const offsetX = (gradientPosition.x / window.innerWidth) * 100;
    const offsetY = (gradientPosition.y / window.innerHeight) * 100;
    return `radial-gradient(circle at ${offsetX}% ${offsetY}%, red, orange, yellow, green, blue, indigo, violet)`;
  };

  return (
    <div style={{ height: '100vh', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <div style={{ position: 'fixed', top: 0, width: '100%', zIndex: 100 }}>
        <NavBar />
      </div>

      {/* Falling stars */}
      <div className="stars-container">
        {Array.from({ length: 50 }, (_, index) => (
          <div key={index} className="star" />
        ))}
      </div>

      <div
        style={{
          height: '100%',
          width: '100%',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: -1,
          background: calculateGradient(),
          transition: 'background 0.5s ease',
          filter: 'blur(10px)',
        }}
      />

      <style>{`
        .stars-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .star {
          position: absolute;
          background: white;
          width: 2px;
          height: 2px;
          border: none; /* Set border to none */
          animation: starFall 5s linear infinite;
        }

        @keyframes starFall {
          from {
            transform: translateY(-100vh);
          }
          to {
            transform: translateY(100vh);
          }
        }
      `}</style>

      {showWelcomeText && (
        <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} transitionSpeed={2500} perspective={1000}>
          <h2
            id="welcome-text"
            style={{
              fontSize: '6em', // Decreased font size
              textAlign: 'center',
              fontFamily: 'Lucida Handwriting, cursive',
              marginTop: '50px',
              WebkitBackgroundClip: 'text',
              color: 'white',
              textShadow: '0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 255, 255, 0.8), 0 0 40px rgba(0, 0, 0, 0.8)', // Added black shadow
            }}
            className="animated-text"
          >
            Welcome to BlogBuster
          </h2>
        </Tilt>
      )}

      {showIntroText && (
        <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} transitionSpeed={2500} perspective={1000}>
          <h2
            id="intro-text"
            style={{
              fontSize: '6em', // Decreased font size
              textAlign: 'center',
              fontFamily: 'Lucida Handwriting, cursive',
              marginTop: '50px',
              WebkitBackgroundClip: 'text',
              color: 'white',
              textShadow: '0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 255, 255, 0.8), 0 0 40px rgba(0, 0, 0, 0.8)', // Added black shadow
            }}
            className="animated-text"
          >
            {introText}
          </h2>
        </Tilt>
      )}

      {/* Add introductory content */}
    </div>
  );
};

export default Home;
