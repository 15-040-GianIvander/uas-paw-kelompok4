import React, { useEffect, useState } from 'react';

const AuthSlider = ({ initialIndex = 0 }) => {
  // load local images (eager) from assets
  const imageModules = import.meta.glob('../assets/event-list/*.{png,jpg,jpeg,webp}', { eager: true });
  const imagesMap = Object.fromEntries(
    Object.entries(imageModules).map(([path, mod]) => [path.split('/').pop(), mod.default])
  );

  // desired order; festival-musik.png should be first/active
  const order = ['festival-musik.png', 'konser-indie.png', 'concert1.png', 'concert3.jpg', 'concert2.png'];
  const slides = order.map((name) => imagesMap[name]).filter(Boolean);

  const [index, setIndex] = useState(Math.max(0, Math.min(initialIndex, slides.length - 1)));

  useEffect(() => {
    if (!slides.length) return undefined;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4000);
    return () => clearInterval(t);
  }, [slides.length]);

  if (!slides.length) {
    return (
      <div className="auth-slider" style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.06), rgba(99,102,241,0.04))' }} />
    );
  }

  return (
    <div className="auth-slider" aria-hidden={false}>
      <img className="auth-slider__img" src={slides[index]} alt={`Slide ${index + 1}`} />
      <div className="auth-slider__overlay" aria-hidden />

      <div className="auth-slider__content">
        <h3>Selamat datang di Evoria</h3>
        <p>Temukan berbagai event seru dan amankan tiketmu sekarang!</p>
      </div>

      <div className="auth-slider__dots" aria-hidden>
        {slides.map((_, i) => (
          <button
            key={i}
            className={`dot ${i === index ? 'active' : ''}`}
            onClick={() => setIndex(i)}
            aria-label={`Slide ${i + 1}`}
            type="button"
          />
        ))}
      </div>
    </div>
  );
};

export default AuthSlider;
