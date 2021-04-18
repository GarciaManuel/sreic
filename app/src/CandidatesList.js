import React from 'react';
import { newContextComponents } from '@drizzle/react-components';
import { useState, useEffect } from 'react';
import { Grid, List, ListItem } from '@material-ui/core';
import ProposalForm from './ProposalForm';
import Candidate from './Candidate';

const { ContractData } = newContextComponents;
export default ({ drizzle, drizzleState }) => {
  const [isCandidate, setIsCandidate] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const mainAccount = drizzleState.accounts[0];
  const contractMethods = drizzle.contracts.ProposalContract.methods;

  useEffect(() => {
    const canPropose = async () => {
      try {
        const owner = await contractMethods.isCandidate(mainAccount).call();
        if (owner === true) return setIsCandidate(true);
        return setIsCandidate(false);
      } catch {
        return setIsCandidate(false);
      }
    };
    canPropose();
  }, [contractMethods, mainAccount]);

  var candidatesInfo = drizzleState.contracts.ProposalContract.getAllCandidates;
  useEffect(() => {
    const getCandidates = () => {
      if ('0x0' in candidatesInfo) setCandidates(candidatesInfo['0x0'].value);
    };
    getCandidates();
  }, [candidatesInfo]);
  return (
    <>
      <div className="section">
        <ListItem style={{ display: 'none' }}>
          <ContractData
            drizzle={drizzle}
            drizzleState={drizzleState}
            contract="ProposalContract"
            method="getAllCandidates"
          />
        </ListItem>
      </div>

      <div className="section">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <h2>Candidatos en contienda</h2>
            <List style={{ maxHeight: 500, overflow: 'auto' }}>
              {candidates.map((candidateInfo, i) => (
                <Candidate candidateInfo={candidateInfo} key={i} />
              ))}
            </List>
          </Grid>
          <Grid
            item
            xs={6}
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
          >
            {!isCandidate ? (
              <></>
            ) : (
              <ProposalForm
                drizzle={drizzle}
                drizzleState={drizzleState}
              ></ProposalForm>
            )}
          </Grid>
        </Grid>
      </div>
    </>
  );
};
