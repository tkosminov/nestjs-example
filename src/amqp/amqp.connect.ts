import { Channel, connect } from 'amqplib';
import config from 'config';

const amqpSettings: IAmqpSettings = config.get('AMQP_SETTINGS');
const amqpUrl = `amqp://${amqpSettings.username}:${amqpSettings.password}@${amqpSettings.host}:${amqpSettings.port}/${amqpSettings.vhost}`;

export const amqpConnect = (): Promise<Channel> => {
  return new Promise(async (resolve, _reject) => {
    try {
      const connection = await connect(amqpUrl);

      const channel = await connection.createChannel();

      resolve(channel);
    } catch (error) {
      setTimeout(() => {
        resolve(amqpConnect());
      }, amqpSettings.reconnectDelay);
    }
  });
};
