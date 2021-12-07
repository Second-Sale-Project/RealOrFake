import React, { Component } from "react"
import axios from "axios"
import "bootstrap/dist/css/bootstrap.min.css"
import "./App.css"
import html2canvas from "html2canvas"
import imgg from "./assets/image/image.png"
import OKsign from "./IMAGE/OKsign.png"
import "./assets/css/style.css"
import { Link } from "react-router-dom"

html2canvas(document.body).then(function (canvas) {
  document.body.appendChild(canvas)
  canvas.setAttribute("style", "display:none;")
  Datee = new Date()
  date = Datee.getDate()
  month = Datee.getMonth() + 1
  year = Datee.getFullYear()
  console.log(date, month, year)
})

var downLoadSRC = "1"
const DL_BTN_ID = "dl-btn"
const DL_HIDDEN_NODE_ID = "dl-node"
const TITLE_INPUT_ID = "title-input"
const FILE_INPUT_ID = "file-input"
const CARD_IMAGE_ID = "card-image"
const DOM_WIDTH = 347
const DOM_HEIGHT = 286
var finalimgbase64 = 0
const TARGET_WIDTH = 1024
var Datee
var date
var month
var year
// height / width
const TARGET_RATIO = 0.5625
const MARGIN_WIDTH = 50
const MARGIN_HEIGHT = 80
const RADIUS = 6

const SHADOW_X = 0
const SHADOW_Y = 40
const SHADOW_BLUR = 50
const SHADOW_COLOR = "rgba(0,0,0,0.21)"

///以下OK!!!!!!///
function loadImage(file) {
  console.log(file)
  const image = document.getElementById("newimg")

  image.onload = function () {
    const src = cropImage(this)
    document.getElementById("card-image").src = src
  }

  image.src = window.URL.createObjectURL(file)
  // console.log(image.src)
}
///以上OK!!!!!!///

function cropImage(image) {
  const { width, height, cropX, cropY } = getCropArgs(image)

  const canvas = document.createElement("canvas")
  canvas.setAttribute("style", "display:'none';")
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext("2d")
  ctx.drawImage(image, cropX, cropY, width, height, 0, 0, width, height)
  // downLoadSRC = canvas.toDataURL()
  return canvas.toDataURL()
}

function getCropArgs(image) {
  let width = image.width
  let height = Math.round(width * TARGET_RATIO)
  let cropX = 0
  let cropY = Math.round((image.height - height) / 2)

  if (image.height < height) {
    height = image.height
    width = Math.round(height / TARGET_RATIO)
    cropX = Math.round((image.width - width) / 2)
    cropY = 0
  }

  return { width, height, cropX, cropY }
}

async function listenDownload() {
  const canvas = await generateScreenshot()
  document.getElementById("dl-node").href = canvas.toDataURL()
  finalimgbase64 = canvas.toDataURL()
  document.getElementById("dl-node").click()
}

function drawRoundedRec(origCanvas, scale) {
  const roundCanvas = document.createElement("canvas")
  roundCanvas.setAttribute("style", "display:'none';")

  roundCanvas.width = DOM_WIDTH * scale
  roundCanvas.height = DOM_HEIGHT * scale
  console.log(roundCanvas)
  const roundCtx = roundCanvas.getContext("2d")
  const roundRadius = RADIUS * scale
  const x1 = roundRadius
  const y1 = 0
  const x2 = x1 + roundCanvas.width - 2 * roundRadius
  const y2 = y1
  const x3 = x2 + roundRadius
  const y3 = roundRadius
  const x4 = x3
  const y4 = y3 + roundCanvas.height - 2 * roundRadius
  const x5 = x2
  const y5 = y4 + roundRadius
  const x6 = x1
  const y6 = y5
  const x7 = x6 - roundRadius
  const y7 = y4
  const x8 = x7
  const y8 = y3
  roundCtx.beginPath()
  roundCtx.moveTo(x1, y1)
  roundCtx.lineTo(x2, y2)
  roundCtx.quadraticCurveTo(x3, y2, x3, y3)
  roundCtx.lineTo(x4, y4)
  roundCtx.quadraticCurveTo(x4, y5, x5, y5)
  roundCtx.lineTo(x6, y6)
  roundCtx.quadraticCurveTo(x7, y6, x7, y7)
  roundCtx.lineTo(x8, y8)
  roundCtx.quadraticCurveTo(x8, y1, x1, y1)
  roundCtx.clip()
  roundCtx.drawImage(origCanvas, 0, 0)
  console.log(roundCanvas)
  return roundCanvas
}

