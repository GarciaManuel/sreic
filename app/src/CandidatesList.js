import React from 'react';
import { newContextComponents } from '@drizzle/react-components';
import { useState, useEffect } from 'react';
import { Grid, List, ListItem } from '@material-ui/core';
import ProposalForm from './ProposalForm';
import Candidate from './Candidate';

const { AccountData, ContractData } = newContextComponents;

export default ({ drizzle, drizzleState }) => {
  const [isCandidate, setIsCandidate] = useState(false);
  const [candidates, setCandidates] = useState([]);
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
    const canPropose = async () => {
      const owner = await contractMethods.isCandidate(mainAccount).call();
      if (owner === true) return setIsCandidate(true);
      return setIsCandidate(false);
    };
    canPropose();
  }, [contractMethods, mainAccount]);

  var candidatesInfo = drizzleState.contracts.ProposalContract.getAllCandidates;
  useEffect(() => {
    const getCandidates = () => {
      //const candidates = await contractMethods.getAllCandidates().call();
      if ('0x0' in candidatesInfo) setCandidates(candidatesInfo['0x0'].value);
    };
    getCandidates();
  }, [candidatesInfo]);
  return (
    <>
      <div className="section">
        <h2>Cuenta activa </h2>
        <AccountData
          drizzle={drizzle}
          drizzleState={drizzleState}
          accountIndex={0}
          units="ether"
          precision={3}
        />
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
