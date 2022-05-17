import {Web3Connection,} from '@taikai/dappkit';
import {WEB3_HOST, PRIVATE_KEY, NETWORK_ADDRESS} from './config.mjs';
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
  
  // 27940005 = Staging deploy block
  // 27305326 = Kovan Testnet deploy block
  // 793246 = MOVR deploy block

  //await readEvents(793246, lastBlock, undefined, await instantiateNetwork(NETWORK_ADDRESS, connection));
  //await getOraclers();
  await pointOracles();
  await pointEvents();
  await sumPoints();

}

main();