// SuitCO2ScrubberStorage.tsx
function SuitCO2ScrubberStorage({ scrubberA, scrubberB }) {
  return (
    <div className="co2-scrubber-storage">
      <div className="box-header large-text">
        <span>Suit CO2 Scrubber Storage</span>
      </div>
      <div className="storage-content">
        <ScrubberDisplay label="Scrubber A" value={scrubberA} />
        <div className="separator"></div>
        <ScrubberDisplay label="Scrubber B" value={scrubberB} />
      </div>
    </div>
  );
}

function ScrubberDisplay({ label, value }) {
  return (
    <div className="storage-item small-text">
      <span className="storage-label">{label}</span>
      <ScrubberGauge value={value} />
    </div>
  );
}

function ScrubberGauge({ value }) {
  const remainingHeight = (10 * value/6) || 0;
  const usedHeight = 100 - remainingHeight;
  
  return (
    <div className="storage-gauge-container">
      <div className="gauge-bar">
        <div 
          className="scrubber-used" 
          style={{ height: `${usedHeight}%` }}
        />
        <div 
          className="scrubber-remaining" 
          style={{ height: `${remainingHeight}%` }}
        >
          <div className="striped-background" />
        </div>
      </div>
      <div className="measurement">
        <span>60</span>
        <span>0</span>
      </div>
      <span className="percentage">{value || 0}%</span>
    </div>
  );
}

export default SuitCO2ScrubberStorage;
