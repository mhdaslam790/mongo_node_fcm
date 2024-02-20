import { IsString } from "class-validator";

export interface FCMData {
    token: string;
    phoneNumber: string;
    whatsappNumber: string;
    title: string;
    body: string;
    leadId: string;

}

export interface IFCMService {
    sendNotification: (notificationData: FCMData) => Promise<any>;
}

export class FCMDataDto {
    @IsString()
    token: string;
    @IsString()
    phoneNumber: string;
    @IsString()
    whatsappNumber: string;
    @IsString()
    title: string;
    @IsString()
    body: string;
    @IsString()
    leadId: string;
}