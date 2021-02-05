import { useSelector } from 'react-redux';
import { Grid, Typography, makeStyles } from '@material-ui/core';
import rgbToHex from 'utils/rgbToHex';
import { CATEGORY_COLORS } from 'components/layers/StoresLayer';

const useStyles = makeStyles((theme) => ({
  title: {
    display: 'block',
    marginBottom: theme.spacing(1),
  },

  element: {
    ...theme.typography.overline,
    textTransform: 'none',
    color: theme.palette.text.secondary,
    padding: theme.spacing(0.25, 0),
  },

  dot: {
    flex: '0 0 auto',
    borderRadius: '50%',
    width: 8,
    height: 8,
    marginRight: theme.spacing(1),
  },
}));

function StoresLegend() {
  const classes = useStyles();
  const { storesLayer } = useSelector((state) => state.carto.layers);

  if (!storesLayer) return null;

  return (
    <>
      <Typography className={classes.title} variant='caption'>
        Store types
      </Typography>
      {Object.entries(CATEGORY_COLORS).map((elem, i) => (
        <Grid
          container
          direction='row'
          alignItems='center'
          className={classes.element}
          key={i}
        >
          <div
            className={classes.dot}
            style={{
              backgroundColor: rgbToHex(elem[1]),
            }}
          />
          {elem[0]}
        </Grid>
      ))}
    </>
  );
}

export default StoresLegend;
