import {FanSpeed, Mode, PowerStatus} from "./Enum.ts";

export interface ACStatusRequest {
    iZoneV2Request: {
        Type: number;
        No: number;
        No1: number;
    };
}

export interface PowerStatusRequest {
    SysOn: PowerStatus;
}

export interface FanSpeedRequest {
    SysFan: FanSpeed;
}

export interface ModeRequest {
    SysMode: Mode;
}

export interface SetPointRequest {
    SysSetpoint: number;
}
