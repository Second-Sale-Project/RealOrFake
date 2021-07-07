var Web3 = require("web3") //引入WEB3
let ethereum = window.ethereum //用ethereum API
let web3 = window.web3
var currentAccount = null

if (typeof web3 !== "undefined") {
  ethereum.enable() //開啟METAMASK
  web3 = new Web3(web3.currentProvider)
  console.log("metamask")
} else {
  // 確認是否使用metamask地址
  web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545")) //備援伺服器
  console.log("others")
}

ethereum
  .request({ method: "eth_accounts" })
  .then(handleAccountsChanged)
  .then(setAccount)
  .catch((err) => {
    console.error(err)
  })

function handleAccountsChanged(accounts) {
  if (accounts.length === 0) {
    console.log("Please connect to MetaMask.")
  } else if (accounts[0] !== currentAccount) {
    currentAccount = accounts[0]
  }
}

function setAccount() {
  coinbase = currentAccount
  console.log(coinbase)
}

var myContract
var coinbase
var contract_address = "0xb2CD1185B0ad018c305a932da70405C50aE9d4cB" //合約位置
var contract_abi = [
  {
    constant: true,
    inputs: [],
    name: "count",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "", type: "uint256" }],
    name: "ArticleWriter",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "", type: "uint256" }],
    name: "writers",
    outputs: [
      { name: "owner", type: "address" },
      { name: "text", type: "string" },
      { name: "name", type: "string" },
      { name: "number", type: "uint256" },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "text", type: "string" },
      { name: "name", type: "string" },
    ],
    name: "RecordText",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "owner", type: "address" }],
    name: "getArticleByOwner",
    outputs: [{ name: "", type: "uint256[]" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "", type: "uint256" }],
    name: "ArticleContent",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: "owner", type: "address" },
      { indexed: false, name: "text", type: "string" },
      { indexed: false, name: "name", type: "string" },
      { indexed: false, name: "Number", type: "uint256" },
    ],
    name: "Record",
    type: "event",
  },
]
myContract = new web3.eth.Contract(contract_abi, contract_address)

function uploadEth() {
  return (
    <div>
      永久記錄文字在區塊鏈上
      <h4>輸入文字：</h4>
      <input type="text" name="欄位名稱" id="word"></input>
      <h4>輸入暱稱：</h4>
      <input type="text" name="欄位名稱" id="name"></input>
      <button type="submit" onClick={getMoney}>
        輸入
      </button>
    </div>
  )
}

async function getMoney() {
  var ID = document.getElementById("word").value
  var NM = document.getElementById("name").value
  myContract.methods
    .RecordText(ID, NM)
    .send({ from: coinbase })
    .then(function (receipt) {
      alert("交易成功，紀錄文字")
    })
}

export default uploadEth
