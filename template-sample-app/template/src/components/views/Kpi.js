import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setBottomSheetOpen, setError } from 'config/appSlice';

import { Divider, Typography, makeStyles } from '@material-ui/core';

import {
  addLayer,
  addSource,
  removeLayer,
  removeSource,
  setViewState,
} from '@carto/react/redux';
import {
  AggregationTypes,
  CategoryWidget,
  FormulaWidget,
  HistogramWidget,
} from '@carto/react/widgets';

import { currencyFormatter, numberFormatter } from 'utils/formatter';
import kpiSource from 'data/sources/kpiSource';

const useStyles = makeStyles((theme) => ({
  title: {
    padding: theme.spacing(3, 3, 1.5),
  },
}));

export default function Kpi() {
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    const LAYER_ID = 'kpiLayer';

    dispatch(
      setViewState({
        latitude: 31.802892,
        longitude: -103.007813,
        zoom: 3,
        transitionDuration: 500,
      })
    );

    dispatch(addSource(kpiSource));
    dispatch(addLayer({ id: LAYER_ID, source: kpiSource.id }));

    dispatch(setBottomSheetOpen(false));

    return function cleanup() {
      dispatch(removeLayer(LAYER_ID));
      dispatch(removeSource(kpiSource.id));
    };
  }, [dispatch]);

  const onTotalRevenueWidgetError = (error) => {
    dispatch(setError(`Error obtaining total revenue: ${error.message}`));
  };

  const onRevenueByStateWidgetError = (error) => {
    dispatch(setError(`Error obtaining revenue by state: ${error.message}`));
  };

  return (
    <div>
      <Typography variant='h5' gutterBottom className={classes.title}>
        States Analysis
      </Typography>

      <Divider />

      <FormulaWidget
        id='totalRevenue'
        title='Total revenue'
        dataSource={kpiSource.id}
        column='revenue'
        operation={AggregationTypes.SUM}
        formatter={currencyFormatter}
        viewportFilter
        onError={onTotalRevenueWidgetError}
      ></FormulaWidget>

      <Divider />

      <CategoryWidget
        id='revenueByState_category'
        title='Revenue by state'
        dataSource={kpiSource.id}
        column='name'
        operationColumn='revenue'
        operation={AggregationTypes.SUM}
        formatter={currencyFormatter}
        viewportFilter
        onError={onRevenueByStateWidgetError}
      />

      <Divider />

      <HistogramWidget
        id='revenueByStateHistogram'
        title='Revenue by state histogram'
        dataSource='kpiSource'
        formatter={numberFormatter}
        xAxisFormatter={currencyFormatter}
        operation={AggregationTypes.COUNT}
        column='revenue'
        ticks={[10e6, 50e6, 10e7, 50e7, 75e7, 1e9, 2e9]}
        viewportFilter
      ></HistogramWidget>

      <Divider />
    </div>
  );
}
