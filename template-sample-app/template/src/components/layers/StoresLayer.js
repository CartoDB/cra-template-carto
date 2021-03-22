import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CartoSQLLayer, colorCategories } from '@deck.gl/carto';
import { useCartoLayerProps } from '@carto/react-api';
import { selectSourceById } from '@carto/react-redux';
import htmlForFeature from 'utils/htmlForFeature';

export const STORES_LAYER_ID = 'storesLayer';

const OTHERS_COLOR = { Others: [200, 200, 200] };

export const CATEGORY_COLORS = {
  Supermarket: [80, 20, 85],
  'Discount Store': [128, 186, 90],
  Hypermarket: [231, 63, 116],
  Drugstore: [242, 183, 1],
  'Department Store': [57, 105, 172],
  ...OTHERS_COLOR,
};

function StoresLayer() {
  const navigate = useNavigate();
  const { storesLayer } = useSelector((state) => state.carto.layers);
  const source = useSelector((state) => selectSourceById(state, storesLayer?.source));
  const cartoLayerProps = useCartoLayerProps(source);

  if (storesLayer && source) {
    return new CartoSQLLayer({
      id: STORES_LAYER_ID,
      data: source.data,
      credentials: source.credentials,
      stroked: true,
      pointRadiusUnits: 'pixels',
      lineWidthUnits: 'pixels',
      pickable: true,
      getFillColor: colorCategories({
        attr: 'storetype',
        domain: Object.keys(CATEGORY_COLORS),
        colors: Object.values(CATEGORY_COLORS),
        othersColor: OTHERS_COLOR.Others,
      }),
      getLineColor: [0, 0, 0],
      getRadius: (info) =>
        info.properties.store_id === storesLayer.selectedStore ? 6 : 3,
      getLineWidth: (info) =>
        info.properties.store_id === storesLayer.selectedStore ? 2 : 0,
      onHover: (info) => {
        if (info?.object) {
          info.object = {
            html: htmlForFeature({
              title: `Store ${info.object.properties.store_id}`,
              feature: info.object,
              formatter: {
                type: 'currency',
                columns: ['revenue'],
              },
              includeColumns: ['revenue'],
              showColumnName: false,
            }),
          };
        }
      },
      onClick: (info) => {
        if (info?.object) {
          navigate(`/stores/${info.object.properties.store_id}`);
        }
      },
      updateTriggers: {
        getRadius: { selectedStore: storesLayer.selectedStore },
        getLineWidth: { selectedStore: storesLayer.selectedStore },
        ...cartoLayerProps.updateTriggers,
      },
      ...cartoLayerProps,
    });
  }
}

export default StoresLayer;
