import {FanSpeed, Mode, PowerStatus, TemperaturePoint} from "./Enum.ts";
import {ACStatusRequest, FanSpeedRequest, ModeRequest, PowerStatusRequest, SetPointRequest} from "./Interface.ts";

/**
 * @class IzoneApi
 * @description This class provides API singleton with methods to interact with the Izone API via reverse proxy.
 */
class IzoneApi {
    private static instance: IzoneApi;
    private baseURL: string = import.meta.env.VITE_API_URL;
    private reverseProxyUrl: string = 'https://cors-anywhere.herokuapp.com/' + this.baseURL;

    constructor() {
    }

    public static getInstance(): IzoneApi {
        if (!IzoneApi.instance) {
            IzoneApi.instance = new IzoneApi();

            if (IzoneApi.instance.baseURL === '') {
                throw new Error('API_URL environment variable is not set');
            }
        }
        return IzoneApi.instance;
    }

    private async post(endpoint: string, body: any, responseType: string): Promise<any> {
        try {
            const response = await fetch(`${this.reverseProxyUrl}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            if (responseType === "text/plain") {
                return await response.text();
            } else if (responseType === "application/json") {
                return await response.json();
            }
        } catch (error) {
            console.error('Error making POST request:', error);
            throw error;
        }
    }

    async getACStatus(): Promise<any> {
        const body: ACStatusRequest = {
            "iZoneV2Request": {
                Type: 1,
                No: 0,
                No1: 0
            }
        };
        return await this.post('/testsimplelocalcocb', body, "application/json");
    }

    async controlSystemOnOff(powerStatus: PowerStatus): Promise<any> {
        const body: PowerStatusRequest = {
            SysOn: powerStatus
        };
        return await this.post('/testsimplelocalcocb', body, "text/plain");
    }

    async setFanSpeed(speed: FanSpeed): Promise<any> {
        const body: FanSpeedRequest = {
            SysFan: speed
        };
        return await this.post('/testsimplelocalcocb', body, "text/plain");
    }

    async setMode(mode: Mode): Promise<any> {
        const body: ModeRequest = {
            SysMode: mode
        };
        return await this.post('/testsimplelocalcocb', body, "text/plain");
    }

    async setTemperaturePoint(temperaturePoint: TemperaturePoint): Promise<any> {
        const body: SetPointRequest = {
            SysSetpoint: temperaturePoint * 100 // API requirement
        };
        return await this.post('/testsimplelocalcocb', body, "text/plain");
    }
}

export default IzoneApi;
