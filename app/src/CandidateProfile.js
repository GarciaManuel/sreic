import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  CircularProgress,
} from "@material-ui/core";
import ProposalsList from "./ProposalsList";
// import { AppStateContext } from './AppStateProvider';
import politicalParties from "./PoliticalParties";

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
});

export default ({ drizzle, drizzleState }) => {
  // const { SetNotification, SetMessage } = React.useContext(AppStateContext);
  const { index } = useParams();
  const classes = useStyles();
  const [dataKey, setDataKey] = useState(null);
  var candidateInfo =
    drizzleState.contracts.ProposalContract.getCandidateByIndex;
  var methodArgs = [index];
  var contracts = drizzle.contracts;

  // const updateCandidateRep = () => {
  //   //updateCandidateReputation;
  //   try {
  //     drizzle.contracts.ProposalContract.methods
  //       .updateCandidateReputation(index)
  //       .send()
  //       .then(() => {
  //         SetNotification('success');
  //         SetMessage(
  //           'La actualización de la reputación se ha realizado con éxito.'
  //         );
  //       })
  //       .catch(function (error) {
  //         if (error.code === -32603) {
  //           SetNotification('error');
  //           SetMessage(
  //             'La actualización de la reputación no pudo ser completada.'
  //           );
  //         } else {
  //           SetNotification('warning');
  //           SetMessage('Has cancelado la actualización de la reputación.');
  //         }
  //       });
  //   } catch (error) {
  //     SetNotification('error');
  //     SetMessage(
  //       'Hubo un error durante la actualización de la reputación, intenta más tarde.'
  //     );
  //     console.log('error');
  //   }
  // };

  useEffect(() => {
    setDataKey(
      contracts["ProposalContract"].methods["getCandidateByIndex"].cacheCall(
        ...methodArgs
      )
    );
    // eslint-disable-next-line
  }, [dataKey, methodArgs]);

  if (!(dataKey in candidateInfo)) {
    return <CircularProgress />;
  }
  var candidate = candidateInfo[dataKey].value;
  if (candidate === null) {
    return <p>Candidato inexistente</p>;
  }
  var district = "";
  if (candidate.district === "0") {
    district = "Candidat@ a gobernatura";
  } else {
    district = "Distrito " + candidate.district;
  }
  return (
    <>
      {!candidate.active ? (
        <p>Candidato no activo</p>
      ) : (
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
                    src={`/images/politicalParties/${
                      politicalParties[candidate.party]
                    }.png`}
                    title={`Partido ${candidate.party}`}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      {candidate.name}
                    </Typography>
                    <Typography variant="body1" component="h5">
                      {district}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      Candidato por el partido{" "}
                      {politicalParties[candidate.party]} , desde el periodo{" "}
                      {candidate.startingPeriod}. Contacto en:
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      {" "}
                      <Button
                        variant="contained"
                        disableElevation
                        size="small"
                        color="primary"
                        fullWidth={true}
                        onClick={() => {
                          window.location = "mailto:" + candidate.email;
                        }}
                      >
                        {candidate.email}
                      </Button>
                    </Grid>
                    {/* <Grid item xs={12}>
                    <Button
                      variant="contained"
                      disableElevation
                      size="small"
                      color="primary"
                      onClick={updateCandidateRep}
                      fullWidth={true}
                    >
                      Actualizar reputación
                    </Button>
                  </Grid> */}
                  </Grid>
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
      )}
    </>
  );
};
