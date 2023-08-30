const { Web3 } = require("web3");

const url = "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";
const web3 = new Web3(new Web3.providers.HttpProvider(url));

async function main() {
  const blockNumber = await web3.eth.getBlockNumber();
  const gasPrice = await web3.eth.getGasPrice();
  // const otherThing = await web3.eth.getCoinbase().then(console.log);
  console.log(blockNumber);
  console.log(gasPrice);
}
main();
