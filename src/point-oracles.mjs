import {NETWORK_ADDRESS, POINT_PER_DELEGATION, POINT_PER_DELEGATED_TOKEN, POINT_PER_UNUSED_TOKEN, POINT_PER_LOKED_TOKEN} from '../config.mjs';
import {instantiateNetwork} from './instantiate-network.mjs';
import fs from 'fs';
import {fromBigNumber} from './from-big-number.mjs'

export async function pointOracles() {
  const network = await instantiateNetwork(NETWORK_ADDRESS);
  const council = await network.COUNCIL_AMOUNT();

  const mapped = {};

  if (!fs.existsSync('pool.json'))
    throw new Error(`Missing pool.json; run getOraclers()`);

  const _oracles = [];

  const addressesPool = [...new Set(JSON.parse(fs.readFileSync('./pool.json', 'utf-8')))];
  const oracleSummary = fs.existsSync('./oracles.json') ? JSON.parse(fs.readFileSync('./oracles.json', 'utf-8')) : {};

  let totalPoints = 0;

  for (let index = 0; index <= addressesPool.length - 1; index++) {
    const address = addressesPool[index];

    console.log(`Parsing oracles for ${address} (${index+1}/${addressesPool.length})`);

    const oracles = oracleSummary[index] || await network.getOraclesSummary(address);
    const delegations = [...new Set(oracles.amounts.filter((a, i) => oracles.addresses[i] != address))];
    const delegated = delegations.reduce((p, c) => p + c, 0);
    const _tokensLocked = (oracles.tokensLocked);
    const unused = _tokensLocked - delegated;
    
    _oracles.push(oracles);

    const points = {
      delegations: [...delegations].length * POINT_PER_DELEGATION,
      delegated: delegated * POINT_PER_DELEGATED_TOKEN,
      unused: unused * POINT_PER_UNUSED_TOKEN,
      locked: _tokensLocked * POINT_PER_LOKED_TOKEN,
    };

    mapped[address] = {
      ...mapped[address],
      ...points,
      info: {delegated, delegations, unused, isCouncil: unused >= council, locked: _tokensLocked},
      totalPoints: points.locked + points.delegations + points.unused + points.delegated
    }

    totalPoints += mapped[address].totalPoints;
    
    //console.log(`${address} total points ${mapped[address].totalPoints} (delegations: ${points.delegations}) (delegated: ${points.delegated}) (unused: ${points.unused}) (locked: ${points.locked})`);
  }

  mapped.totalPoints = +totalPoints.toFixed(2);

  console.log(`Total oracles distribution:`, mapped.totalPoints);

  fs.writeFileSync('./oracles-points.json', JSON.stringify(mapped, null, 2), 'utf8');
  fs.writeFileSync('./oracles.json', JSON.stringify(_oracles, null, 2), 'utf-8');
}
