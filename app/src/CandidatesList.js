import React from 'react';
import { newContextComponents } from '@drizzle/react-components';
import { useState, useEffect } from 'react';
import { Grid, List, ListItem } from '@material-ui/core';
import ProposalForm from './ProposalForm';
import Candidate from './Candidate';

const { ContractData } = newContextComponents;
export default ({ drizzle, drizzleState }) => {
  const [candidateDistrict, setCandidateDistrict] = useState(-1);
  const [candidates, setCandidates] = useState([]);
  const mainAccount = drizzleState.accounts[0];
  const contractMethods = drizzle.contracts.ProposalContract.methods;

  useEffect(() => {
    const canPropose = async () => {
      try {
        const owner = await contractMethods
          .getCandidateDistrict(mainAccount)
          .call();
        if (owner) return setCandidateDistrict(parseInt(owner));
        return setCandidateDistrict(-1);
      } catch {
        return setCandidateDistrict(-1);
      }
    };
    canPropose();
    // eslint-disable-next-line
  }, [contractMethods]);

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
            {candidateDistrict === -1 ? (
              <></>
            ) : (
              <ProposalForm
                drizzle={drizzle}
                drizzleState={drizzleState}
                candidateDistrict={candidateDistrict}
              ></ProposalForm>
            )}
          </Grid>
        </Grid>
      </div>
    </>
  );
};
