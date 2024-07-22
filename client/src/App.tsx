import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import { Layout, Row, Col, Button, Spin } from "antd";

import React, { useEffect, useState } from "react";
import { useWallet,InputTransactionData } from "@aptos-labs/wallet-adapter-react";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { Network, Provider } from "aptos";

import "./index.css";
export const provider = new Provider(Network.TESTNET);
// change this to be your module account address
export const moduleAddress = "0x71461a8e2ddbfd6a74152c8a86df4a3b60d73b2fd9be872f9a8585501edcdd23";

function App() {
  const { account, signAndSubmitTransaction } = useWallet();
  const [counter, setCounter] = useState<number>(0);
  const [transactionInProgress, setTransactionInProgress] = useState<boolean>(false);
  const [accountHasList, setAccountHasList] = useState<boolean>(false);
  const [reload, setReload] = useState<number>(0);

  const fetch = async () => {
    if (!account) return;
    try {
      const todoListResource = await provider.getAccountResource(
        account?.address,
        `${moduleAddress}::increase::Count`,
      );
      let data = JSON.parse((todoListResource?.data as any).count);
      setCounter(data);
      if (reload) {
        window.location.reload();
      }
    }
    catch (e: any) {
      create_c();
    }
  }

  const create_c = async () => {
    if (!account) return [];
    setTransactionInProgress(true);
    // build a transaction payload to be submited
    const payload:InputTransactionData = {
      data: {
      
      function: `${moduleAddress}::increase::createcounter`,
      functionArguments: [],
      },
    };
    try {
      // sign and submit transaction to chain
      const response = await signAndSubmitTransaction(payload);
      // wait for transaction
      await provider.waitForTransaction(response.hash);
    } catch (error: any) {
      console.log(error);
    } finally {
      setTransactionInProgress(false);
    }
  };

  const raise_cCounter = async () => {
    setTransactionInProgress(true);
    // build a transaction payload to be submited
    const payload:InputTransactionData = {
      data: {
      
      function: `${moduleAddress}::increase::raise_c`,
      functionArguments: [],
    
      },
    };
    try {
      // sign and submit transaction to chain
      const response = await signAndSubmitTransaction(payload);
      // wait for transaction
      await provider.waitForTransaction(response.hash);
      window.location.reload();
    } catch (error: any) {
      console.log(error);
      // setAccountHasList(false);
    } finally {
      setTransactionInProgress(false);
    }
  };

  const decrement_cCounter = async () => {
    setTransactionInProgress(true);
    // build a transaction payload to be submited
    const payload:InputTransactionData = {
      data: {
      
      function: `${moduleAddress}::increase::decrement_c`,
      functionArguments: [],
      
      }
    };
    try {
      // sign and submit transaction to chain
      const response = await signAndSubmitTransaction(payload);
      // wait for transaction
      await provider.waitForTransaction(response.hash);
      window.location.reload();
    } catch (error: any) {
      console.log(error);
      // setAccountHasList(false);
    } finally {
      setTransactionInProgress(false);
    }
  };

  //Runs one Time
  useEffect(() => {
    fetch();
  }, [account?.address]);


  return (
    <>
      <div className="container mx-auto flex justify-center items-center h-[100vh] flex-col">
      <h1 className="text-5xl font-extrabold mb-20 text-center">OSM-.APT</h1>
      <Col style={{ textAlign: "right" , margin:"10px"  }}>
            <WalletSelector />
          </Col>
        <div className="w-[50%] flex justify-between mt-3">

          <div>
            <div className="group relative">
              <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 opacity-75 blur transition duration-500 group-hover:opacity-100"></div>
              <button className="relative rounded-lg bg-black px-7 py-4 text-white"
              onClick={raise_cCounter}>Increase By One</button>
            </div>
          </div>

          <div><h1 className="text-8xl font-extrabold -mt-6">{counter? counter : 0}</h1></div>


          <div>
            <div className="group relative">
              <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 opacity-75 blur transition duration-500 group-hover:opacity-100"></div>
              <button className="relative rounded-lg bg-black px-7 py-4 text-white"
              onClick={decrement_cCounter}>Decrease By One</button>
            </div>
          </div>

        </div>

      </div>

    </>
  );

}

export default App;
