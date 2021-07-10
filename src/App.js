import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'

import './App.css';
import Details from './Components/Details';

import Header from './Components/Header';
import Home from './Components/Home';
import Login from './Components/Login';

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/home" component={Home} />
          <Route path="/detail/:id" component={Details} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
