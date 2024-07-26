import {useEffect, useState} from 'react'
import IzoneApi from "./IzoneApi.ts";
import {CircularProgress} from "@mui/material";
import PowerStatusView from "./component/PowerStatusView.tsx";
import {EventType, FanSpeed, Mode, PowerStatus} from "./Enum.ts";
import eventBus from "./EventBus.ts";
import FanSpeedView from "./component/FanSpeedView.tsx";
import ModeView from "./component/ModeView.tsx";
import TemperatureView from "./component/TemperatureView.tsx";

function App() {
    const izoneApi = IzoneApi.getInstance();

    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState('');
    const [errorResponse, setErrorResponse] = useState('');

    useEffect(() => {
        setIsLoading(true);
        setResponse("Retrieving AC status...")
        handleGetACStatus().then((data) => {
            eventBus.emit(EventType.PowerStatusChange, data.SysOn as PowerStatus);
            eventBus.emit(EventType.FanSpeedChange, data.SysFan as FanSpeed);
            eventBus.emit(EventType.ModeChange, data.SysMode as Mode);
            eventBus.emit(EventType.TemperaturePointChange, data.Setpoint / 100);
            setResponse("Retrieved AC status")
            setIsLoading(false);
        });
    }, []);

    const handleGetACStatus = async () => {
        try {
            return await izoneApi.getACStatus();
        } catch (error) {
            setErrorResponse(JSON.stringify(error, null, 2));
        }
    };

    return (
        <div className="App">
            <h2>AC Remote Control</h2>
            <div className="center-container">
                {response && <p>{response}</p>}
                {isLoading && <CircularProgress size="32px"/>}
                {errorResponse && !isLoading && <p style={{color: 'red'}}>{errorResponse}</p>}
            </div>

            <PowerStatusView/>
            <FanSpeedView/>
            <ModeView/>
            <TemperatureView/>
        </div>
    );
}

export default App
