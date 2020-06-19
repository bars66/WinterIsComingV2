import {Bridge} from "./bridge";
import {logger as _logger} from "winteriscomingv2-common";
import {getEnv} from "winteriscomingv2-common";

const RABBIT_HOST = getEnv('RABBIT_HOST');
const ID = getEnv('BRIDGE_ID');
const MODBUS_PORT = getEnv('MODBUS_PORT');
const MODBUS_SPEED = +getEnv('MODBUS_SPEED');

let bridge: Bridge;
const logger = _logger.child({app: `bridge.${ID}`});

async function main() {
    bridge = await Bridge.init({
        logger,
        rabbitHost: RABBIT_HOST,
        id: ID,
        port: MODBUS_PORT,
        speed: MODBUS_SPEED
    })
}

process.on('unhandledRejection', async error => {
    logger.fatal({error}, 'Unhandled promise rejection');

    try {
        if (bridge) await bridge.close();
    } catch (e) {
        logger.fatal({error: e}, 'Unhandled promise bridge close failed');
    }

    process.exit(-1);
});

process.on('SIGTERM', async () => {
    logger.info('SIGTERM signal received.');

    try {
        if (bridge) await bridge.close();
    } catch (e) {
        logger.fatal({error: e}, 'SIGTERM bridge close failed');
    }

    process.exit(0);
});

main().catch(e => {
    logger.fatal({error: e}, 'App start fail');
    process.exit(-1);
})