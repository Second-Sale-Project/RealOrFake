import React, { Component } from "react"

const ipfsAPI = require("ipfs-api")
const ipfs = ipfsAPI({ host: "localhost", port: "5001", protocol: "http" })

let saveImageOnIpfs = (reader) => {
  return new Promise(function (resolve, reject) {
    const buffer = Buffer.from(reader.result)
    ipfs
      .add(buffer)
      .then((response) => {
        console.log(response)
        resolve(response[0].hash)
      })
      .catch((err) => {
        console.error(err)
        reject(err)
      })
  })
}

class Upload extends Component {
  constructor(props) {
    super(props)
    this.state = {
      imgSrc: null,
    }
  }

  render() {
    return (
      <div className="App">
        <h2>上传图片到IPFS：</h2>
        <div>
          <label id="file">Choose file to upload</label>
          <input
            type="file"
            ref="file"
            id="file"
            name="file"
            multiple="multiple"
          />
        </div>
        <div>
          <button
            onClick={() => {
              var file = this.refs.file.files[0]
              var reader = new FileReader()
              // reader.readAsDataURL(file);
              reader.readAsArrayBuffer(file)
              reader.onloadend = (e) => {
                console.log(reader)
                // 上傳數據至IPFS
                saveImageOnIpfs(reader).then((hash) => {
                  console.log(hash)
                  this.setState({ imgSrc: hash })
                })
              }
            }}
          >
            Submit
          </button>
        </div>
        {this.state.imgSrc ? (
          <div>
            <h2>{"http://localhost:8080/ipfs/" + this.state.imgSrc}</h2>
            <img
              alt="網路失敗"
              style={{
                width: 1300,
              }}
              src={"http://localhost:8080/ipfs/" + this.state.imgSrc}
            />
          </div>
        ) : (
          <img alt="" />
        )}
      </div>
    )
  }
}

export default Upload
