import React from 'react';
import { newContextComponents } from '@drizzle/react-components';
import { useState, useEffect } from 'react';
import { Grid, List } from '@material-ui/core';
import ProposalForm from './ProposalForm';
import Candidate from './Candidate';

const { AccountData, ContractData } = newContextComponents;

export default ({ drizzle, drizzleState }) => {
  const [isOwner, setIsOwner] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [hash, setHash] = useState('');
  const mainAccount = drizzleState.accounts[0];
  const contractMethods = drizzle.contracts.ProposalContract.methods;

  // useEffect(() => {
  //   const canVote = async () => {
  //     const owner = await contractMethods.owner().call();
  //     if (owner === undefined) return setIsOwner(true);
  //     else if (
  //       owner.value !== mainAccount &&
  //       owner.value !== 0x0 &&
  //       owner.value !== undefined
  //     )
  //       return setIsOwner(false);
  //     // if (
  //     //   (await drizzle.store.getState().contracts.ProposalContract.owner[
  //     //     keyValue
  //     //   ].value) !== drizzleState.accounts[0]
  //     // )
  //     //   return setIsOwner(false);
  //     return setIsOwner(true);
  //   };
  //   canVote();
  // }, [contractMethods, mainAccount]);

  useEffect(() => {
    const getCadidates = async () => {
      //console.log(drizzle.store.getState().contracts);
      const candidates = await contractMethods.getAllCandidates().call();
      console.log(candidates);
      setCandidates(candidates);
    };
    getCadidates();
  }, [contractMethods]);

  return (
    <div className="App">
      <div className="section">
        <h2>Cuenta activa </h2>
        <AccountData
          drizzle={drizzle}
          drizzleState={drizzleState}
          accountIndex={0}
          units="ether"
          precision={3}
        />
      </div>

      <div className="section">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <h2>Candidatos en contienda</h2>
            <List>
              {candidates.map((candidateInfo, i) => (
                <Candidate candidateInfo={candidateInfo} key={i} />
              ))}
            </List>
            {/* <p>
              <strong>Descripción: </strong>
              <ContractData
                drizzle={drizzle}
                drizzleState={drizzleState}
                contract="ProposalContract"
                method="proposal_description"
              />
            </p> */}
          </Grid>
          <Grid item xs={6}>
            <ProposalForm
              drizzle={drizzle}
              drizzleState={drizzleState}
            ></ProposalForm>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};
