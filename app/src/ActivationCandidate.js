import React from "react";
import {
  Divider,
  ListItem,
  ListItemText,
  Typography,
  Button,
  Grid,
} from "@material-ui/core";
import politicalParties from "./PoliticalParties";
import { Link } from "react-router-dom";

export default ({ candidateInfo, handleOpen }) => {
  var district = "";
  if (candidateInfo === undefined) {
    return <></>;
  }
  if (candidateInfo.district === "0") {
    district = "Candidat@ a gobernatura";
  } else {
    district = "Distrito " + candidateInfo.district;
  }
  return (
    <>
      <Divider variant="inset" component="li" />
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <ListItemText
            primary={
              <React.Fragment>
                <Link to={`/candidate/${candidateInfo.index}`}>
                  {candidateInfo.name}
                </Link>
              </React.Fragment>
            }
            secondary={
              <React.Fragment>
                <Typography
                  component="span"
                  variant="body2"
                  color="textPrimary"
                >
                  Partido : {politicalParties[candidateInfo.party]} - {district}
                </Typography>
                {"     " +
                  "Con  " +
                  candidateInfo.proposalsIndex.length +
                  " propuestas."}
              </React.Fragment>
            }
          />
        </Grid>
        <Grid item xs={4}>
          <ListItem>
            {!candidateInfo.active ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpen}
                fullWidth={true}
              >
                Activar
              </Button>
            ) : (
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleOpen}
                fullWidth={true}
              >
                Desactivar
              </Button>
            )}
          </ListItem>
        </Grid>
      </Grid>
    </>
  );
};
