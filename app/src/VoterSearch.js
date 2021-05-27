import React from "react";
import { useState, useEffect } from "react";
import { Grid, CircularProgress, Button } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { AppStateContext } from "./AppStateProvider";
import { FormControl, InputLabel } from "@material-ui/core";

import Autocomplete from "@material-ui/core/Autocomplete";
export default ({ drizzle, drizzleState }) => {
  const { SetNotification, SetMessage } = React.useContext(AppStateContext);

  const [dataKey, setDataKey] = useState(null);

  const [electionKey, setElectionKey] = useState("");
  const [touched, setTouched] = useState({
    electionKey: false,
  });
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

  const check = () => {
    if (voters.indexOf(electionKey) > -1) {
      SetNotification("success");
      SetMessage(
        "Esta clave de elector ha sido registrada, puede participar en la votación de propuestas"
      );
    } else {
      SetNotification("warning");
      SetMessage(
        "Esta clave de elector no ha sido registrada, favor de contactar al administrador"
      );
    }
  };
  return (
    <>
      <Grid container spacing={2}>
        <Grid item>
          {voters.length > 0 ? (
            <>
              <FormControl component="fieldset">
                <h2>Consulta de votantes registrados</h2>

                <FormControl variant="outlined" fullWidth={true}>
                  <TextField
                    sx={{ mb: 2 }}
                    label="Clave de elector"
                    id="electionKey"
                    name="electionKey"
                    type="text"
                    value={electionKey}
                    onChange={(event) => {
                      setTouched((touched) => ({
                        ...touched,
                        electionKey: true,
                      }));
                      setElectionKey(event.target.value.toUpperCase());
                    }}
                    error={
                      (electionKey.length === 0 ||
                        electionKey === undefined ||
                        electionKey.length !== 18) &&
                      touched["electionKey"]
                        ? true
                        : false
                    }
                    helperText={
                      (electionKey.length === 0 ||
                        electionKey === undefined ||
                        electionKey.length !== 18) &&
                      touched["electionKey"]
                        ? "Agrega una clave de elector válida"
                        : ""
                    }
                  />
                </FormControl>

                <Button sx={{ mt: 1 }} onClick={check} variant="contained">
                  Consultar
                </Button>
              </FormControl>
            </>
          ) : (
            <h2>No hay votantes registrados</h2>
          )}
        </Grid>
      </Grid>
    </>
  );
};
