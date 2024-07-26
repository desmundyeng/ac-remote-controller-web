import IzoneApi from "../IzoneApi.ts";
import React, {useEffect, useState} from "react";
import SectionContainer from "./SectionContainer.tsx";
import {EventType, FanSpeed, ResponseValue} from "../Enum.ts";
import eventBus from "../EventBus.ts";

const FanSpeedView: React.FC = () => {
    const title = "Fan Speed"

    const [isLoading, setIsLoading] = useState(false);
    const [currentValue, setCurrentValue] = useState<FanSpeed | null>(null);
    const [errorResponse, setErrorResponse] = useState('');

    const api = new IzoneApi();

    useEffect(() => {
        const handleValueChange = (value: FanSpeed | null) => {
            setCurrentValue(value);
        };
        eventBus.on(EventType.FanSpeedChange, handleValueChange);
        return () => {
            eventBus.off(EventType.FanSpeedChange, handleValueChange);
        };
    }, []);


    const handeFanSpeedChange = async (value: FanSpeed) => {
        try {
            const data = await api.setFanSpeed(value);
            if (data === ResponseValue.OK) {
                setCurrentValue(value);
            } else {
                setErrorResponse(`Set ${title} Error: ${data}`);
            }
        } catch (error) {
            setErrorResponse(JSON.stringify(error, null, 2));
        }
    };

    return <SectionContainer title={title} isLoading={isLoading} errorResponse={errorResponse}>
        {Object.values(FanSpeed)
            .filter(value => typeof value === 'number')
            .map((value) => (
                <button
                    key={value}
                    onClick={() => {
                        setIsLoading(true);
                        handeFanSpeedChange(value).then(() => {
                                setIsLoading(false);
                            }
                        )
                    }}
                    disabled={currentValue === value}>
                    {FanSpeed[value]}
                </button>
            ))}
    </SectionContainer>
};

export default FanSpeedView;
