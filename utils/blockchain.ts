import '@ethersproject/shims';
import * as EthUtil from 'ethereumjs-util';
import EtherWallet from 'ethereumjs-wallet';
import {ethers} from 'ethers';

export const getWalletFromPK = (privateKey: string) => {
  const privateKeyBuffer = EthUtil.toBuffer(privateKey);
  return EtherWallet.fromPrivateKey(privateKeyBuffer);
};

export const getWalletFromMnemonic = async (
  mnemonic: string,
): Promise<Wallet | false> => {
  try {
    const wallet = ethers.Wallet.fromMnemonic(mnemonic.trim());
    const privateKey = wallet.privateKey;
    const addressStr = wallet.address;

    return {
      address: addressStr,
      privateKey,
      balance: 0,
      staked: 0,
    };
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const generateWallet = () => {
  const newWallet = EtherWallet.generate();
  return {
    address: newWallet.getAddressString(),
    privateKey: newWallet.getPrivateKeyString(),
    balance: 0,
  };
};

export const generateMnemonic = () => {
  const wallet = ethers.Wallet.createRandom();
  return wallet.mnemonic.phrase;
};
