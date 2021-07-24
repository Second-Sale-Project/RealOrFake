import React, { Component } from "react"
import axios from "axios"

// import css from "./app.css"

var Web3 = require("web3") //引入WEB3
let ethereum = window.ethereum //用ethereum API
let web3 = window.web3
var currentAccount = null
var tranHash = ""

const ipfsAPI = require("ipfs-api")
const ipfs = ipfsAPI({ host: "localhost", port: "5001", protocol: "http" })

let saveImageOnIpfs = (reader) => { 
  return new Promise(function (resolve, reject) { 
    const buffer = Buffer.from(reader.result) //將reader內file值轉換為buffer
    console.log(buffer) //console檢查buffer是否有誤
    axios //axios將後續作業傳輸至後端server進行運算與作業
      .post("https://140.117.71.141:3011/postIPFS", { //server地址(web api)
        buffer: buffer, //將轉換後至buffer傳輸過去
      })
      .then((response) => {
        console.log("success") //後端作業如正確執行顯示成功
        resolve(response.data[0].hash) //返回該筆交易雜湊值hash
      })
      .catch((err) => {
        console.error(err) //後端作業如失敗顯示失敗訊息
        reject(err) 
      })
  })
}

class uploadAll extends Component {
  constructor(props) {
    super(props)
    this.state = {
      imgSrc: null,
    }
  }

  render() {
    return (
      <div className="App">
        <h2>【證書IPFS上傳】</h2>
        <div>
          <label id="file">Choose file to upload</label>
          <input
            type="file"
            ref="file"
            id="file"
            name="file"
            // multiple="multiple"
          />
        </div>
        <div>
          <button
            onClick={() => {
              var file = this.refs.file.files[0] //讀取input file
              var reader = new FileReader() //FileReader 非同步讀取file餒榮
              reader.readAsArrayBuffer(file) //將file內容儲存至buffer緩存
              reader.onloadend = (e) => { 
                console.log(reader) //console檢查讀取內容
                saveImageOnIpfs(reader).then((hash) => { //將reader內容傳參至saveImageOnIpfs函數
                  console.log(hash)
                  this.setState({ imgSrc: hash }) //獲取乙太坊網路該筆交易雜湊值Hash
                })
              }
            }}
          >
            上傳圖片
          </button>
        </div>
        {this.state.imgSrc ? (
          <div>
            <h2>{"IPFS之hash值為 : " + this.state.imgSrc}</h2>
            {/* <img
              alt="網路失敗"
              style={{
                width: 1600,
              }}
              src={"localhost:8080/ipfs/" + this.state.imgSrc}
            /> */}
          </div>
        ) : (
          <img alt="" />
        )}

        <h2>【證書上鏈】</h2>
        <h4>商品ID("pId")：</h4>
        <input
          type="text"
          name="pId"
          id="word"
          style={{ width: "600px" }}
        ></input>
        {/*之後QM要自動上傳*/}
        <h4>IPFS HASH("QM")：</h4>
        <input
          type="text"
          name="QM"
          id="name"
          value={this.state.imgSrc}
          style={{ width: "600px" }}
        ></input>
        <h4>NFC ID("nfcuId")：</h4>
        <input
          type="text"
          name="nfcuId"
          id="nfcuId"
          style={{ width: "600px" }}
        ></input>
        <br></br>
        <button type="submit" onClick={getMoney}>
          上傳資料庫&上傳ETH網路
        </button>
        <h2 id="tranHash"></h2>
        <h2 id="tranHashLink"></h2>
      </div>
    )
  }
}

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

//在页面未加载完毕之前显示的loading Html自定义内容
var _LoadingHtml =
  '<div id="loadingDiv" style="display: none; "><div id="over" style=" position: fixed;top: 0;left: 0; width: 100%;height: 100%; background-color: #f5f5f5;opacity:0.5;z-index: 1000;"></div><div id="layout" style="position: fixed;top: 40%; left: 40%;width: 20%; height: 20%;  z-index: 1001;text-align:center;"><img weight="50ew" height ="50eh" src="https://www.superiorlawncareusa.com/wp-content/uploads/2020/05/loading-gif-png-5.gif" /></div></div>'
//loading效果
document.write(_LoadingHtml)

//移除
function completeLoading() {
  document.getElementById("loadingDiv").style.display = "none"
}
//展示loading效果
function showLoading() {
  document.getElementById("loadingDiv").style.display = "block"
}

function handleAccountsChanged(accounts) {
  if (accounts.length === 0) {
    console.log("Please connect to MetaMask.")
  } else if (accounts[0] !== currentAccount) {
    currentAccount = accounts[0]
  }
}

function setAccount() {
  coinbase = currentAccount
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
] //寫入智能合約內容ABI
myContract = new web3.eth.Contract(contract_abi, contract_address) //define合約

async function getMoney() {
  var ID = document.getElementById("word").value 
  var NM = document.getElementById("name").value
  var nfcuId = document.getElementById("nfcuId").value
  myContract.methods
    .RecordText(ID, NM) //紀錄ID及NM 
    .send({ from: coinbase }) //傳送數據
    .then(showLoading()) //LOADING上鏈特效
    .then(function (receipt) {
      completeLoading() //結束LOADING上鏈特效
      // alert("交易成功，紀錄文字")
      console.log(receipt.transactionHash) //返回上筆乙太坊交易ID
      tranHash = receipt.transactionHash
      printHash(receipt.transactionHash)
    })
    .then(() => {
      var pid = ID
      console.log("nfcuId:" + nfcuId + "pid:" + pid + "tranHash:" + tranHash)
      axios.post("https://140.117.71.141:3011/postEth", { //將資料同步儲存至後端資料庫
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer df498c83-1c88-308e-a224-5408dd67bb7f",
        },
        nfcuId: nfcuId,
        tranHash: tranHash,
        pid: pid,
      })
    })
}

//顯示交易hash值
async function printHash(tranHash) {
  document.getElementById("tranHash").innerHTML =
    "ETH transaction Hash : " + tranHash + " (匯入NFC晶片) "
  document.getElementById("tranHashLink").innerHTML =
    "Link : https://rinkeby.etherscan.io/tx/" + tranHash
}

export default uploadAll
