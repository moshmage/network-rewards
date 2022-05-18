import fs from 'fs';

export async function sumPoints() {
  const eventsPoints = JSON.parse(fs.readFileSync('events-points.json', 'utf-8'));
  const oraclesPoints = JSON.parse(fs.readFileSync('oracles-points.json', 'utf-8'));

  const addresses = [...new Set([...Object.keys(oraclesPoints), ...Object.keys(eventsPoints)])];
  const totalDistribution = eventsPoints.totalPoints + oraclesPoints.totalPoints;
  
  const mapped = {totalDistribution};

  for (const address of addresses)
    mapped[address] = +((eventsPoints[address]?.totalPoints || 0) + (oraclesPoints[address]?.totalPoints || 0)).toFixed(8);
  
  delete mapped.totalPoints;
  fs.writeFileSync('distributions.json', JSON.stringify(mapped, null, 2), 'utf-8');

  return true;
}