import React from 'react';
import { useEffect } from 'react';
import { DrizzleContext } from '@drizzle/react-plugin';
import { Drizzle } from '@drizzle/store';
import drizzleOptions from './drizzleOptions';
import AppStateProvider from './AppStateProvider';
import './App.css';
import CandidatesList from './CandidatesList';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import CandidateProfile from './CandidateProfile';
import Navbar from './Navbar';
import Admin from './Admin';

const drizzle = new Drizzle(drizzleOptions);
const App = () => {
  useEffect(() => {
    async function fetchWallet() {
      // You can await here
      try {
        await window.ethereum.enable();
      } catch (e) {
        console.log('User refused access :(', e);
      }
      // ...
    }
    fetchWallet();
  }, []);
  return (
    <DrizzleContext.Provider drizzle={drizzle}>
      <DrizzleContext.Consumer>
        {(drizzleContext) => {
          const { drizzle, drizzleState, initialized } = drizzleContext;

          if (!initialized) {
            return 'Loading...';
          }

          return (
            <>
              <Router>
                <Navbar drizzle={drizzle} drizzleState={drizzleState} />
                <AppStateProvider>
                  <div className="App">
                    <div className="section">
                      <Route exact path={`/`}>
                        <CandidatesList
                          drizzle={drizzle}
                          drizzleState={drizzleState}
                        />
                      </Route>
                      <Route path={`/candidate/:index`}>
                        <CandidateProfile
                          drizzle={drizzle}
                          drizzleState={drizzleState}
                        />
                      </Route>
                      <Route path={`/admin`}>
                        <Admin drizzle={drizzle} drizzleState={drizzleState} />
                      </Route>
                      {/* <MyComponent drizzle={drizzle} drizzleState={drizzleState} /> */}
                    </div>
                  </div>
                </AppStateProvider>
              </Router>
            </>
          );
        }}
      </DrizzleContext.Consumer>
    </DrizzleContext.Provider>
  );
};

export default App;
