// SuitCO2ScrubberStorage.tsx
function SuitCO2ScrubberStorage({ scrubberA, scrubberB }) {
  return (
    <div className="co2-scrubber-storage">
      <div className="box-header large-text">
        <span>Suit CO₂ Scrubber Storage</span>
      </div>

      <div className="storage-content">
        <ScrubberDisplay label="Scrubber A" value={scrubberA} />
        <div className="separator"></div>
        <ScrubberDisplay label="Scrubber B" value={scrubberB} />
      </div>
    </div>
  );
}

function ScrubberDisplay({ label, value }) {
  return (
    <div className="storage-item">
      <span className="storage-label small-text">{label}</span>

      {/* direct PSI read‑out, mirrors Oxygen Pressure styling */}
      <div className="pressure-display">
        <div className="pressure-value-direct">{Math.round(value)}</div>
        <div className="pressure-unit-direct">PSI</div>
      </div>
    </div>
  );
}

export default SuitCO2ScrubberStorage;
