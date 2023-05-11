import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import routerPath from '@/libraries/routerPath';
import 'normalize.css';
import '@/stylesheet/app.scss';

const App = () => {
  return (
    <BrowserRouter basename={process.env.PUBLIC_PATH}>
      <Route exact path={routerPath.ROOT}>
        <div className='app'>HI</div>
      </Route>
    </BrowserRouter>
  );
};

export default App;
