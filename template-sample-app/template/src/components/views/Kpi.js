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
import { AggregationTypes, CategoryWidget, FormulaWidget } from '@carto/react/widgets';

import { currencyFormatter } from 'utils/formatter';
import kpiSource from 'data/sources/kpiSource';
import { KPI_LAYER_ID } from 'components/layers/KpiLayer';

const useStyles = makeStyles((theme) => ({
  title: {
    padding: theme.spacing(3, 3, 1.5),
  },
}));

export default function Kpi() {
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    // Set the view state
    dispatch(
      setViewState({
        latitude: 31.802892,
        longitude: -103.007813,
        zoom: 3,
        transitionDuration: 500,
      })
    );
    // Add the source query for the KPI
    dispatch(addSource(kpiSource));
    // Add the layer
    dispatch(
      addLayer({
        id: KPI_LAYER_ID,
        source: kpiSource.id,
        selectedStore: null,
      })
    );
    // Close bottom panel
    dispatch(setBottomSheetOpen(false));

    // Clean up when leave
    return function cleanup() {
      dispatch(removeLayer(KPI_LAYER_ID));
      dispatch(removeSource(kpiSource.id));
    };
  }, [dispatch]);

  // Auto import useEffect

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
        id='revenuByState_category'
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
    </div>
  );
}
