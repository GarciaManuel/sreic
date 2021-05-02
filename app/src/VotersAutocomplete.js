import React from "react";
import { useState, useEffect } from "react";
import { Grid, CircularProgress } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/core/Autocomplete";
export default ({ drizzle, drizzleState }) => {
  const [dataKey, setDataKey] = useState(null);
  var votersInfo = drizzleState.contracts.ProposalContract.getAllVoters;

  var methodArgs = [];
  var contracts = drizzle.contracts;

  useEffect(() => {
    setDataKey(
      contracts["ProposalContract"].methods["getAllVoters"].cacheCall(
        ...methodArgs
      )
    );
    // eslint-disable-next-line
  }, [dataKey]);

  if (!(dataKey in votersInfo)) {
    return <CircularProgress />;
  }
  var voters = votersInfo[dataKey].value;
  if (voters === null) return <></>;
  return (
    <>
      <Grid container spacing={2}>
        <Grid item>
          {voters.length > 0 ? (
            <>
              <h2>Votantes registrados</h2>
              <Autocomplete
                id="votersKeys"
                options={voters}
                style={{ width: 300 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Clave electoral"
                    variant="outlined"
                  />
                )}
              />
            </>
          ) : (
            <h2>No hay votantes registrados</h2>
          )}
        </Grid>
      </Grid>
    </>
  );
};
