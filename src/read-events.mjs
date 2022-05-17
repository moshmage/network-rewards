import fs from 'fs';
import {BLOCK_INCREMENTER} from '../config.mjs';

export async function readEvents(fromBlock = 27940005, lastBlock = 0, [proposals, disputes, closed, open] = [[], [], [], []], network = null) {

  if (!network)
    throw new Error('missing network');
  
  let toBlock = Math.floor(+fromBlock + BLOCK_INCREMENTER).toString();
  
  let time = +new Date();
  
  if (toBlock > lastBlock)
    toBlock = lastBlock;
  
  const filter = {fromBlock, ... +toBlock > 0 ? {toBlock} : {}, };

  proposals.push(...await network.getMergeProposalCreatedEvents(filter));
  disputes.push(...await network.getDisputeMergeEvents(filter));
  closed.push(...await network.getCloseIssueEvents(filter));

  console.log('Read events from block', fromBlock, 'to', toBlock, `(${(+new Date() - time)/1000}s)`);

  if (toBlock == lastBlock) {
    fs.writeFileSync('./events.json', JSON.stringify({proposals, disputes, closed}, null, 2));
    return [proposals, disputes, closed, open];
  }

  return readEvents(toBlock, lastBlock, [proposals, disputes, closed, open], network);
}