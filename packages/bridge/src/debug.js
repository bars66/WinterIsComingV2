import amqplib from 'amqplib';
import {getEnv, BRIDGES_COMMAND_EXCHANGE} from 'winteriscomingv2-common';
const RABBIT_HOST = getEnv('RABBIT_HOST');

let cmd = process.argv[2] === 'open' ? 3200 : -3520;

async function main() {
  const connection = await amqplib.connect(RABBIT_HOST);
  console.log('Command', cmd);

  console.log(
    'res',
    await send(connection, {
      clientId: 10,
      retry: -1,

      command: {
        cmd: 'writeRegisters',
        dataAddress: 0,
        values: [-1 * -3520 + (1 << 15), -3520 + (1 << 15), -3520 + (1 << 15)],
      },
    })
  );

  await connection.close();
}

function send(connection, command) {
  return new Promise(async (resolve, reject) => {
    const channel = await connection.createChannel();
    await channel.assertExchange(BRIDGES_COMMAND_EXCHANGE, 'direct', {
      durable: false,
    });
    const q = await channel.assertQueue('', {
      exclusive: true,
      autoDelete: true,
    });

    const correlationId = generateUuid();

    await channel.consume(
      q.queue,
      async function (msg) {
        if (msg.properties.correlationId === correlationId) {
          await channel.close();
          resolve(msg.content.toString());
        }
      },
      {
        noAck: true,
      }
    );

    await channel.publish(
      BRIDGES_COMMAND_EXCHANGE,
      `bridge.1`,
      Buffer.from(JSON.stringify(command)),
      {
        correlationId: correlationId,
        replyTo: q.queue,
      }
    );
  });
}

main();

function generateUuid() {
  return Math.random().toString() + Math.random().toString() + Math.random().toString();
}
