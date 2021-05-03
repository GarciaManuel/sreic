import React from "react";
import {
  Divider,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import politicalParties from "./PoliticalParties";

export default ({ candidateInfo }) => {
  var district = "";
  if (candidateInfo.district === "0") {
    district = "Candidat@ a gobernatura";
  } else {
    district = "Distrito " + candidateInfo.district;
  }
  return (
    <>
      <Divider variant="inset" component="li" />
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt={candidateInfo.name} />
        </ListItemAvatar>
        <ListItem component={Link} to={`/candidate/${candidateInfo.index}`}>
          <ListItemText
            primary={candidateInfo.name}
            secondary={
              <React.Fragment>
                <Typography
                  component="span"
                  variant="body2"
                  color="textPrimary"
                >
                  {district}
                </Typography>
                {"   -    Candidat@ para el partido " +
                  politicalParties[candidateInfo.party] +
                  " desde el periodo " +
                  candidateInfo.startingPeriod +
                  ", con  " +
                  candidateInfo.proposalsIndex.length +
                  " propuestas. Contactal@ en " +
                  candidateInfo.email}
              </React.Fragment>
            }
          />
        </ListItem>
      </ListItem>
    </>
  );
};
