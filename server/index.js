const express = require("express")
const app = express()
const mysql = require("mysql")
const cors = require("cors")

app.use(cors())
app.use(express.json())

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

app.listen(3001, () => {
  console.log("server is running n port 3001")
})
