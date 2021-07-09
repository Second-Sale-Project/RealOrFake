import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import Upload from "./upload"
import uploadEth from "./uploadEth"
import uploadAll from "./uploadAll"

import { BrowserRouter, Route } from "react-router-dom"
import reportWebVitals from "./reportWebVitals"

ReactDOM.render(
  <BrowserRouter>
    <Route exact path="/" component={App}></Route>
    <Route path="/upload" component={Upload}></Route>
    <Route path="/uploadEth" component={uploadEth}></Route>
    <Route path="/uploadAll" component={uploadAll}></Route>
  </BrowserRouter>,
  document.getElementById("root")
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
