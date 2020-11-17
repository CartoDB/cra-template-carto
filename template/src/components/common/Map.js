import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DeckGL from '@deck.gl/react';
import { StaticMap } from 'react-map-gl';
import { makeStyles } from '@material-ui/core';

import { setViewState } from 'lib/slice/cartoSlice';
import { baseMaps } from 'config/baseMaps';
import { GoogleMap } from 'lib';

const useStyles = makeStyles((theme) => ({
  tooltip: {
    '& .content': {
      ...theme.typography.caption,
      position: 'relative',
      padding: theme.spacing(1, 1.5),
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.grey[900],
      color: 'rgba(255, 255, 255, 0.75)', // TODO: Add emphasis colors to theme
      transform: `translate(-50%, calc(-100% - ${theme.spacing(2.5)}px))`,

      '& .arrow': {
        display: 'block',
        position: 'absolute',
        top: 'calc(100% - 1px)',
        left: '50%',
        width: 0,
        height: 0,
        marginLeft: theme.spacing(-1),
        borderLeft: `${theme.spacing(1)}px solid transparent`,
        borderRight: `${theme.spacing(1)}px solid transparent`,
        borderTop: `${theme.spacing(1)}px solid ${theme.palette.grey[900]}`,
      },
    },
  },
}));

export function Map(props) {
  const viewState = useSelector((state) => state.carto.viewState);
  const baseMap = useSelector((state) => baseMaps[state.carto.baseMap]);
  const dispatch = useDispatch();
  const classes = useStyles();
  let isHovering = false;

  const handleViewStateChange = ({ viewState }) => {
    dispatch(setViewState(viewState));
  };

  const handleSizeChange = ({ width, height }) => {
    dispatch(setViewState({ width, height }));
  };

  const handleHover = ({ object }) => (isHovering = !!object);
  const handleCursor = ({ isDragging }) =>
    isDragging ? 'grabbing' : isHovering ? 'pointer' : 'grab';

  const handleTooltip = (info) => {
    if (info && info.object) {
      return {
        html: `<div class='content'>${info.object.html}<div class='arrow'></div></div>`,
        className: classes.tooltip,
        style: {
          padding: 0,
          background: 'none',
        },
      };
    }
  };

  if (baseMap.type === 'mapbox') {
    return (
      <DeckGL
        viewState={{ ...viewState }}
        controller={true}
        layers={props.layers}
        onViewStateChange={handleViewStateChange}
        onResize={handleSizeChange}
        onHover={handleHover}
        getCursor={handleCursor}
        getTooltip={handleTooltip}
      >
        <StaticMap reuseMaps mapStyle={baseMap.options.mapStyle} preventStyleDiffing />
      </DeckGL>
    );
  } else if (baseMap.type === 'gmaps') {
    return (
      <GoogleMap
        baseMap={baseMap}
        viewState={{ ...viewState }}
        layers={props.layers}
        onViewStateChange={handleViewStateChange}
        onResize={handleSizeChange}
        getTooltip={handleTooltip}
      ></GoogleMap>
    );
  } else {
    return <div>Not a valid map provider</div>;
  }
}
