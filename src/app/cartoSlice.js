import { createSlice, createSelector } from '@reduxjs/toolkit';
import { WebMercatorViewport } from '@deck.gl/core';
import { debounce } from '../features/utils';

export const cartoSlice = createSlice({
  name: 'carto',
  initialState: {
    viewState: {
      pitch: 0,
      bearing: 0,
      latitude: 31.802892,
      longitude: -103.007813,
      zoom: 3,
      dragRotate: false,
    },
    viewPort: undefined,
    baseMap: 'positron',
    credentials: {
      username: 'public',
      apiKey: 'default_public',
      serverUrlTemplate: 'https://{user}.carto.com',
    },
    layers: {
      countriesLayer: { id: 'countriesLayer', source: 'countriesSource' },
      tempLayer: { id: 'tempLayer', source: 'tempSource' },
      tipsLayer: { id: 'tipsLayer', source: 'tipsSource' },
    },
    dataSources: {
      countriesSource: {
        id: 'countriesSource',
        data: 'SELECT * FROM ne_50m_admin_0_countries',
      },
      tempSource: {
        id: 'tempSource',
        data: 'SELECT * FROM temps',
      },
      tipsSource: {
        id: 'tipsSource',
        data: 'cartobq.maps.nyc_taxi_points_demo_id',
      },
    },
  },
  reducers: {
    addDataSource: (state, action) => {
      state.dataSources[action.payload.id] = action.payload;
    },
    removeDataSource: (state, action) => {
      delete state.dataSources[action.payload];
    },
    addLayer: (state, action) => {
      state.layers[action.payload.id] = action.payload;
    },
    removeLayer: (state, action) => {
      delete state.layers[action.payload];
    },
    setBaseMap: (state, action) => {
      state.baseMap = action.payload;
    },
    setViewState: (state, action) => {
      const viewState = action.payload;
      state.viewState = { ...state.viewState, ...viewState };
    },
    setViewPort: (state, action) => {
      state.viewPort = new WebMercatorViewport(state.viewState).getBounds();
    },
    addFilter: (state, action) => {
      const { id, column, type, values } = action.payload;
      const source = state.dataSources[id];

      if (source) {
        if (!source.filters) {
          source.filters = {};
        }

        if (!source.filters[column]) {
          source.filters[column] = {};
        }

        source.filters[column][type] = values;
      }
    },
  },
});

export const selectSourceById = (state, id) => {
  return (
    state.carto.dataSources[id] && {
      credentials: state.carto.credentials,
      ...state.carto.dataSources[id],
    }
  );
};

let viewPortTimer;
export const setViewState = (viewState) => {
  return (dispatch, getState) => {
    const { setViewState, setViewPort } = cartoSlice.actions;
    dispatch(setViewState(viewState));
    clearTimeout(viewPortTimer);
    viewPortTimer = setTimeout(() => {
      dispatch(setViewPort());
    }, 200);
  };
};

export const {
  addDataSource,
  removeDataSource,
  addLayer,
  removeLayer,
  setBaseMap,
  addFilter,
} = cartoSlice.actions;

export default cartoSlice.reducer;
