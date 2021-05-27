import React from 'react';
import { useState } from 'react';
import { Button, Grid } from '@material-ui/core';
import VotersForm from './VotersForm';
import CandidateForm from './CandidateForm';
import ActivationCandidatesList from './ActivationCandidatesList';
import VotersAutocomplete from './VotersAutocomplete';
export default ({ drizzle, drizzleState }) => {
  const [renderForm, setRenderForm] = useState(0);
  
  return (
    <>
      <div className="section">
        <h2>Bienvenido administrador</h2>
        <h4>
          Podra gestionar candidatos y votantes para las elecciones locales
        </h4>
        <Button
          variant="contained"
          disableElevation
          size="small"
          color="primary"
          sx={{ mr: 1 }}
          onClick={() => {
            setRenderForm(1);
          }}
        >
          Candidatos
        </Button>
        <Button
          variant="contained"
          disableElevation
          size="small"
          color="primary"
          sx={{ ml: 1 }}
          onClick={() => {
            setRenderForm(2);
          }}
        >
          Votantes
        </Button>
        <Grid container spacing={2} sx={{ mt: 3 }}>
          {renderForm === 1 ? (
            <>
              <Grid item xs={6}>
                <CandidateForm drizzle={drizzle} drizzleState={drizzleState} />
              </Grid>
              <Grid item xs={6}>
                <ActivationCandidatesList
                  drizzle={drizzle}
                  drizzleState={drizzleState}
                />
              </Grid>
            </>
          ) : (
            ''
          )}

          {renderForm === 2 ? (
            <>
            <Grid
            item
            xs={12}
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
          >
            <VotersAutocomplete drizzle={drizzle} drizzleState={drizzleState} />
          </Grid>

            <Grid
              item
              xs={12}
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justify="center"
            >
              <VotersForm drizzle={drizzle} drizzleState={drizzleState} />
            </Grid>
            </>
          ) : (
            ''
          )}
        </Grid>
      </div>
    </>
  );
};
