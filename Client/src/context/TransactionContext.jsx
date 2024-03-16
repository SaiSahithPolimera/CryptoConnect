// TransactionContext.jsx
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

const { ethereum } = window;

export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [formData, setFormData] = useState({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });
  const [Loading, setLoading] = useState(false);
  const [transactionCount, settransactionCount] = useState(localStorage.getItem('transactionCount'))

  const handleChange = (e, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);

        // getAllTransactions();
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getEthereumContract = () => {
    return new Promise((resolve, reject) => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);

        resolve(transactionContract);
      } else {
        window.addEventListener('ethereum#initialized', ethereum => {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);

          resolve(transactionContract);
        }, {
          once: true,
        });

        setTimeout(() => {
          if (window.ethereum) return;
          reject(new Error('Please install MetaMask!'));
        }, 3000); // 3 seconds
      }
    });
  };
const sendTransaction = async () => {
  try {
    if (!ethereum) return alert('Please install metamask');
    const { addressTo, amount, keyword, message } = formData;
    const transactionContract = await getEthereumContract();
    const parsedAmount = ethers.parseEther(amount);
      await ethereum.request(
        {
          method: 'eth_sendTransaction',
          params: [{
            from: currentAccount,
            to: addressTo,
            gas: '0x5028',
            value: parsedAmount,
          }]
        }
      );
      const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);
      setLoading(true);
      console.log(`Loading - ${transactionHash.hash}`);
      await transactionHash.wait();
      setLoading(false);
      console.log(`Sucess - ${transactionHash.hash}`);
      const transactionCount = await transactionContract.getTransactionCount();
      settransactionCount(transactionCount.toNumber());
    }
    catch(error) {
      console.log(error);
      throw new Error('No etherum object');
    }
  };
  
  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_requestAccounts", });

      setCurrentAccount(accounts[0]);
      window.location.reload();
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <TransactionContext.Provider value={{ connectWallet, currentAccount, formData, sendTransaction, handleChange }}>
      {children}
    </TransactionContext.Provider>
  );
};