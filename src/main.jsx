
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import RefractionSim, { MAX_IOR } from './RefractionSim.jsx';
import './styles.css';


const Arrow = () => (
  <span className="arrow" aria-hidden="true">↗</span>
);

const sources = {
  glasses: 'https://www.lens.com/questions-answered/what-percentage-of-the-population-wears-glasses/',
  replacement: 'https://www.warbyparker.com/learn/how-often-should-you-get-new-glasses',
  price: 'https://www.glasses.com/gl-us/blog/how-much-do-glasses-cost',
  myopia: 'https://my.clevelandclinic.org/health/diseases/8579-myopia-nearsightedness',
  eye: 'https://www.nei.nih.gov/eye-health-information/healthy-vision/how-eyes-work',
};

function LensVisual({ mode, prescription = -2, voltage = 50 }) {
  const power = Math.abs(prescription);
  const isMyopic = mode === 'Far';
  const focusX = isMyopic
    ? 69 + Math.min(power, 6) * 8
    : 170;
  const y = 90;
  const spread = 24;

  return (
    <div className={`lens-scene ${mode === 'Near' ? 'near' : ''}`}>
      <svg
        className="optical-svg"
        viewBox="0 0 340 180"
        role="img"
        aria-label={
          isMyopic
            ? `Illustration of myopic focus with a minus ${power.toFixed(2)} diopter lens`
            : 'Illustration of near focus'
        }
      >
        <defs>
          <linearGradient id="lensGradient" x1="0" x2="1">
            <stop offset="0%" stopColor="#6dd8ff" stopOpacity=".2" />
            <stop offset="50%" stopColor="#b8f3ff" stopOpacity=".8" />
            <stop offset="100%" stopColor="#6dd8ff" stopOpacity=".2" />
          </linearGradient>
        </defs>

        {[0, 1, 2].map((i) => {
          const startY = y + (i - 1) * spread;
          const endY = isMyopic
            ? y + (i - 1) * spread * 0.2
            : y + (i - 1) * spread;

          return (
            <g key={i}>
              <line
                x1="10"
                y1={startY}
                x2="115"
                y2={startY}
                stroke="#80ddff"
                strokeWidth="1.6"
                opacity=".85"
              />
              <line
                x1="135"
                y1={startY}
                x2={focusX}
                y2={endY}
                stroke="#80ddff"
                strokeWidth="1.6"
                opacity=".9"
              />
              <line
                x1={focusX}
                y1={endY}
                x2="325"
                y2={y + (i - 1) * 31}
                stroke="#80ddff"
                strokeWidth="1.3"
                strokeDasharray="4 5"
                opacity=".55"
              />
            </g>
          );
        })}

        <path
          d="M 125 52 Q 145 90 125 128 Q 145 90 125 52"
          fill="url(#lensGradient)"
          stroke="#9be9ff"
          strokeWidth="1.5"
        />

        <line
          x1="300"
          y1="30"
          x2="300"
          y2="150"
          stroke="#c9d9e8"
          strokeDasharray="3 5"
          opacity=".6"
        />

        <circle
          cx={focusX}
          cy={y}
          r="5"
          fill="#d8fbff"
          filter="drop-shadow(0 0 6px #80ddff)"
        />

        <text x="15" y="18" fill="#a9c3d7" fontSize="9">
          INCOMING LIGHT
        </text>
        <text x="300" y="164" textAnchor="middle" fill="#a9c3d7" fontSize="9">
          RETINA
        </text>
      </svg>

      <div className="visual-legend">
        <span><i className="legend-dot" /> Light rays</span>
        <span><i className="legend-dot focus-dot" /> Focus point</span>
      </div>
    </div>
  );
}

