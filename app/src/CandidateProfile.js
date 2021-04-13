import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
} from '@material-ui/core';
import ProposalsList from './ProposalsList';
import { AppStateContext } from './AppStateProvider';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
});

export default ({ drizzle, drizzleState }) => {
  const { SetNotification, SetMessage } = React.useContext(AppStateContext);
  const { index } = useParams();
  const classes = useStyles();
  const [dataKey, setDataKey] = useState(null);
  var candidateInfo =
    drizzleState.contracts.ProposalContract.getCandidateByIndex;
  var methodArgs = [index];
  var contracts = drizzle.contracts;

  const updateCandidateRep = () => {
    //updateCandidateReputation;
    try {
      drizzle.contracts.ProposalContract.methods
        .updateCandidateReputation(index)
        .send()
        .then(() => {
          SetNotification('success');
          SetMessage(
            'La actualización de la reputación se ha realizado con éxito.'
          );
        })
        .catch(function (error) {
          if (error.code === -32603) {
            SetNotification('error');
            SetMessage(
              'La actualización de la reputación no pudo ser completada.'
            );
          } else {
            SetNotification('warning');
            SetMessage('Has cancelado la actualización de la reputación.');
          }
        });
    } catch (error) {
      SetNotification('error');
      SetMessage(
        'Hubo un error durante la actualización de la reputación, intenta más tarde.'
      );
      console.log('error');
    }
  };

  useEffect(() => {
    setDataKey(
      contracts['ProposalContract'].methods['getCandidateByIndex'].cacheCall(
        ...methodArgs
      )
    );
  }, [dataKey, contracts, methodArgs]);

  if (!(dataKey in candidateInfo)) {
    return <span>Fetching...</span>;
  }
  var candidate = candidateInfo[dataKey].value;
  const politicalParties = {
    0: 'PRI',
    1: 'PAN',
    2: 'PRD',
    3: 'PT',
  };
  return (
    <>
      <div className="section">
        <Grid container spacing={2}>
          <Grid
            item
            xs={6}
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
          >
            <Card className={classes.root}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  alt={`Partido ${politicalParties[candidate.party]}`}
                  height="140"
                  image="/static/images/cards/contemplative-reptile.jpg"
                  title={`Partido ${candidate.party}`}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {candidate.name}
                  </Typography>
                  <Typography variant="body1" component="h5">
                    Reputación : {candidate.reputation}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    Candidato por el partido
                    {politicalParties[candidate.party]} , desde el periodo{' '}
                    {candidate.starting_period}. Contacto en
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button variant="outlined">{candidate.email}</Button>
                <Button
                  variant="contained"
                  disableElevation
                  size="small"
                  color="primary"
                  onClick={updateCandidateRep}
                >
                  Actualizar reputación
                </Button>
              </CardActions>
            </Card>
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
            <ProposalsList
              drizzle={drizzle}
              drizzleState={drizzleState}
              indexCandidate={index}
            />
          </Grid>
        </Grid>
      </div>
    </>
  );
};
