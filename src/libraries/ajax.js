import axios from 'axios';

export const getAssets = (query = {}) =>
  axios.get('https://testnets-api.opensea.io/api/v1/assets', {
    params: {
      limit: 20,
      ...query,
    },
  });

export const getAssetDetail = ({ assetContractAddress, tokenId }) =>
  axios.get(
    `https://testnets-api.opensea.io/api/v1/asset/${assetContractAddress}/${tokenId}`
  );
