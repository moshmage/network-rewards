import {NETWORK_ADDRESS, POINT_PER_PROPOSAL, POINT_PER_CLOSED_ISSUE, POINT_PER_DIPUTE_TOKEN} from '../config.mjs';
import fs from 'fs';
import {instantiateNetwork} from './instantiate-network.mjs';
import {fromBigNumber} from './from-big-number.mjs'

export async function pointEvents() {
  console.log(`Distributing points from events...`);

  if (!fs.existsSync('events.json'))
    throw new Error(`Missing events.json; run readEvents()`);

  const {proposals, disputes, closed} = JSON.parse(fs.readFileSync('events.json', 'utf-8'));
  const network = await instantiateNetwork(NETWORK_ADDRESS);

  const mapped = {};

  const addPointToMapper = (owner = '0xAddress', keyName = '', value = 0) => {
    if (!mapped[owner])
      mapped[owner] = {};
    if (mapped[owner][keyName] === undefined)
      mapped[owner][keyName] = 0;

    mapped[owner][keyName] += value;

    console.log(`${owner} ${keyName} summing ${value} (${mapped[owner][keyName]})`);
  }

  for (const proposal of proposals)
    addPointToMapper(proposal.returnValues.creator, 'proposals', POINT_PER_PROPOSAL)

  for (const disputer of disputes)
    addPointToMapper(disputer.returnValues.disputer, 'disputes', fromBigNumber(disputer.returnValues.oracles) * POINT_PER_DIPUTE_TOKEN)

  for (const closer of closed) {
    const bounty = await network.getIssueById(closer.returnValues.id);
    addPointToMapper(bounty.issueGenerator, 'closed', POINT_PER_CLOSED_ISSUE)
  }

  let totalEventsPoints = 0;
  Object.keys(mapped).forEach(owner => {
    mapped[owner].totalPoints = Object.values(mapped[owner]).reduce((p, c) => p+c, 0);
    totalEventsPoints += mapped[owner].totalPoints;
  });

  mapped.totalPoints = +totalEventsPoints.toFixed(4);

  console.log(`Total events distribution: `, mapped.totalPoints);

  fs.writeFileSync('./events-points.json', JSON.stringify(mapped, null, 2));

}