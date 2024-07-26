export enum ResponseValue {
    OK = "{OK}",
    ERROR = "{ERROR}"
}

export enum PowerStatus {
    Off = 0, On = 1
}

export enum Mode {
    Cool = 1,
    Heat = 2,
    Vent = 3,
    Dry = 4
}

export enum FanSpeed {
    Low = 1,
    Medium = 2,
    High = 3,
    Auto = 4
}

export enum TemperaturePoint {
    Min = 15, Max = 30
}

export enum EventType {
    PowerStatusChange = "powerStatusChange",
    FanSpeedChange = "fanSpeedChange",
    ModeChange = "modeChange",
    TemperaturePointChange = "temperaturePointChange"
}
