import { FastifyPluginAsync } from 'fastify';
import MQConnection from "../mq/connect";
import { consumeMessages } from "../mq/operations";
import { generateHTML } from "../application/archive";

interface BookmarkMessage {
  id: string;
  url: string;
}

const mqPlugin: FastifyPluginAsync = async (fastify, opts) => {
  try {
    const connection = MQConnection.getInstance();
    await connection.connect();

    const queueName = 'bookmark_archive';
    await consumeMessages(queueName, async (message: string) => {
      const msgData: BookmarkMessage = JSON.parse(message);
      fastify.log.info(`Received message: ${message}`);
      await generateHTML(msgData.id, msgData.url);
    });

  } catch (error) {
    console.error('Error:', error);
  }
};

export default mqPlugin;