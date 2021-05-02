import React from "react";
import { newContextComponents } from "@drizzle/react-components";
import { useState, useEffect } from "react";
import { Grid, List, ListItem, Alert } from "@material-ui/core";
import VotersAutocomplete from "./VotersAutocomplete";

import ProposalForm from "./ProposalForm";
import Candidate from "./Candidate";

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

  var candidatesInfo =
    drizzleState.contracts.ProposalContract.getAllActiveCandidates;
  useEffect(() => {
    const getCandidates = () => {
      if ("0x0" in candidatesInfo) setCandidates(candidatesInfo["0x0"].value);
    };
    getCandidates();
  }, [candidatesInfo]);

  return (
    <>
      <div className="section">
        <ListItem style={{ display: "none" }}>
          <ContractData
            drizzle={drizzle}
            drizzleState={drizzleState}
            contract="ProposalContract"
            method="getAllActiveCandidates"
          />
        </ListItem>
      </div>

      <div className="section">
        <Grid container spacing={4}>
          <Grid item xs={6}>
            <h2>Candidatos en contienda</h2>
            <Alert severity="info" sx={{ mt: 3, mb: 3 }}>
              Recuerda que para visualziar las propuestas de los candidatos hay
              que realizar un click en su perfil.
            </Alert>
            <List style={{ maxHeight: 700, overflow: "auto" }}>
              {candidates.map((candidateInfo, i) => {
                if (candidateInfo.active)
                  return <Candidate candidateInfo={candidateInfo} key={i} />;
                return <></>;
              })}
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
              <>
                <VotersAutocomplete
                  drizzle={drizzle}
                  drizzleState={drizzleState}
                />
              </>
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
