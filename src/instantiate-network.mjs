import {Network, Web3Connection} from '@taikai/dappkit';
import {WEB3_HOST, PRIVATE_KEY} from '../config.mjs';

export async function instantiateNetwork(contractAddress, connection = null) {
  if (!connection) {
    connection = new Web3Connection({web3Host: WEB3_HOST, privateKey: PRIVATE_KEY});
    connection.start();
  }
  const network = new Network(connection, contractAddress);
  await network.start();
  return network;
}