import "./App.css"
import React, { useState } from "react"
import Axios from "axios"

function App() {
  const [uid, setUid] = useState([])
  const [content, setContent] = useState([])
  const [nfcList, setnfcList] = useState([])

  const getNFC = () => {
    if (document.getElementById("uid").value === "") {
      document.getElementById("pic").innerHTML = ""
      document.getElementById("uidempty").innerHTML = "※uid不得為空"
      if (document.getElementById("content").value !== "") {
        document.getElementById("contentempty").innerHTML = ""
      }
    }
    if (document.getElementById("content").value === "") {
      document.getElementById("pic").innerHTML = ""
      document.getElementById("contentempty").innerHTML = "※content不得為空"
      if (document.getElementById("uid").value !== "") {
        document.getElementById("uidempty").innerHTML = ""
      }
    } else if (
      document.getElementById("uid").value !== "" &&
      document.getElementById("content").value !== ""
    ) {
      document.getElementById("uidempty").innerHTML = ""
      document.getElementById("contentempty").innerHTML = ""
      Axios.post("https://140.117.71.141:3011/getnfc", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer df498c83-1c88-308e-a224-5408dd67bb7f",
        },
        uid: uid,
        content: content,
      })
        .then((response) => {
          console.log("success")
          console.log(response.data)
          setnfcList(response.data)
          getEther(response.data[0])
        })
        .catch((err) => {
          console.error(err)
          document.getElementById("pic").innerHTML = "無此商品"
        })
    }
  }

  const getEther = (data) => { //利用ETHERSCAN API獲取資訊
    console.log(data.nfctext)
    const BASE_URL =
      "https://api-rinkeby.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=" +
      data.nfctext
    Axios.get(BASE_URL).then((response) => {
      const content = response.data.result.input 
      var contentQM = content.slice(-128, -36) //剔除合約中不重要部分
      const qmContent = hextoascii(contentQM) //得到加密QM值
      console.log(qmContent)
      getipfs(qmContent) //將QM傳參到getipfs函式處理
    })
  }

  //change hex to ascii 轉換合約內容近制
  const hextoascii = (content) => {
    var hex1 = content.toString()
    var hex = hex1.replace(/0x/g, "") //delete 0x number
    var str = ""
    for (var i = 0; i < hex.length; i += 2)
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16)) //文字處理合約不必要冗贅內容
    return str
  }

  const getipfs = (QM) => {
    //via IPFS api to get pic
    var imgurl = "https://ipfs.io/ipfs/" + QM //獲取IPFS圖片
    document.getElementById("pic").innerHTML =
      '<img src="' + imgurl + '" height="99%" weight="99%"">'
  }

  return (
    <div className="App">
      <div className="info">
        <label>uId:</label>
        <input
          id="uid"
          type="text"
          onChange={(event) => {
            setUid(event.target.value)
          }}
          required="required"
        ></input>
        <p id="uidempty" className="errortext"></p>
        <label>Content:</label>
        <input
          id="content"
          type="text"
          onChange={(event) => {
            setContent(event.target.value)
          }}
          required="required"
        ></input>
        <p id="contentempty" className="errortext"></p>
        <button onClick={getNFC}>Send</button>
        <br />

        {nfcList.map((value, key) => {
          return (
            <div className="employee">
              <h3>uId : {value.nfcuid}</h3>
              <h3>Content : {value.nfctext}</h3>
            </div>
          )
        })}
        <div className="verifyspace" id="pic"></div>
      </div>
    </div>
  )
}

export default App
