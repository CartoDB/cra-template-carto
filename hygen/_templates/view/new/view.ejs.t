---
to: <%= view_path %>/<%= h.changeCase.pascalCase(name) %>.js
---
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {

  }
}));

export default function <%= h.changeCase.pascalCase(name) %>() {
  const classes = useStyles();

  // [hygen] Add useEffect

  return (
    <Grid container direction='row' className={classes.root}>
      <Grid item>
        Hello World
      </Grid>
    </Grid>
  );
};
