import { HashRouter, Route, Switch } from 'react-router-dom'
import './App.css';
import Menu from "./components/Menu";
import SubmitForm from "./components/SubmitForm";
import Result from "./components/Result";
import Signin from "./components/Signin";
import Login from "./components/Login";

function App() {
  return (
    <HashRouter>
      <div className="App">
        <Menu accessToken={localStorage.getItem("access_token")} />
        <br />
        <div className="container" >
          <Switch>
            <Route exact path="/" component={SubmitForm} />
            <Route exact path="/result" component={Result} />
            <Route exact path="/signin" component={Signin} />
            <Route exact path="/login" component={Login} />
          </Switch>
        </div>
      </div>
    </HashRouter>
  );
}

export default App;
