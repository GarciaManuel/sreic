import React from 'react';
import { useState, useEffect } from 'react';
import { Grid, CircularProgress } from '@material-ui/core';
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/core/Autocomplete";
export default ({ drizzle, drizzleState }) => {
  const [dataKey, setDataKey] = useState(null);
  const top100Films = [
    { title: "The Shawshank Redemption", year: 1994 },
    { title: "3 Idiots", year: 2009 },
    { title: "Monty Python and the Holy Grail", year: 1975 }
  ];
  var votersInfo = drizzleState.contracts.ProposalContract.getAllVoters;

  var methodArgs = [];
  var contracts = drizzle.contracts;

  useEffect(() => {
    setDataKey(
      contracts['ProposalContract'].methods['getAllVoters'].cacheCall(
        ...methodArgs
      )
    );
    // eslint-disable-next-line
  }, [dataKey]);

  if (!(dataKey in votersInfo)) {
    return <CircularProgress />;
  }
  var voters = votersInfo[dataKey].value;
  console.log(voters, votersInfo, dataKey)
  if(voters === null)
  return <></> 
  return (
    <>
      <div className="section">
        <Grid container spacing={2}>
          <Grid>
            {voters.length > 0 ? (
              <>
                <h2>Votantes registrados</h2>
                {/* <List style={{ maxHeight: 500, overflow: 'auto' }}>
                  {voters.map((votersInfo, i) => (
                    <ActivationCandidate
                      candidateInfo={votersInfo}
                      key={i}
                      handleOpen={() => {
                        setOpen(true);
                        setCurrentCandidate(votersInfo);
                      }}
                    />
                  ))}
                </List> */}
                <Autocomplete
      id="combo-box-demo"
      options={top100Films}
      getOptionLabel={(option) => option.title}
      style={{ width: 300 }}
      renderInput={(params) => (
        <TextField {...params} label="Clave electoral" variant="outlined" />
      )}
      open={true}
    />
              </>
            ) : (
              <h2>No hay votantes registrados</h2>
            )}
          </Grid>
        </Grid>
      </div>
    </>
  );
};
