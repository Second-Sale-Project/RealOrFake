const express = require("express")
var https = require("https")
const app = express()
const mysql = require("mysql")
const cors = require("cors")
var FileReader = require("filereader")

var fs = require("fs")
var keyPath = "./private.key"
var certPath = "./certificate.pem"
var hskey = fs.readFileSync(keyPath)
var hscert = fs.readFileSync(certPath)

const ipfsAPI = require("ipfs-api")
const ipfs = ipfsAPI({ host: "localhost", port: "5001", protocol: "http" })

app.use(cors())
app.use(express.json({ limit: "210000kb" }))
app.use(express.json())

var server = https.createServer(
  {
    key: hskey,
    cert: hscert,
  },
  app
)

const db = mysql.createConnection({
  user: "team",
  host: "140.117.71.141",
  password: "520",
  database: "nfc",
})

app.post("/getnfc", (req, res) => {
  const uid = req.body.uid
  const content = req.body.content
  db.query(
    "SELECT * FROM nfcdata WHERE `nfcuid`= ? AND `nfctext`= ?",
    [uid, content],
    (err, result) => {
      if (err) {
        console.log(err)
      } else {
        res.send(result)
        console.log("Secess")
      }
    }
  )
})

app.post("/postEth", (req, res) => {
  const nfcuId = req.body.nfcuId
  const tranHash = req.body.tranHash
  const pid = req.body.pid
  db.query((err) => {
    const insertNfcdata =
      "INSERT INTO nfcdata (nfcuid,nfctext,pid) VALUES (?,?,?)"
    db.query(insertNfcdata, [nfcuId, tranHash, pid], (err, result) => {
      if (err) {
        const status = 401
        const message = err
        return res.status(status).json({ status, message })
      }
    })
  })
})

const ipfsAPI = require("ipfs-api") //使用ipfs api
const ipfs = ipfsAPI({ host: "localhost", port: "5001", protocol: "http" }) //建立ipfs結點
app.post("/postIPFS", (req, res) => {
  // console.log(req);
  const buffer = req.body.buffer //提取參數中的buffer
  console.log(buffer)
  const Bufferx = Buffer.from(buffer) //建立緩衝區
  return new Promise(function (resolve, reject) {
    ipfs
      .add(Bufferx) //ipfs函式之上傳buffer
      .then((response) => { 
        console.log(response) //顯示上傳後ipfs返回之雜湊值
        res.send(response) //將此雜湊值返回前端顯示
        // resolve(response[0].hash)
      })
      .catch((err) => {
        console.error(err) //錯誤顯示
        // reject(err)
      })
  })
})

server.listen(3011, () => {
  console.log("server is running n port 3011")
})
