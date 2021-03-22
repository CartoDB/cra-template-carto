import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setBottomSheetOpen, setError } from 'store/appSlice';
import { Divider, Grid, Typography, makeStyles } from '@material-ui/core';
import { AggregationTypes } from '@carto/react-core';
import { FormulaWidget, CategoryWidget, PieWidget, HistogramWidget } from '@carto/react-widgets';
import { currencyFormatter, numberFormatter } from 'utils/formatter';
import storesSource from 'data/sources/storesSource';
import { CATEGORY_COLORS } from 'components/layers/StoresLayer';
import rgbToHex from 'utils/rgbToHex';

const useStyles = makeStyles((theme) => ({
  title: {
    padding: theme.spacing(3, 3, 1.5),
  },
}));

function StoresList() {
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setBottomSheetOpen(false));
  }, [dispatch]);

  // [hygen] Add useEffect

  const onTotalRevenueWidgetError = (error) => {
    dispatch(setError(`Error obtaining total revenue: ${error.message}`));
  };

  const onRevenuePerTypeWidgetError = (error) => {
    dispatch(setError(`Error obtaining revenue per type: ${error.message}`));
  };

  const onStoresByRevenueWidgetError = (error) => {
    dispatch(setError(`Error obtaining stores per revenue: ${error.message}`));
  };

  const colorsPerCategory = Object.keys(CATEGORY_COLORS)
  .reduce((hexColorsPerCategory, key) => {
    hexColorsPerCategory[key] = rgbToHex(CATEGORY_COLORS[key]);
    return hexColorsPerCategory;
  }, {});

  console.table(colorsPerCategory);


  return (
    <Grid item xs>
      <Typography variant='h5' gutterBottom className={classes.title}>
        Store Analysis
      </Typography>

      <Divider />

      <FormulaWidget
        id='totalRevenue'
        title='Total revenue'
        dataSource={storesSource.id}
        column='revenue'
        operation={AggregationTypes.SUM}
        formatter={currencyFormatter}
        onError={onTotalRevenueWidgetError}
      />

      <Divider />
      <CategoryWidget
        id='revenueByStoreType'
        title='Revenue by store type'
        dataSource={storesSource.id}
        column='storetype'
        operationColumn='revenue'
        operation={AggregationTypes.SUM}
        formatter={currencyFormatter}
        onError={onRevenuePerTypeWidgetError}
      />

      <PieWidget
        id='revenueByStoreTypePie'
        title='Revenue by store type'
        dataSource={storesSource.id}
        colorsPerCategory={colorsPerCategory}
        column='storetype'
        operationColumn='revenue'
        operation={AggregationTypes.SUM}
        formatter={currencyFormatter}
        onError={onRevenuePerTypeWidgetError}
      />

      <Divider />

      <HistogramWidget
        id='storesByRevenue'
        title='Stores by revenue'
        dataSource={storesSource.id}
        formatter={numberFormatter}
        xAxisFormatter={currencyFormatter}
        operation={AggregationTypes.COUNT}
        column='revenue'
        ticks={[1200000, 1300000, 1400000, 1500000, 1600000, 1700000, 1800000]}
        onError={onStoresByRevenueWidgetError}
      />

      <Divider />
    </Grid>
  );
}

export default StoresList;
