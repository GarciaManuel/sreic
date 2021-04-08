import React from 'react';
import { useState, useEffect } from 'react';
import { Grid, List } from '@material-ui/core';
import Proposal from './Proposal';
import VoteDialog from './VoteDialog';

export default ({ drizzle, drizzleState, indexCandidate }) => {
  const [dataKey, setDataKey] = useState(null);
  const [currentProposal, setCurrentProposal] = useState([]);
  const [open, setOpen] = useState(false);

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
  //   useEffect(() => {
  //     const canPropose = async () => {
  //       const owner = await contractMethods.isCandidate(mainAccount).call();
  //       console.log(owner, mainAccount, drizzleState.accounts);
  //       if (owner === true) return setIsCandidate(true);
  //       return setIsCandidate(false);
  //     };
  //     canPropose();
  //   }, [contractMethods, mainAccount]);

  var proposalsInfo =
    drizzleState.contracts.ProposalContract.getProposalsByCandidate;

  var methodArgs = [indexCandidate];
  var contracts = drizzle.contracts;

  useEffect(() => {
    setDataKey(
      contracts['ProposalContract'].methods[
        'getProposalsByCandidate'
      ].cacheCall(...methodArgs)
    );
  }, [dataKey, contracts, methodArgs]);

  if (!(dataKey in proposalsInfo)) {
    return <span>Fetching...</span>;
  }
  var proposals = proposalsInfo[dataKey].value;
  return (
    <>
      <div className="section">
        <Grid container spacing={2}>
          <Grid>
            <h2>Propuestas del candidato</h2>
            <List style={{ maxHeight: 500, overflow: 'auto' }}>
              {proposals.map((proposalInfo, i) => (
                <Proposal
                  proposalInfo={proposalInfo}
                  key={i}
                  handleOpen={() => {
                    setOpen(true);
                    setCurrentProposal(proposalInfo);
                  }}
                />
              ))}
            </List>
          </Grid>
        </Grid>
      </div>
      <VoteDialog
        drizzle={drizzle}
        drizzleState={drizzleState}
        open={open}
        handleClose={() => {
          setOpen(false);
          setCurrentProposal([]);
        }}
        currentProposal={currentProposal}
      />
    </>
  );
};