function EyePath() {
  const steps = [
    ['01', 'Cornea', 'Bends incoming light and provides much of the eye’s focusing power.'],
    ['02', 'Pupil & iris', 'The iris regulates how much light enters through the pupil.'],
    ['03', 'Eye lens', 'Adjusts focus to help form a sharp image.'],
    ['04', 'Retina', 'Photoreceptors convert light into electrical signals.'],
    ['05', 'Optic nerve', 'Carries visual information to the brain.'],
  ];

  return (
    <div className="eye-path">
      {steps.map(([number, title, description]) => (
        <article className="eye-step" key={number}>
          <span className="step-number">{number}</span>
          <div>
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}


function VisionOutput({ mode, prescription, voltage }) {
  // Illustrative model: assume the eye has -2.00 D of myopia.
  // The selected lens power is compared with that assumed correction.
  const assumedMyopia = -2;
  const lensMismatch = Math.abs(prescription - assumedMyopia);

  // Near mode changes the target distance, but does not model
  // the eye's actual accommodation or an individual's physiology.
  const blur = Math.min(
    5,
    lensMismatch * 1.1 +
      (mode === 'Near' ? 0.35 : 0) +
      (voltage < 10 ? 0.15 : 0)
  );

  const clarity = Math.round(100 * (1 - blur / 5));
  const targetDistance = mode === 'Far' ? '6 m' : '40 cm';

  return (
    <aside className="vision-output" aria-live="polite">
      <div className="panel-heading">
        <span>03 / VISION OUTPUT</span>
        <span className="live-indicator">LIVE PREVIEW</span>
      </div>

      <div className="vision-target">
        <div
          className="vision-target-content"
          style={{
            filter: `blur(${blur}px)`,
            opacity: 1 - blur * 0.07,
          }}
        >
          <div className="target-symbol">L</div>
          <div className="target-lines">
            <span />
            <span />
            <span />
          </div>
          <strong>{mode === 'Far' ? 'DISTANT TARGET' : 'NEAR TARGET'}</strong>
        </div>

        <span className="target-distance">{targetDistance}</span>
      </div>

      <div className="clarity-heading">
        <span>Illustrative clarity</span>
        <strong>{clarity}%</strong>
      </div>

      <div
        className="clarity-track"
        role="progressbar"
        aria-label="Illustrative clarity"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clarity}
      >
        <span style={{ width: `${clarity}%` }} />
      </div>

      <div className="vision-metrics">
        <div>
          <span>Lens power</span>
          <strong>{prescription.toFixed(2)} D</strong>
        </div>
        <div>
          <span>Driver level</span>
          <strong>{voltage}%</strong>
        </div>
        <div>
          <span>Target</span>
          <strong>{mode === 'Far' ? 'Distant' : 'Nearby'}</strong>
        </div>
      </div>

      <p className="vision-explanation">
        {mode === 'Far'
          ? 'Far mode uses a distant target. For this example, -2.00 D is the assumed ideal corrective power.'
          : 'Near mode moves the target to 40 cm. Real near vision also depends on accommodation, which this simplified preview does not calculate.'}
      </p>

      <p className="vision-disclaimer">
        Conceptual blur visualization only. The clarity percentage is a
        display metric, not a measured visual acuity score.
      </p>
    </aside>
  );
}

function App() {
  const [mode, setMode] = useState('Far');
  const [prescription, setPrescription] = useState(-2);
  const [voltage, setVoltage] = useState(50);
  const [locked, setLocked] = useState(true);

  // Separate material-refraction model; these controls do not alter the
  // illustrative prescription/vision preview above.
  const [ior, setIor] = useState(1.5);
  const [distance, setDistance] = useState(0.9);
  const [retune, setRetune] = useState(false);

  const farPoint = 1 / Math.abs(prescription);
  const conventionalLow = 200;
  const conventionalHigh = 600;
  const lcEstimate = 275;
  const yearlyBattery = 7.5 / 4;

  return (
    <main>
      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />
      <div className="grain" />

      <nav className="nav shell">
        <a className="brand" href="#top">LUCID</a>
        <div className="nav-links">
          <a href="#science">How The Eye Works</a>
          <a href="#simulator">Simulation</a>
          <a href="#cost">Cost Model</a>
        </div>
      </nav>

      <section className="hero shell" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span /> OPTICS, REIMAGINED</div>
          <h1>Focus on a<br /><em>different future.</em></h1>
          <p className="lead">
            What if your glasses could adapt to your vision instead of
            requiring a new prescription lens every time it changed?
            Lucid Lenses explores electrically tunable liquid-crystal optics
            as a possible path forward.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#simulator">
              Explore the simulation <Arrow />
            </a>
            <a className="text-link" href="#science">Understand the eye ↓</a>
          </div>
          <p className="disclaimer">
            Research concept · Not a medical device or validated prescription system
          </p>
        </div>

        <div className="hero-visual">
          <div className="lens-card glass-panel">
            <div className="card-topline">
              <span>OPTICAL STUDY / 001</span>
              <span className="live-indicator">CONCEPT</span>
            </div>
            <div className="hero-lens">
              <LensVisual mode={mode} prescription={prescription} />
            </div>
            <div className="lens-card-bottom">
              <div>
                <span className="muted-label">CURRENT MODE</span>
                <strong>{mode} vision</strong>
              </div>
              <div>
                <span className="muted-label">ILLUSTRATIVE POWER</span>
                <strong>{prescription.toFixed(2)} D</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="stats shell" aria-label="Vision and eyewear context">
        <article>
          <span className="stat-index">01 / ACCESS</span>
          <strong>~64%</strong>
          <h3>of U.S. adults</h3>
          <p>are reported to wear glasses. Estimates vary by study and definition.</p>
          <a href={sources.glasses} target="_blank" rel="noreferrer">Read source <Arrow /></a>
        </article>
        <article>
          <span className="stat-index">02 / REPLACEMENT</span>
          <strong>1–2 years</strong>
          <h3>A common replacement interval</h3>
          <p>Many factors such as change in prescription, wear, etc, affect timing.</p>
          <a href={sources.replacement} target="_blank" rel="noreferrer">Read source <Arrow /></a>
        </article>
        <article>
          <span className="stat-index">03 / COST</span>
          <strong>$200–600</strong>
          <h3>Illustrative glasses cost</h3>
          <p>Prices vary with frames, lenses, coatings, insurance, and retailer.</p>
          <a href={sources.price} target="_blank" rel="noreferrer">Read source <Arrow /></a>
        </article>
      </section>

      <section className="section shell" id="science">
        <div className="section-heading">
          <span className="eyebrow"><span /> THE OPTICS</span>
          <h2>Where the world<br />comes into focus.</h2>
          <p>
            Vision depends on light being focused onto the retina. Myopia,
            or nearsightedness, usually occurs when the eye is too long
            relative to its focusing power. Distant objects appear blurry.
          </p>
          <a className="text-link" href={sources.myopia} target="_blank" rel="noreferrer">
            Explore myopia <Arrow />
          </a>
        </div>

        <div className="science-panel glass-panel">
          <div className="panel-heading">
            <span>THE VISUAL SYSTEM</span>
            <span>01 — 05</span>
          </div>
          <EyePath />
          <a className="source-link" href={sources.eye} target="_blank" rel="noreferrer">
            Source: National Eye Institute <Arrow />
          </a>
        </div>
      </section>

      <section className="simulator-section" id="simulator">
        <div className="shell">
          <div className="section-heading centered">
            <span className="eyebrow"><span /> INTERACTIVE OPTICS LAB</span>
            <h2>Change the power.<br /><em>Explore the focus.</em></h2>
            <p>
              Adjust a conceptual negative lens power and explore how an
              electrically tunable lens might be controlled. Values are
              illustrative; voltage does not map universally to diopters.
            </p>
          </div>

          <div className="simulator glass-panel">
            <div className="sim-controls">
              <div className="panel-heading">
                <span>01 / LENS CONTROLS</span>
                <span className="live-indicator">INTERACTIVE</span>
              </div>

              <label className="field-label" htmlFor="mode">
                Viewing scenario
              </label>
              <div className="mode-switch" role="group" aria-label="Viewing scenario">
                {['Far', 'Near'].map((item) => (
                  <button
                    key={item}
                    className={mode === item ? 'selected' : ''}
                    onClick={() => setMode(item)}
                    aria-pressed={mode === item}
                  >
                    {item === 'Near' ? '◎' : '◌'} {item} vision
                  </button>
                ))}
              </div>

              <div className="control-heading">
                <label className="field-label" htmlFor="power">
                  Illustrative lens power
                </label>
                <output htmlFor="power">{prescription.toFixed(2)} D</output>
              </div>
              <input
                id="power"
                type="range"
                min="-6"
                max="-0.5"
                step="0.25"
                value={prescription}
                onChange={(event) => {
                  setPrescription(Number(event.target.value));
                  if (!locked) {
                    setVoltage(
                      Math.round(
                        ((Math.abs(Number(event.target.value)) - 0.5) / 5.5) * 100
                      )
                    );
                  }
                }}
              />
              <div className="range-labels"><span>−6.00 D</span><span>−0.50 D</span></div>

              <div className="control-heading">
                <label className="field-label" htmlFor="voltage">
                  Conceptual driver level
                </label>
                <output htmlFor="voltage">{voltage}%</output>
              </div>
              <input
                id="voltage"
                type="range"
                min="0"
                max="100"
                step="1"
                value={voltage}
                disabled={locked}
                onChange={(event) => setVoltage(Number(event.target.value))}
              />
              <div className="range-labels"><span>Low</span><span>High</span></div>

              <button
                className={`lock-button ${locked ? 'is-locked' : ''}`}
                onClick={() => setLocked(!locked)}
                aria-pressed={locked}
              >
                <span>{locked ? '▣' : '□'}</span>
                {locked ? 'Control locked — unlock to adjust driver' : 'Control unlocked'}
              </button>

              <div className="measurement">
                <span className="muted-label">IDEALIZED FAR POINT</span>
                <strong>{farPoint.toFixed(2)} m</strong>
                <p>
                  For a simplified myopic-eye model, far-point distance is
                  approximately the reciprocal of the magnitude of the
                  refractive error. This is not a prescription measurement.
                </p>
              </div>
            </div>

            <div className="sim-display">
  <div className="display-header">
    <span>02 / OPTICAL RESPONSE</span>
    <span>SCHEMATIC · NOT TO SCALE</span>
  </div>

  <div className="diagram-output-grid">
    <div className="diagram-column">
      <div className="diagram-heading">RAY DIAGRAM</div>

      <LensVisual
        mode={mode}
        prescription={prescription}
        voltage={voltage}
      />

            <div className="formula-card">
              <span className="muted-label">LENS POWER</span>
              <code>P = 1 / f</code>
              <p>Power in diopters; focal length in meters.</p>
            </div>
            </div>
              <VisionOutput
                mode={mode}
                prescription={prescription}
                voltage={voltage}
              />
            </div>
          </div>
          </div>
          <p className="safety-note">
            This diagram is a learning aid. It does not calculate an actual
            eye's retinal focus or determine a suitable prescription.
          </p>

          <article className="refraction-lab glass-panel" aria-labelledby="refraction-title">
            <div className="refraction-intro">
              <span className="eyebrow"><span /> MATERIAL MODEL</span>
              <h3 id="refraction-title">Refraction under different conditions</h3>
              <p>Explore a separate optical rendering by changing the refractive index and target distance. These controls are independent of the illustrative prescription model above.</p>
            </div>
            <div className="refraction-controls">
              <div className="refraction-control">
                <div className="control-heading">
                  <label className="field-label" htmlFor="refraction-ior">Index of refraction</label>
                  <output htmlFor="refraction-ior">{ior.toFixed(2)}</output>
                </div>
                <input id="refraction-ior" type="range" min="1" max={MAX_IOR} step="0.01" value={ior} onChange={(event) => setIor(Math.min(MAX_IOR, Math.max(1, Number(event.target.value))))} />
                <div className="range-labels"><span>1.00</span><span>{MAX_IOR.toFixed(2)}</span></div>
              </div>
              <div className="refraction-control">
                <div className="control-heading">
                  <label className="field-label" htmlFor="refraction-distance">Target distance</label>
                  <output htmlFor="refraction-distance">{distance.toFixed(2)}</output>
                </div>
                <input id="refraction-distance" type="range" min="0.02" max="3" step="0.01" value={distance} onChange={(event) => setDistance(Number(event.target.value))} />
                <div className="range-labels"><span>Near</span><span>Far</span></div>
              </div>
              <label className="refraction-toggle">
                <input type="checkbox" checked={retune} onChange={(event) => setRetune(event.target.checked)} />
                <span>Retune hyperbolic profile using the selected index</span>
              </label>
            </div>
            <div className="refraction-canvas-wrap">
              <RefractionSim n={ior} d={distance} retune={retune} />
            </div>
            <p className="fine-print">Schematic rendering only. The result depends on the component’s simplified shader model and is not a validated optical design or prescription tool.</p>
          </article>
        </div>
      </section>

      <section className="section shell" id="technology">
        <div className="section-heading">
          <span className="eyebrow"><span /> HOW IT COULD WORK</span>
          <h2>A lens that changes<br />without changing shape.</h2>
          <p>
            Conventional lenses use their physical geometry and refractive
            index to bend light. Liquid-crystal systems can alter their
            effective optical behavior when an electric field changes
            molecular alignment.
          </p>
        </div>

        <div className="technology-grid">
          <article className="tech-card glass-panel">
            <span className="card-number">01 / MATERIALS</span>
            <div className="stack-visual" aria-label="Illustrative lens material layers">
              <div className="stack-layer layer-one">Transparent substrate</div>
              <div className="stack-layer layer-two">ITO electrode</div>
              <div className="stack-layer layer-three">Alignment layer</div>
              <div className="stack-layer layer-four">Liquid crystal</div>
              <div className="stack-layer layer-five">Alignment layer</div>
              <div className="stack-layer layer-two">ITO electrode</div>
              <div className="stack-layer layer-one">Transparent substrate</div>
            </div>
            <p>
              A possible stack includes transparent substrates, indium tin
              oxide electrodes, alignment layers, and a liquid-crystal cell.
              Practical designs need optical, electrical, and mechanical
              engineering.
            </p>
          </article>

          <article className="tech-card glass-panel">
            <span className="card-number">02 / CONTROL SYSTEM</span>
            <div className="control-flow">
              <div><span>01</span><strong>Scroll wheel</strong><small>User input</small></div>
              <Arrow />
              <div><span>02</span><strong>Microcontroller</strong><small>Control logic</small></div>
              <Arrow />
              <div><span>03</span><strong>LC driver</strong><small>Electrical signal</small></div>
              <Arrow />
              <div><span>04</span><strong>LC lens</strong><small>Optical response</small></div>
            </div>
            <p>
              A physical lock could prevent accidental changes. A real
              implementation would also require calibration, safe drive
              electronics, power management, and a way to verify optical
              output.
            </p>
          </article>
        </div>
      </section>

      <section className="cost-section" id="cost">
        <div className="shell">
          <div className="section-heading centered">
            <span className="eyebrow"><span /> ACCESS & ECONOMICS</span>
            <h2>Make the long-term<br /><em>cost visible.</em></h2>
            <p>
              The following is a comparison of your proposed product
              estimates with the conventional glasses price range. Actual
              savings depend on product cost, durability, repairs, and
              whether a user's prescription changes.
            </p>
          </div>

          <div className="cost-grid">
            <article className="cost-card glass-panel">
              <span className="card-number">CONVENTIONAL GLASSES</span>
              <strong className="cost-value">$200–600</strong>
              <p>Illustrative cost per pair</p>
              <div className="cost-rule" />
              <ul>
                <li>May require replacement when a prescription changes</li>
                <li>Frame and lens prices vary widely</li>
                <li>Insurance and discounts may reduce out-of-pocket cost</li>
              </ul>
              <a href={sources.price} target="_blank" rel="noreferrer">Pricing source <Arrow /></a>
            </article>

            <article className="cost-card featured-cost glass-panel">
              <span className="card-number">PROPOSED LUCID MODEL</span>
              <strong className="cost-value">$250–300</strong>
              <p>Estimated assembled retail model</p>
              <div className="cost-rule" />
              <ul>
                <li>Estimated raw materials: about $15 per lens</li>
                <li>Estimated lens production cost: about $40 per lens</li>
                <li>Estimated battery replacement: $5–10 every 3–4 years</li>
              </ul>
              <span className="estimate-tag">PROJECT ESTIMATES · NOT VERIFIED COSTS</span>
            </article>
          </div>

          <div className="lifecycle-panel glass-panel">
            <div>
              <span className="eyebrow"><span /> EXAMPLE COST MODEL</span>
              <h3>Compare costs over eight years.</h3>
              <p>
                Change the number of conventional pairs bought to explore
                the arithmetic. This does not predict real product savings.
              </p>
            </div>
            <LifecycleCalculator />
          </div>

          <p className="fine-print">
            Financial estimates are based on the supplied project brief,
            not independently verified manufacturing quotes. The proposed
            eight-year service life is a target, not a demonstrated result.
            Liquid-crystal lenses are not a substitute for an eye exam or
            a clinically prescribed corrective lens.
          </p>
        </div>
      </section>

      <footer className="footer shell">
        <a className="brand" href="#top">LUCID</a>
        
        <a href="#top">Back to top ↑</a>
      </footer>
    </main>
  );
}


function LifecycleCalculator() {
  const [pairs, setPairs] = useState(4);
  const [pairCost, setPairCost] = useState(400);

  const lucidCost = 275;
  const batteryCost = 15;
  const years = Array.from({ length: 9 }, (_, i) => i);

  const conventional = years.map((year) =>
    year === 8
      ? pairs * pairCost
      : Math.floor((year * pairs) / 8) * pairCost
  );

  const lucid = years.map((year) =>
    lucidCost + (year >= 4 ? batteryCost : 0)
  );

  const maxCost = Math.max(
    ...conventional,
    ...lucid,
    500
  );

  const chart = {
    left: 58,
    right: 570,
    top: 28,
    bottom: 230,
  };

  const x = (year) =>
    chart.left + (year / 8) * (chart.right - chart.left);

  const y = (cost) =>
    chart.bottom -
    (cost / (maxCost * 1.1)) * (chart.bottom - chart.top);

  const pathFor = (values) =>
    values
      .map(
        (value, index) =>
          `${index === 0 ? 'M' : 'L'} ${x(index)} ${y(value)}`
      )
      .join(' ');

  const formatMoney = (value) =>
    `$${Math.round(value).toLocaleString('en-US')}`;

  const conventionalTotal = pairs * pairCost;
  const lucidTotal = lucidCost + batteryCost;
  const difference = conventionalTotal - lucidTotal;

  return (
    <div className="lifecycle-calculator">
      <div className="chart-controls">
        <div>
          <div className="control-heading">
            <label htmlFor="pairs">Conventional pairs over 8 years</label>
            <output htmlFor="pairs">{pairs}</output>
          </div>
          <input
            id="pairs"
            type="range"
            min="1"
            max="8"
            step="1"
            value={pairs}
            onChange={(event) => setPairs(Number(event.target.value))}
          />
        </div>

        <div>
          <div className="control-heading">
            <label htmlFor="pair-cost">Cost per conventional pair</label>
            <output htmlFor="pair-cost">{formatMoney(pairCost)}</output>
          </div>
          <input
            id="pair-cost"
            type="range"
            min="200"
            max="600"
            step="50"
            value={pairCost}
            onChange={(event) => setPairCost(Number(event.target.value))}
          />
        </div>
      </div>

      <div className="cost-chart glass-panel">
        <div className="chart-header">
          <div>
            <span className="muted-label">TOTAL OWNERSHIP COST</span>
            <h4>Eight-year comparison</h4>
          </div>
          <span className="chart-unit">USD</span>
        </div>

        <div className="chart-legend">
          <span><i className="legend-conventional" /> Conventional glasses</span>
          <span><i className="legend-lucid" /> Lucid Lenses estimate</span>
        </div>

        <div className="chart-scroll">
          <svg
            className="cost-chart-svg"
            viewBox="0 0 600 285"
            role="img"
            aria-label="Line graph comparing cumulative conventional glasses costs and estimated Lucid Lenses costs over eight years"
          >
            {Array.from({ length: 5 }, (_, i) => {
              const value = (maxCost * 1.1 * i) / 4;
              const yy = y(value);

              return (
                <g key={i}>
                  <line
                    x1={chart.left}
                    y1={yy}
                    x2={chart.right}
                    y2={yy}
                    stroke="rgba(196,225,246,.12)"
                    strokeDasharray="3 5"
                  />
                  <text
                    x={chart.left - 10}
                    y={yy + 4}
                    textAnchor="end"
                    fill="#90a6ba"
                    fontSize="10"
                  >
                    {formatMoney(value)}
                  </text>
                </g>
              );
            })}

            {years.map((year) => (
              <g key={year}>
                <line
                  x1={x(year)}
                  y1={chart.top}
                  x2={x(year)}
                  y2={chart.bottom}
                  stroke="rgba(196,225,246,.05)"
                />
                <text
                  x={x(year)}
                  y={chart.bottom + 20}
                  textAnchor="middle"
                  fill="#90a6ba"
                  fontSize="10"
                >
                  {year}
                </text>
              </g>
            ))}

            <path
              d={pathFor(conventional)}
              fill="none"
              stroke="#42d8e3"
              strokeWidth="3"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            <path
              d={pathFor(lucid)}
              fill="none"
              stroke="#30dca2"
              strokeWidth="3"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {conventional.map((value, index) => (
              <circle
                key={`conventional-${index}`}
                cx={x(index)}
                cy={y(value)}
                r="3.5"
                fill="#42d8e3"
                stroke="#07111d"
                strokeWidth="1.5"
              />
            ))}

            {lucid.map((value, index) => (
              <circle
                key={`lucid-${index}`}
                cx={x(index)}
                cy={y(value)}
                r="3.5"
                fill="#30dca2"
                stroke="#07111d"
                strokeWidth="1.5"
              />
            ))}

            <text
              x={(chart.left + chart.right) / 2}
              y="277"
              textAnchor="middle"
              fill="#90a6ba"
              fontSize="10"
            >
              Years of ownership
            </text>
          </svg>
        </div>

        <div className="chart-summary">
          <div>
            <span>Conventional total</span>
            <strong>{formatMoney(conventionalTotal)}</strong>
          </div>
          <div>
            <span>Lucid estimate</span>
            <strong>{formatMoney(lucidTotal)}</strong>
          </div>
          <div>
            <span>{difference >= 0 ? 'Estimated difference' : 'Lucid costs more'}</span>
            <strong className={difference >= 0 ? 'saving-value' : ''}>
              {formatMoney(Math.abs(difference))}
            </strong>
          </div>
        </div>
      </div>

      <p className="fine-print">
        Model assumptions: Lucid costs $275 upfront plus $15 in battery
        costs over eight years. Conventional purchases are distributed
        across the eight-year period according to the selected pair count,
        with all selected pairs purchased by year eight. No repairs,
        maintenance, insurance, inflation, or replacement Lucid units are
        included. These are illustrative project estimates, not verified
        savings.
      </p>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);