import { useEffect, useState, useCallback } from 'react';

const DEFAULT_OWNER = process.env.OWNER_KEY;

const useMetaMaskAccount = ({ handleGetOwnerAddressCallBack = () => {} }) => {
  const [owner, setOwner] = useState('');

  const getOwnerAddress = useCallback(() => {
    if (window.ethereum) {
      // https://docs.metamask.io/wallet/get-started/access-accounts/
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((data) => {
          const address = data[0];
          setOwner(address);
          handleGetOwnerAddressCallBack({ owner: address });
        })
        .catch((err) => {
          setOwner(DEFAULT_OWNER);
          handleGetOwnerAddressCallBack({ owner: DEFAULT_OWNER });
          console.error(err);
        });
    } else {
      setOwner(DEFAULT_OWNER);
      handleGetOwnerAddressCallBack({ owner: DEFAULT_OWNER });
    }
  }, [handleGetOwnerAddressCallBack]);

  useEffect(() => {
    getOwnerAddress();
  }, [getOwnerAddress]);

  return { owner };
};

export default useMetaMaskAccount;
