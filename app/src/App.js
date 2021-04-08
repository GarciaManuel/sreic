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
    <AppStateProvider>
      <DrizzleContext.Provider drizzle={drizzle}>
        <DrizzleContext.Consumer>
          {(drizzleContext) => {
            const { drizzle, drizzleState, initialized } = drizzleContext;

            if (!initialized) {
              return 'Loading...';
            }

            return (
              <div className="App">
                <div className="section">
                  <Router>
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
                  </Router>
                  {/* <MyComponent drizzle={drizzle} drizzleState={drizzleState} /> */}
                </div>
              </div>
            );
          }}
        </DrizzleContext.Consumer>
      </DrizzleContext.Provider>
    </AppStateProvider>
  );
};

export default App;
