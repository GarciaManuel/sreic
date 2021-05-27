import React from "react";
import {
  Divider,
  ListItem,
  ListItemText,
  Typography,
  Button,
  Grid,
} from "@material-ui/core";

export default ({ proposalInfo, handleOpen }) => {
  var proposalDistrict = " Enfocada al distrito " + proposalInfo.district;
  if (proposalInfo.district === "0")
    proposalDistrict = " Enfocada a todo el estado";
  console.log(proposalInfo);
  return (
    <>
      <Divider variant="inset" component="li" />
      <Grid alignItems="flex-start">
        <ListItem>
          <ListItemText
            primary={
              <React.Fragment>
                <a
                  href={`https://ipfs.infura.io/ipfs/${proposalInfo.documentHash}`}
                >
                  {proposalInfo.name}{" "}
                </a>{" "}
                - {proposalInfo.period}
              </React.Fragment>
            }
            secondary={
              <React.Fragment>
                <Typography
                  component="span"
                  variant="body2"
                  color="textPrimary"
                >
                  Reputación : {proposalInfo.reputation}
                </Typography>
                {"   -   " +
                  proposalInfo.description +
                  proposalDistrict +
                  ". Han participado  " +
                  proposalInfo.votes +
                  " ciudadanos en la votación."}
              </React.Fragment>
            }
          />
        </ListItem>
        <ListItem>
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Votar
          </Button>
        </ListItem>
      </Grid>
    </>
  );
};
