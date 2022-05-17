import BigNumber from 'bignumber.js';

export function fromBigNumber(value, decimals = 18) {
  return new BigNumber(value).shiftedBy(-(+decimals)).toNumber();
}