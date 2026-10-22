import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const Arrow = () => <span className="arrow" aria-hidden="true">↗</span>;

function LensVisual({ mode }) {
  return (
    <div className={`lens-scene ${mode === 'Near' ? 'near' : ''}`} aria-label={`Lens currently in ${mode} mode`}>
      <div className="ray ray-one" /><div className="ray ray-two" /><div className="ray ray-three" />
      <div className="lens-shadow" />
      <div className="lens">
        <div className="lens-shine" />
        <div className="lens-core"><span>{mode === 'Near' ? 'N' : 'F'}</span></div>
      </div>
      <div className="focus-point" />
      <p className="focus-label">{mode} focus</p>
    </div>
  );
}

function App() {
  const [mode, setMode] = useState('Far');
  return (
    <main>
      <div className="aurora aurora-one" /><div className="aurora aurora-two" /><div className="grain" />
      <section className="hero shell" id="top">
        <div className="hero-copy">
          <h1>whatever title is idk</h1>
          <p className="lead">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
        <div className="hero-visual">
          <div className="lens-card glass-panel">
            <div className="hero-lens"><LensVisual mode={mode} /></div>
          </div>
        </div>
      </section>
      <section className="stats shell">
        <article><span>01</span><h3>title</h3><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p></article>
        <article><span>02</span><h3>other title</h3><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p></article>
        <article><span>03</span><h3>another title</h3><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p></article>
      </section>
      <section className="workspace shell" id="technology">
        <article className="blender-card glass-panel">
          <div><span /> 3-D MODEL</div><h2>Explore the lens build.</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus.</p>
          <div className="model-stage"><div className="model-grid" /><div className="model-orbit"><div className="model-lens" /></div><span>BLENDER PREVIEW</span></div>
          <button className="launch-button">Open 3D model <Arrow /></button>
        </article>
        <article className="demo glass-panel">
          <div className="demo-copy">
            <div className="eyebrow"><span /> 2D INTERACTIVE</div>
            <h2>Change the<br />way you focus.</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <div className="mode-switch" role="group" aria-label="Vision mode">
              {['Near', 'Far'].map(item => <button key={item} className={mode === item ? 'selected' : ''} onClick={() => setMode(item)}><span>{item === 'Near' ? '◎' : '◌'}</span>{item} vision</button>)}
            </div>
          </div>
          <div className="demo-visual">
            <div className="preview-label"><span>Light response</span></div>
            <LensVisual mode={mode} />
          </div>
        </article>
      </section>
    </main>
  );
}
createRoot(document.getElementById('root')).render(<App />);