function drawShadow(origCanvas) {
  const bgdCanvas = document.createElement("canvas")
  bgdCanvas.setAttribute("style", "display:'none';")

  bgdCanvas.width = origCanvas.width + MARGIN_WIDTH
  bgdCanvas.height = origCanvas.height + MARGIN_HEIGHT
  const ctx = bgdCanvas.getContext("2d")

  ctx.shadowOffsetX = SHADOW_X
  ctx.shadowOffsetY = SHADOW_Y
  ctx.shadowBlur = SHADOW_BLUR
  ctx.shadowColor = SHADOW_COLOR
  ctx.drawImage(origCanvas, MARGIN_WIDTH / 2, 0)

  return bgdCanvas
}

async function generateScreenshot() {
  const scale = getScale()
  const targetDommmm = document.getElementById("card")
  const origCanvas = await html2canvas(targetDommmm, { scale })
  const roundCanvas = drawRoundedRec(origCanvas, scale)
  console.log(drawShadow(roundCanvas))
  return drawShadow(roundCanvas)
}

function getScale() {
  if (TARGET_WIDTH > DOM_WIDTH) {
    console.log(Math.ceil(TARGET_WIDTH / DOM_WIDTH))
    return Math.ceil(TARGET_WIDTH / DOM_WIDTH)
  }
  return 1
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
        <p className="title">
          Appraisal Agency Upload Certificate to Bloackchain
        </p>
        <div>
          <div className="h100 row align-items-center justify-content-center">
            <div className="col-md-5 left-col">
              <p className="step">
                <b>Step1. 上傳產品圖、輸入產品資訊</b>
              </p>{" "}
              <br></br>
              <a>鑑定日期 : </a>
              <input
                id="title-input"
                className="title-input form-control form-control-lg"
                type="text"
                placeholder={
                  new Date().getFullYear() +
                  "/" +
                  (new Date().getMonth() + 1) +
                  "/" +
                  new Date().getDate()
                }
                onChange={() => {
                  const value = document.getElementById("title-input").value
                  document.getElementById("card-title").innerHTML = value
                }}
              />
              <a>商品名稱 : </a>
              <input
                id="title-input1"
                className="title-input form-control form-control-lg"
                type="text"
                placeholder="Product"
                onChange={() => {
                  const value = document.getElementById("title-input1").value
                  document.getElementById("card-title1").innerHTML = value
                }}
              />
              <div className="buttons">
                <div className="rel">
                  <button
                    id="file-btn"
                    type="button"
                    class="btn btn-outline-secondary btn-lg"
                  >
                    Choose File
                  </button>

                  <input
                    id="file-input"
                    className="file-input"
                    ref="file"
                    type="file"
                    accept="image/*"
                    name="file"
                    onChange={() => {
                      var file = this.refs.file.files[0] //讀取input file
                      loadImage(file)
                    }}
                  />
                </div>
                <div>
                  <button
                    type="button"
                    id="dl-btn"
                    className="btn btn-secondary btn-lg buttonupload"
                    onClick={listenDownload}
                  >
                    Donwload
                  </button>
                  <a id="dl-node" href="" download></a>
                </div>
              </div>
            </div>

            <div>
              <img id="newimg" style={{ display: "none" }} />
            </div>

            <div className="col-md-6 right-col">
              <div id="card" className="card">
                <img id="card-image" className="card-img-top" src={imgg}></img>
                <div className="card-body">
                  <img id="OKsign" className="isOksign" src={OKsign}></img>

                  <h5 id="card-title" className="card-title">
                    {new Date().getFullYear()}/{new Date().getMonth() + 1}/
                    {new Date().getDate()}
                  </h5>
                  <h5 id="card-title1" className="card-title">
                    Product
                  </h5>
                </div>
              </div>
            </div>

            <div>
              <br></br>
              <br></br>
              <Link to="/uploadAllOg">
                {" "}
                <button className="buttonupload">下一步上鏈</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default uploadAll
