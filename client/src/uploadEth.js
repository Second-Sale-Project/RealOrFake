const { render } = require("react-dom")
var Web3 = require("web3")

if (typeof web3 !== "undefined") {
  var web3 = new Web3(web3.currentProvider)
} else {
  // 確認是否使用metamask地址
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
}

var myContract
var coinbase
var account_id = "123"
// var getNum = "1234"
// var getAdd = "tommy"
// var getArticle = "I AM BOY"

function uploadEth() {
  return (
    <div>
      永久記錄文字在區塊鏈上
      <h4>輸入文字：</h4>
      <input type="text" name="欄位名稱" id="word" onChange={foso}></input>
      <h4>輸入暱稱：</h4>
      <input type="text" name="欄位名稱" id="name"></input>
      <button type="submit" onClick={getMoney}>
        輸入
      </button>
    </div>
  )
}
async function foso() {
  // ethereum.enable()
  //window.location.reload();//畫面重新整理
  coinbase = await web3.eth.getCoinbase()
  var balance = await web3.eth.getBalance(coinbase)
  account_id.text("0xb2CD1185B0ad018c305a932da70405C50aE9d4cB")
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
}

async function getMoney() {
  var ID = document.getElementById("word").value
  var NM = document.getElementById("name").value
  console.log(ID)
  myContract.methods
    .RecordText(ID, NM)
    .send({ from: coinbase })
    .then(function (receipt) {
      alert("交易成功，紀錄文字")
    })
}

//查詢時使用
// async function getNums() {
//   var asf = document.getElementById("NUMS").value
//   getNum.text(" " + asf)
//   var countS = await myContract.methods.count().call({ from: coinbase }) //調用力量
//   //alert(countS);
//   //  if(asf > countS){
//   //    alert("尚未記錄編號"+asf+"的文字");
//   //     return;
//   //  }

//   var contract_balance = await myContract.methods
//     .ArticleWriter(asf)
//     .call({ from: coinbase }) //調用
//   getAdd.text(" " + contract_balance)

//   var contract_balance = await myContract.methods
//     .ArticleContent(asf)
//     .call({ from: coinbase }) //調用
//   getArticle.text(" " + contract_balance)
// }

export default uploadEth
