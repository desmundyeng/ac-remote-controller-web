import IzoneApi from "../IzoneApi.ts";
import React, {useEffect, useState} from "react";
import SectionContainer from "./SectionContainer.tsx";
import {EventType, PowerStatus, ResponseValue} from "../Enum.ts";
import eventBus from "../EventBus.ts";

const PowerStatusView: React.FC = () => {
    const title = "Power Status"

    const [isLoading, setIsLoading] = useState(false);
    const [currentValue, setCurrentValue] = useState<PowerStatus | null>(null);
    const [errorResponse, setErrorResponse] = useState('');

    const api = new IzoneApi();

    useEffect(() => {
        const handleValueChange = (status: PowerStatus | null) => {
            setCurrentValue(status);
        };
        eventBus.on(EventType.PowerStatusChange, handleValueChange);
        return () => {
            eventBus.off(EventType.PowerStatusChange, handleValueChange);
        };
    }, []);


    const handlePowerStatusOnOff = async (value: PowerStatus) => {
        try {
            const data = await api.controlSystemOnOff(value);
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
        {Object.values(PowerStatus)
            .filter(value => typeof value === 'number')
            .map((value) => (
                <button
                    key={value}
                    onClick={() => {
                        setIsLoading(true);
                        handlePowerStatusOnOff(value).then(() => {
                                setIsLoading(false);
                            }
                        )
                    }}
                    disabled={currentValue === value}>
                    {PowerStatus[value]}
                </button>
            ))}
    </SectionContainer>
};

export default PowerStatusView;
