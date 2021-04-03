import React from 'react';
import { newContextComponents } from '@drizzle/react-components';
import { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';

import VoteForm from './VoteForm.js';
import ProposalForm from './ProposalForm';

const { AccountData, ContractData } = newContextComponents;

export default ({ drizzle, drizzleState }) => {
  const [isOwner, setIsOwner] = useState(false);
  const [hash, setHash] = useState('');
  const mainAccount = drizzleState.accounts[0];
  const contractMethods = drizzle.contracts.ProposalContract.methods;

  useEffect(() => {
    const canVote = async () => {
      const owner = await contractMethods.owner().call();
      if (owner === undefined) return setIsOwner(true);
      else if (
        owner.value !== mainAccount &&
        owner.value !== 0x0 &&
        owner.value !== undefined
      )
        return setIsOwner(false);
      // if (
      //   (await drizzle.store.getState().contracts.ProposalContract.owner[
      //     keyValue
      //   ].value) !== drizzleState.accounts[0]
      // )
      //   return setIsOwner(false);
      return setIsOwner(true);
    };
    canVote();
  }, [contractMethods, mainAccount]);

  useEffect(() => {
    const getHash = async () => {
      //console.log(drizzle.store.getState().contracts);
      const docHash = await contractMethods.document_hash().call();
      setHash(docHash);
    };
    getHash();
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
            <h2>Información de la propuesta</h2>

            <p>
              <strong>Descripción: </strong>
              <ContractData
                drizzle={drizzle}
                drizzleState={drizzleState}
                contract="ProposalContract"
                method="proposal_description"
              />
            </p>
            <p>
              <strong>Dueño: </strong>
              <ContractData
                drizzle={drizzle}
                drizzleState={drizzleState}
                contract="ProposalContract"
                method="owner"
              />
            </p>
            <p>
              <strong>Hash del documento: </strong>
              <ContractData
                drizzle={drizzle}
                drizzleState={drizzleState}
                contract="ProposalContract"
                method="document_hash"
              />
            </p>
            <p>
              {hash.length === 0 ? (
                ''
              ) : (
                <a href={`https://ipfs.infura.io/ipfs/${hash}`}>
                  Consultar documento
                </a>
              )}
            </p>
            <p>
              <strong>Votos: </strong>
              <ContractData
                drizzle={drizzle}
                drizzleState={drizzleState}
                contract="ProposalContract"
                method="votes"
              />
            </p>
            <p>
              <strong>Reputación Actual: </strong>
              <ContractData
                drizzle={drizzle}
                drizzleState={drizzleState}
                contract="ProposalContract"
                method="proposal_reputation"
              />
            </p>
          </Grid>
          <Grid item xs={6}>
            {isOwner ? (
              <></>
            ) : (
              <VoteForm
                drizzle={drizzle}
                drizzleState={drizzleState}
              ></VoteForm>
            )}
          </Grid>
        </Grid>

        <ProposalForm
          drizzle={drizzle}
          drizzleState={drizzleState}
        ></ProposalForm>
      </div>
    </div>
  );
};
