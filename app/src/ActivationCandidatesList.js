import React from 'react';
import { useState, useEffect } from 'react';
import { Grid, List, CircularProgress } from '@material-ui/core';
import ActivationCandidate from './ActivationCandidate';
import ActivationDialog from './ActivationDialog';

export default ({ drizzle, drizzleState }) => {
  const [dataKey, setDataKey] = useState(null);
  const [currentCandidate, setCurrentCandidate] = useState([]);
  const [open, setOpen] = useState(false);

  var candidatesInfo = drizzleState.contracts.ProposalContract.getAllCandidates;

  var methodArgs = [];
  var contracts = drizzle.contracts;

  useEffect(() => {
    setDataKey(
      contracts['ProposalContract'].methods['getAllCandidates'].cacheCall(
        ...methodArgs
      )
    );
    // eslint-disable-next-line
  }, [dataKey]);

  if (!(dataKey in candidatesInfo)) {
    return <CircularProgress />;
  }
  var candidates = candidatesInfo[dataKey].value;
  return (
    <>
      <div className="section">
        <Grid container spacing={2}>
          <Grid>
            {candidates.length > 0 ? (
              <>
                <h2>Candidatos registrados</h2>
                <List style={{ maxHeight: 500, overflow: 'auto' }}>
                  {candidates.map((candidatesInfo, i) => (
                    <ActivationCandidate
                      candidateInfo={candidatesInfo}
                      key={i}
                      handleOpen={() => {
                        setOpen(true);
                        setCurrentCandidate(candidatesInfo);
                      }}
                    />
                  ))}
                </List>
              </>
            ) : (
              <h2>No hay candidatos registrados</h2>
            )}
          </Grid>
        </Grid>
      </div>
      <ActivationDialog
        drizzle={drizzle}
        drizzleState={drizzleState}
        open={open}
        handleClose={() => {
          setOpen(false);
          setCurrentCandidate([]);
        }}
        currentCandidate={currentCandidate}
      />
    </>
  );
};
