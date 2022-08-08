import React from "react";
import { Provider } from "react-redux";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

//redux
import store from "./store";
import { userPing } from "./slices/usersSlice";
import { getRecipeOptions } from "./slices/filtersSlice";

store.dispatch(getRecipeOptions());
store.dispatch(userPing());

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js");
}
