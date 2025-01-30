import '../../styles/SuitAtmosphere.css';
import Dcu from './DCU';
import SuitTemperature from './SuitTemperature';
import PersonalData from './PersonalData';
import SuitPressure from './SuitPressure';
import SuitHelmetFan from './suitHelmetFan';
import SuitCO2ScrubberStorage from './suitCO2ScrubberStorage';

const SuitAtmosphere = ({ suitData }) => {
    if (!suitData) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className='suit-atmosphere-panel'>
                <span>Suit Atmosphere</span>
                <div className="panel-1">
                    <div className="rounded-border">
                        {/* Personal Data Panel */}
                        <div className='personal-data'>
                            <PersonalData suitData={suitData} />
                        </div>

                        {/* Suit Pressure Panel */}
                        <div className='data-section'>
                            <SuitPressure suitData={suitData} />
                        </div>
                    </div>
                </div>
                <div className="temperature-dcu-container">
                <SuitHelmetFan fanPriRpm={suitData.fan_pri_rpm} fanSecRpm={suitData.fan_sec_rpm} />
                <SuitCO2ScrubberStorage scrubberA={suitData.scrubber_a_co2_storage} scrubberB={suitData.scrubber_b_co2_storage} />
                </div>
                <div className="temperature-dcu-container">
                    {/* Suit Temperature Panel */}
                    <div className="suit-temperature">
                        <SuitTemperature suitData={suitData} />
                    </div>

                    {/* DCU Panel */}
                    <div className="dcu">
                        <Dcu suitData={suitData} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default SuitAtmosphere;