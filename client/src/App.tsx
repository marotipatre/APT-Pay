import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import { Layout, Row, Col, Button, Spin, Input } from "antd";

import React, { useEffect, useState } from "react";
import {
  useWallet,
  InputTransactionData,
} from "@aptos-labs/wallet-adapter-react";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { Network, Provider } from "aptos";

import "./index.css";
export const provider = new Provider(Network.TESTNET);

// change this to be your module account address
export const moduleAddress =
  "0x71461a8e2ddbfd6a74152c8a86df4a3b60d73b2fd9be872f9a8585501edcdd23";

function App() {
  const { account, signAndSubmitTransaction } = useWallet();
  const [counter, setCounter] = useState<number>(0);
  const [transactionInProgress, setTransactionInProgress] =
    useState<boolean>(false);
  const [reload, setReload] = useState<number>(0);

  const APTOS_COIN = "0x1::aptos_coin::AptosCoin";

  // balance
  const [accountBalance, setAccountBalance] = useState<number>(0);

  const [transfers, setTransfers] = useState<{ [key: string]: string }[]>([
    { address: "", amount: "0" },
  ]);

  // const receiver =
  //   "0x67ac972cc8bcb9b23d7799e9fd02c084f4caad584947a1baebe91391f01be9f1";

  const handleInputChange = (index: number, field: string, value: string) => {
    const newTransfers = [...transfers];
    newTransfers[index][field] = value;
    setTransfers(newTransfers);
  };

  const addTransfer = () => {
    setTransfers([...transfers, { address: "", amount: "0" }]);
  };

  // multiple transfer
  const aptsend = async () => {
    if (!account) return [];
    setTransactionInProgress(true);

    try {
      const recipients = transfers.map((transfer) => transfer.address);
      const amounts = transfers.map((transfer) =>
        (parseFloat(transfer.amount) * 100_000_000).toString()
      );

      // build a transaction payload to be submited
      const payload: InputTransactionData = {
        data: {
          function: "0x1::aptos_account::batch_transfer",
          typeArguments: [],
          functionArguments: [recipients, amounts],
        },
      };

      // sign and submit transaction to chain
      const response = await signAndSubmitTransaction(payload);
      // wait for transaction
      await provider.waitForTransaction(response.hash);

      await fetchAccountBalance();

      //alert
      alert("All transactions have been successfully sent!");
    } catch (error: any) {
      console.log(error);
    } finally {
      setTransactionInProgress(false);
    }
  };

  // const fetch = async () => {
  //   if (!account) return;
  //   try {
  //     const todoListResource = await provider.getAccountResource(
  //       account?.address,
  //       `${moduleAddress}::increase::Count`
  //     );
  //     let data = JSON.parse((todoListResource?.data as any).count);
  //     setCounter(data);
  //     if (reload) {
  //       window.location.reload();
  //     }
  //   } catch (e: any) {
  //     create_c();
  //   }
  // };

  // const create_c = async () => {
  //   if (!account) return [];
  //   setTransactionInProgress(true);
  //   // build a transaction payload to be submited
  //   const payload: InputTransactionData = {
  //     data: {
  //       function: `${moduleAddress}::increase::createcounter`,
  //       functionArguments: [],
  //     },
  //   };
  //   try {
  //     // sign and submit transaction to chain
  //     const response = await signAndSubmitTransaction(payload);
  //     // wait for transaction
  //     await provider.waitForTransaction(response.hash);
  //   } catch (error: any) {
  //     console.log(error);
  //   } finally {
  //     setTransactionInProgress(false);
  //   }
  // };

  // const raise_cCounter = async () => {
  //   setTransactionInProgress(true);
  //   // build a transaction payload to be submited
  //   const payload: InputTransactionData = {
  //     data: {
  //       function: `${moduleAddress}::increase::raise_c`,
  //       functionArguments: [],
  //     },
  //   };
  //   try {
  //     // sign and submit transaction to chain
  //     const response = await signAndSubmitTransaction(payload);
  //     // wait for transaction
  //     await provider.waitForTransaction(response.hash);
  //     window.location.reload();
  //   } catch (error: any) {
  //     console.log(error);
  //     // setAccountHasList(false);
  //   } finally {
  //     setTransactionInProgress(false);
  //   }
  // };

  // const decrement_cCounter = async () => {
  //   setTransactionInProgress(true);
  //   // build a transaction payload to be submited
  //   const payload: InputTransactionData = {
  //     data: {
  //       function: `${moduleAddress}::increase::decrement_c`,
  //       functionArguments: [],
  //     },
  //   };
  //   try {
  //     // sign and submit transaction to chain
  //     const response = await signAndSubmitTransaction(payload);
  //     // wait for transaction
  //     await provider.waitForTransaction(response.hash);
  //     window.location.reload();
  //   } catch (error: any) {
  //     console.log(error);
  //     // setAccountHasList(false);
  //   } finally {
  //     setTransactionInProgress(false);
  //   }
  // };

  const fetchAccountBalance = async () => {
    if (!account) return;
    try {
      const balanceResource = await provider.getAccountResource(
        account.address,
        "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>"
      );
      const balance = parseInt((balanceResource.data as any).coin.value, 10);
      setAccountBalance(balance / 100_000_000); // Convert to APT
    } catch (error: any) {
      console.log(error);
    }
  };

  //Runs one Time
  useEffect(() => {
    fetchAccountBalance();
  }, [account?.address]);

  return (
    <>
      <div className="container mx-auto flex justify-center items-center h-[100vh] flex-col">
        <h1 className="text-5xl font-extrabold mb-20 text-center">OSM-.APT</h1>
        <Col style={{ textAlign: "right", margin: "10px" }}>
          <WalletSelector />
        </Col>

        {transfers.map((transfer, index) => (
          <div key={index} className="w-[50%] flex justify-between mt-3">
            <Input
              type="text"
              value={transfer.address}
              onChange={(e) =>
                handleInputChange(index, "address", e.target.value)
              }
              placeholder="Enter recipient address"
              style={{ width: "45%" }}
            />
            <Input
              type="number"
              value={transfer.amount}
              onChange={(e) =>
                handleInputChange(index, "amount", e.target.value)
              }
              placeholder="Enter amount in APT"
              style={{ width: "45%" }}
            />
          </div>
        ))}
        <button
          className="mt-3 bg-blue-500 text-white px-4 py-2 rounded"
          onClick={addTransfer}
        >
          + Add Another Transfer
        </button>

        <div className="mt-6">
          <h1 className="text-8xl font-extrabold -mt-6">
            {accountBalance ? accountBalance : 0}
          </h1>
        </div>

        <button
          className="mt-3 bg-green-500 text-white px-4 py-2 rounded"
          onClick={aptsend}
          disabled={transactionInProgress}
        >
          {transactionInProgress ? "Sending..." : "Send Transactions"}
          
        </button>
        
      </div>
    </>
  );
}

export default App;
