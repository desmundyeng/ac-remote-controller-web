import IzoneApi from "../IzoneApi.ts";
import React, {useEffect, useState} from "react";
import SectionContainer from "./SectionContainer.tsx";
import {EventType, ResponseValue, TemperaturePoint} from "../Enum.ts";
import eventBus from "../EventBus.ts";

const TemperatureView: React.FC = () => {
    const title = "Temperature"

    const [isLoading, setIsLoading] = useState(false);
    const [currentValue, setCurrentValue] = useState<number>(TemperaturePoint.Min);
    const [errorResponse, setErrorResponse] = useState('');

    const api = new IzoneApi();

    useEffect(() => {
        const handleValueChange = (value: number) => {
            setCurrentValue(value);
        };
        eventBus.on(EventType.TemperaturePointChange, handleValueChange);
        return () => {
            eventBus.off(EventType.TemperaturePointChange, handleValueChange);
        };
    }, []);

    const onChangeTemperaturePoint = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        if (value >= 15 && value <= 30) {
            setCurrentValue(value);
            setErrorResponse('');
        } else {
            setErrorResponse('Value must be between 15 and 30');
        }
    };

    const handleSetPoint = async () => {
        try {
            const data = await api.setTemperaturePoint(currentValue);
            if (data === ResponseValue.OK) {
                setCurrentValue(currentValue);
            } else {
                setErrorResponse(`Set ${title} Error: ${data}`);
            }
        } catch (error) {
            setErrorResponse(JSON.stringify(error, null, 2));
        }
    };

    return <SectionContainer title={title} isLoading={isLoading} errorResponse={errorResponse}>
        <input
            type="number"
            value={currentValue}
            onChange={onChangeTemperaturePoint}
            min={15}
            max={30}
            step={1}
        />
        <button onClick={() => {
            setIsLoading(true);
            handleSetPoint().then(() => {
                    setIsLoading(false);
                }
            )
        }}
        >Set Temperature Point
        </button>
    </SectionContainer>
};

export default TemperatureView;
