import fs from 'fs';
import {NETWORK_ADDRESS} from '../config.mjs';
import {instantiateNetwork} from './instantiate-network.mjs';

export async function getOraclers() {
  const network = await instantiateNetwork(NETWORK_ADDRESS);
  const addresses = [];

  let end = false;

  console.log(`Parsing oraclersArray...`);

  for (let index = 0; !end; index++) {
    try {
      const address = await network.callTx(network.contract.methods.oraclersArray(index));
      addresses.push(address);
      console.log(`Added`, address);
    } catch (e) {
      end = true;
      console.log(`Error fetching address index ${index}`);
    }
  }

  fs.writeFileSync('./pool.json', JSON.stringify(addresses, null, 2), 'utf8');

  return addresses;
}