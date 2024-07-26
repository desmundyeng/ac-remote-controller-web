import IzoneApi from "../IzoneApi.ts";
import React, {useEffect, useState} from "react";
import SectionContainer from "./SectionContainer.tsx";
import {EventType, Mode, ResponseValue} from "../Enum.ts";
import eventBus from "../EventBus.ts";

const PowerStatusView: React.FC = () => {
    const title = "Mode"

    const [isLoading, setIsLoading] = useState(false);
    const [currentValue, setCurrentValue] = useState<Mode | null>(null);
    const [errorResponse, setErrorResponse] = useState('');

    const api = new IzoneApi();

    useEffect(() => {
        const handleValueChange = (value: Mode | null) => {
            setCurrentValue(value);
        };
        eventBus.on(EventType.ModeChange, handleValueChange);
        return () => {
            eventBus.off(EventType.ModeChange, handleValueChange);
        };
    }, []);


    const handleSetMode = async (value: Mode) => {
        try {
            const data = await api.setMode(value);
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
        {Object.values(Mode)
            .filter(value => typeof value === 'number')
            .map((value) => (
                <button
                    key={value}
                    onClick={() => {
                        setIsLoading(true);
                        handleSetMode(value).then(() => {
                                setIsLoading(false);
                            }
                        )
                    }}
                    disabled={currentValue === value}>
                    {Mode[value]}
                </button>
            ))}
    </SectionContainer>
};

export default PowerStatusView;
