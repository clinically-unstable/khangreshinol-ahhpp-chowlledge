import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import RefractionSim, { MAX_IOR } from './RefractionSim.jsx';
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
  const mode = 'Far';
  const [ior, setIor] = useState(1.5);
  const [dist, setDist] = useState(0.9);
  const [retune, setRetune] = useState(false);
  const clampIor = v => Math.min(MAX_IOR, Math.max(1, v));
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
        <article className="demo glass-panel">
          <div className="demo-copy">
            <div className="eyebrow"><span /> simulation or some crap</div>
            <h2>Lense<br />Simulation</h2>
            <p>Edit the Index of Refraction and text distance to simulate lens behavior.</p>
            <div className="sim-controls">
              <div className="sim-row"><label htmlFor="ior">Index of refraction</label>
                <input id="ior" type="range" min="1" max={MAX_IOR} step="0.01" value={ior} onChange={e => setIor(clampIor(+e.target.value))} />
                <input type="number" min="1" max={MAX_IOR} step="0.01" value={ior} aria-label="IOR value" onChange={e => { const v = parseFloat(e.target.value); if (isFinite(v)) setIor(clampIor(v)); }} /></div>
              <div className="sim-row"><label htmlFor="dist">Text distance</label>
                <input id="dist" type="range" min="0.02" max="3" step="0.01" value={dist} onChange={e => setDist(+e.target.value)} />
                <input type="number" min="0" max="10" step="0.01" value={dist} aria-label="Distance value" onChange={e => { const v = parseFloat(e.target.value); if (isFinite(v)) setDist(Math.max(0, v)); }} /></div>
            </div>
          </div>
          <div className="demo-visual">
            <RefractionSim n={ior} d={dist} retune={retune} />
          </div>
        </article>
      </section>
    </main>
  );
}
createRoot(document.getElementById('root')).render(<App />);
