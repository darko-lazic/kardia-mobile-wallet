import '@ethersproject/shims';
import * as EthUtil from 'ethereumjs-util';
import * as Bip39 from 'bip39';
import {hdkey} from 'ethereumjs-wallet';
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
    const seed = await Bip39.mnemonicToSeed(mnemonic);
    const root = hdkey.fromMasterSeed(seed);
    const masterWallet = root.getWallet();
    const privateKey = masterWallet.getPrivateKeyString();
    const addressStr = masterWallet.getChecksumAddressString();
    return {
      address: addressStr,
      privateKey,
      balance: 0,
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
