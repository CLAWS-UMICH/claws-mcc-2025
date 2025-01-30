import { useState } from 'react';
import '../../styles/DCU.css';


function Dcu({ suitData }) {

    const [batt, setBatt] = useState('UMB');
    const [oxy, setOxy] = useState('PRI');
    const [comm, setComm] = useState('A');
    const [fan, setFan] = useState('PRI');
    const [pump, setPump] = useState('OPEN');
    const [co2, setCo2] = useState('A');

    return (
        <>
            <span>
                DCU
            </span>
            
            <div className="panel dcu-panel panel-header-padding">
                <div className="dcu-container">
                    {/* Left Section */}
                    <div className="dcu-left">
                    <div className="dcu-row">
                        <span className="dcu-label">Batt</span>
                        <div className="dcu-switch-group">
                        <button
                            className={`toggle-switch ${batt === 'UMB' ? 'active' : ''}`}
                            onClick={() => setBatt('UMB')}
                        >
                            UMB
                        </button>
                        <button
                            className={`toggle-switch ${batt === 'Local' ? 'active' : ''}`}
                            onClick={() => setBatt('Local')}
                        >
                            Local
                        </button>
                        </div>
                    </div>
                    <div className="dcu-row">
                        <span className="dcu-label">Oxy</span>
                        <div className="dcu-switch-group">
                        <button
                            className={`toggle-switch ${oxy === 'PRI' ? 'active' : ''}`}
                            onClick={() => setOxy('PRI')}
                        >
                            PRI
                        </button>
                        <button
                            className={`toggle-switch ${oxy === 'SEC' ? 'active' : ''}`}
                            onClick={() => setOxy('SEC')}
                        >
                            SEC
                        </button>
                        </div>
                    </div>
                    <div className="dcu-row">
                        <span className="dcu-label">Comm</span>
                        <div className="dcu-switch-group">
                        <button
                            className={`toggle-switch ${comm === 'A' ? 'active' : ''}`}
                            onClick={() => setComm('A')}
                        >
                            A
                        </button>
                        <button
                            className={`toggle-switch ${comm === 'B' ? 'active' : ''}`}
                            onClick={() => setComm('B')}
                        >
                            B
                        </button>
                        </div>
                    </div>
                    </div>

                    {/* Vertical Separator */}
                    <div className="vertical-separator"></div>

                    {/* Right Section */}
                    <div className="dcu-right">
                    <div className="dcu-row">
                        <span className="dcu-label">Fan</span>
                        <div className="dcu-switch-group">
                        <button
                            className={`toggle-switch ${fan === 'PRI' ? 'active' : ''}`}
                            onClick={() => setFan('PRI')}
                        >
                            PRI
                        </button>
                        <button
                            className={`toggle-switch ${fan === 'SEC' ? 'active' : ''}`}
                            onClick={() => setFan('SEC')}
                        >
                            SEC
                        </button>
                        </div>
                    </div>
                    <div className="dcu-row">
                        <span className="dcu-label">Pump</span>
                        <div className="dcu-switch-group">
                        <button
                            className={`toggle-switch ${pump === 'OPEN' ? 'active' : ''}`}
                            onClick={() => setPump('OPEN')}
                        >
                            OPEN
                        </button>
                        <button
                            className={`toggle-switch ${pump === 'CLOSE' ? 'active' : ''}`}
                            onClick={() => setPump('CLOSE')}
                        >
                            CLOSE
                        </button>
                        </div>
                    </div>
                    <div className="dcu-row">
                        <span className="dcu-label">CO2</span>
                        <div className="dcu-switch-group">
                        <button
                            className={`toggle-switch ${co2 === 'A' ? 'active' : ''}`}
                            onClick={() => setCo2('A')}
                        >
                            A
                        </button>
                        <button
                            className={`toggle-switch ${co2 === 'B' ? 'active' : ''}`}
                            onClick={() => setCo2('B')}
                        >
                            B
                        </button>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dcu;