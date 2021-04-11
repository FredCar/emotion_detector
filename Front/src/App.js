import { HashRouter, Route, Switch } from 'react-router-dom'
import './App.css';
import Menu from "./components/Menu";
import SubmitForm from "./components/SubmitForm";
import Result from "./components/Result";

function App() {
  return (
    <HashRouter>
      <div className="App">
        <Menu />
        <br />
        <Switch>
          <Route exact path="/" component={SubmitForm} />
          <Route exact path="/result" component={Result} />
        </Switch>
      </div>
    </HashRouter>
  );
}

export default App;
