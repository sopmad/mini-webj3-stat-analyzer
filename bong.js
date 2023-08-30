const prompt = require("prompt-sync")();
const express = require("express");
const app = express();
const port = 3000;

const { Web3 } = require("web3");
const url = "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";
const web3 = new Web3(new Web3.providers.HttpProvider(url));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/block", (req, res) => {
  res.send("getting block!");
  const blockNo = prompt("Enter block number: ");
  printStats(blockNo);
  // TODO: convert to proper html interface
});

app.get("/transaction", (req, res) => {
  res.send("getting transaction!");
  const address = prompt("Enter TxHash: ");
  fetchTransactionData(address);
  // TODO: convert to proper html interface
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

function thingy() {
  let stopProgram = false;
  let moveOn = prompt("test\n");
  if (moveOn == "x") {
    stopProgram = true;
  } else {
    stopProgram = false;
  }
}

async function main() {
  const blockNumber = await web3.eth.getBlockNumber();
  const gasPrice = await web3.eth.getGasPrice();
  // const otherThing = await web3.eth.getCoinbase().then(console.log);
  console.log(blockNumber);
  console.log(gasPrice);

  // do {
  //   thingy();
  //   web3.eth.getBalance('0x000......').then(console.log);
  // } while (stopProgram != true);
}

const getEthStats = async (pain) => {
  const gasPrice = await web3.eth.getGasPrice(); //average gas price
  // const currentBlock = await web3.eth.getBlock("latest");
  const currentBlock = await web3.eth.getBlock(pain);
  let result = null;
  //only when block is mined not pending
  if (currentBlock.number !== null) {
    const previousBlock = await web3.eth.getBlock(currentBlock.parentHash);
    if (previousBlock.number !== null) {
      const timeTaken = currentBlock.timestamp - previousBlock.timestamp;
      // const transactionCount = BigInt(currentBlock.transactions.length);
      // TODO: figure out why grabbing latest lets you get length but using a specific block # doesn't
      const transactionCount = BigInt(137);
      const tps = transactionCount / timeTaken;
      result = {
        currentBlockNumber: currentBlock.number,
        transactionCount,
        timeTaken,
        tps,
        gasPrice,
      };
    }
  }
  return result;
};

const printStats = async (pain) => {
  const stats = await getEthStats(pain);
  if (stats !== null) {
    const { currentBlockNumber, transactionCount, timeTaken, tps, gasPrice } = stats;
    console.log(
      `Current Block (#${currentBlockNumber}): ${transactionCount} in ${timeTaken} seconds at the rate of ${tps} transactions/seconds. The average gas price is ${gasPrice} wei.`
    );
  }
};

async function fetchTransactionData(txHash) {
      try {
        const transaction = await web3.eth.getTransaction(txHash);

        console.log("Transaction Stats:");
        console.log("From: ", transaction.from);
        console.log("To: ", transaction.to);
        console.log("Value: ", web3.utils.fromWei(transaction.value, "ether"), " ETH");
        console.log("Gas Price: ", web3.utils.fromWei(transaction.gasPrice, "gwei"), " GWEI");
        console.log("Gas Used: ", transaction.gas);
        console.log("Transaction Status: ", transaction.blockHash ? "Confirmed" : "Pending");
      } catch (error) {
        console.error("Error:", error);
      }

    // var receipt = web3.eth.getTransactionReceipt(address).then(console.log);
    // return receipt;
}

// printStats();

// main();
