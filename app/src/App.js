import React from 'react';
import { useEffect } from 'react';
import { DrizzleContext } from '@drizzle/react-plugin';
import { Drizzle } from '@drizzle/store';
import drizzleOptions from './drizzleOptions';
import MyComponent from './MyComponent';
import AppStateProvider from './AppStateProvider';
import './App.css';
import ProposalForm from './ProposalForm';
import CandidatesList from './CandidatesList';

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
              // <MyComponent drizzle={drizzle} drizzleState={drizzleState} />
              <CandidatesList drizzle={drizzle} drizzleState={drizzleState} />
            );
          }}
        </DrizzleContext.Consumer>
      </DrizzleContext.Provider>
    </AppStateProvider>
  );
};

export default App;
