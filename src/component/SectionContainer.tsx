import React, {ReactNode} from "react";
import {CircularProgress} from "@mui/material";

type SectionContainerProps = {
    title: string;
    isLoading: boolean;
    errorResponse: string;
    children: ReactNode;
};

const SectionContainer: React.FC<SectionContainerProps> = ({title, isLoading, errorResponse, children}) => {

    return (
        <div className="section-container">
            <div className="title-container">
                <h3>{title}</h3>
                {isLoading && <CircularProgress size="24px"/>}
            </div>
            {errorResponse && !isLoading && <h5 style={{color: 'red'}}>{errorResponse}</h5>}
            <div className="button-container">
                {children}
            </div>
        </div>
    );
};

export default SectionContainer;
