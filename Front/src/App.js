import { HashRouter, Route, Switch } from 'react-router-dom'
import './App.css';
import Menu from "./components/Menu";
import Submits from "./pages/submit/Submits";
import Result from "./pages/result/Result";
import Signin from "./pages/signin/Signin";
import Login from "./pages/login/Login";
import Account from "./pages/account/Account";

function App() {
  return (
    <HashRouter>
      <div className="App">
        <Menu />
        <br />
        <div className="container" >
          <Switch>
            <Route exact path="/" component={Submits} />
            <Route exact path="/result" component={Result} />
            <Route exact path="/signin" component={Signin} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/account" component={Account} />
          </Switch>
        </div>
      </div>
    </HashRouter>
  );
}

export default App;
