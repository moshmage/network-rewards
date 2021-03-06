import fs from 'fs';

export async function sumPoints() {
  console.log(`Summing points...`);
  const eventsPoints = JSON.parse(fs.readFileSync('events-points.json', 'utf-8'));
  const oraclesPoints = JSON.parse(fs.readFileSync('oracles-points.json', 'utf-8'));

  const addresses = [...new Set([...Object.keys(oraclesPoints), ...Object.keys(eventsPoints)])];
  const totalDistribution = eventsPoints.totalPoints + oraclesPoints.totalPoints;
  
  delete eventsPoints.totalPoints;
  delete oraclesPoints.totalPoints;

  const mapped = {totalDistribution};

  for (const address of addresses) {
    const points = +((eventsPoints[address]?.totalPoints || 0) + (oraclesPoints[address]?.totalPoints || 0))
    if (points > 0)
      mapped[address] = points;
  }

  
  
  fs.writeFileSync('distributions.json', JSON.stringify(mapped, null, 2), 'utf-8');

  return true;
}