import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';
import { FCMData, IFCMService } from "../types/fcm";
import createError from 'http-errors';
import httpStatus from 'http-status-codes';
import admin from "firebase-admin";
import { getMessaging } from "firebase-admin/messaging";
import fcmServiceAccount from "../../fcm.json";
import { Inject, Service } from 'typedi';
import AppEvents from '../subcribers/event';
import { Logger } from 'winston';

@Service()
export class FCMService implements IFCMService {
    constructor(
        @Inject('logger') private logger: Logger,
        @EventDispatcher()
        private eventDispatcher: EventDispatcherInterface
    ) {
        admin.initializeApp({
            credential: admin.credential.cert(JSON.parse(JSON.stringify(fcmServiceAccount))),
            databaseURL: "https://fir-db-3b9ba-default-rtdb.firebaseio.com"
        });
    }

    public async sendNotification(notificationData: FCMData) {
        try {
            const message = {
                data: {
                    title: notificationData.title,
                    body: notificationData.body,
                    whatsappUrl: `https://wa.me/${notificationData.whatsappNumber}`,
                    phoneNumber: notificationData.phoneNumber,
                },
                token: notificationData.token,
            };
            const response = await getMessaging().send(message);
            this.logger.debug('Successfully sent notification:', message);
            // Dispatch event and log success
            this.eventDispatcher.dispatch(AppEvents.user.sendNotification, message);

            return `Successfully sent notification: ${response}`;
        } catch (error) {
            this.logger.error(`Failed to send notification: ${error}`);
            throw createError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to send notification');
        }
    }

}