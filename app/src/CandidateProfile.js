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

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
});

export default ({ drizzle, drizzleState }) => {
  const { index } = useParams();
  const classes = useStyles();
  const [dataKey, setDataKey] = useState(null);
  var candidateInfo =
    drizzleState.contracts.ProposalContract.getCandidateByIndex;
  var methodArgs = [index];
  var contracts = drizzle.contracts;

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
                  alt={`Partido ${candidate.party}`}
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
                    Candidato por el partido {candidate.party} , desde el
                    periodo {candidate.starting_period}. Contacto en
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button size="large" color="primary">
                  {candidate.email}
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
