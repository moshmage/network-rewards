import {Web3Connection,} from '@taikai/dappkit';
import {WEB3_HOST, PRIVATE_KEY, NETWORK_ADDRESS, EVENT_START_BLOCK} from './config.mjs';
import {instantiateNetwork} from './src/instantiate-network.mjs';
import {readEvents} from './src/read-events.mjs';
import {getOraclers} from './src/get-oracles.mjs';
import {pointEvents} from './src/point-events.mjs';
import {pointOracles} from './src/point-oracles.mjs';
import {sumPoints} from './src/sum-points.mjs';


async function main() {
  console.log(`Starting reward logic...`);

  const connection = new Web3Connection({web3Host: WEB3_HOST, privateKey: PRIVATE_KEY});
  connection.start();

  const lastBlock = await connection.eth.getBlockNumber();

  await readEvents(EVENT_START_BLOCK, lastBlock, undefined, await instantiateNetwork(NETWORK_ADDRESS, connection));
  await getOraclers();
  await pointOracles();
  await pointEvents();
  await sumPoints();

  console.log(`Finished, check distributions.json`);

}

main()
  .then(_ => process.exit(0))
  .catch(e => {
    console.log(e);
    process.exit(1)
  });
