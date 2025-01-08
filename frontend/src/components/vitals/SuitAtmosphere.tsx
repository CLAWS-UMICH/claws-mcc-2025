import '../../styles/SuitAtmosphere.css';
import Dcu from './DCU';
import SuitTemperature from './SuitTemperature';
import PersonalData from './PersonalData';
import SuitPressure from './SuitPressure';

const SuitAtmosphere = ({ suitData }) => {
    if (!suitData) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <span>Suit Atmosphere</span>
            <div className="larger-panel">
                {/* Personal Data Panel */}
                <PersonalData suitData={suitData} />

                {/* Suit Pressure Panel */}
                <SuitPressure suitData={suitData} />
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
        </>
    );
};

export default SuitAtmosphere;