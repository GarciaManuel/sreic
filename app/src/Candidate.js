import React from 'react';
import {
  Divider,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
} from '@material-ui/core';
import { Link } from 'react-router-dom';

export default ({ candidateInfo }) => {
  const politicalParties = {
    0: 'PRI',
    1: 'PAN',
    2: 'PRD',
    3: 'PT',
  };
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
                  Distrito : {candidateInfo.district}
                </Typography>
                {'   -    Candidat@ para el partido ' +
                  politicalParties[candidateInfo.party] +
                  ' desde el periodo ' +
                  candidateInfo.starting_period +
                  ', con  ' +
                  candidateInfo.proposalsIndex.length +
                  ' propuestas. Contactal@ en ' +
                  candidateInfo.email}
              </React.Fragment>
            }
          />
        </ListItem>
      </ListItem>
    </>
  );
};
