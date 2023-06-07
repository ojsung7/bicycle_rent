import Map from 'ol/Map.js';
import View from 'ol/View.js';
import { OSM } from 'ol/source.js';
import OlTileLayer from 'ol/layer/Tile.js';

import Vector from 'ol/source/Vector.js';
import VectorLayer from 'ol/layer/Vector.js';

import point from 'ol/geom/Point';


import GeoJSON from 'ol/format/GeoJSON.js'; //GeoJson 형식
import { Style, Stroke, Fill, Text } from 'ol/style.js';  //데이터를 그릴 스타일들

import SigunguGeoData from '../data/SigunguGeoData.json'
import { useEffect } from 'react';

const Main_dis = () => {
    useEffect(() => {
        var format = new GeoJSON({   //포멧할 GeoJSON 객체 생성
            featureProjection: 'EPSG:3857'
        });
        var parsing = format.readFeatures(SigunguGeoData);  //읽어온 데이터 파싱

        var source = new Vector({  //벡터의 구조를 파싱한 데이터로 넣기
            features: parsing
        });

        var geoVector = new VectorLayer({ //벡터 레이어 생성 
            source: source,
            style: (feature, resolution) => {
                let name = "test";
                return new Style({
                    stroke: new Stroke({
                        color: '#5c68ff',
                        width: 1
                    }), fill: new Fill({  //채우기
                        color: 'rgba( 255, 133, 133 ,0.15)'
                    }),
                    text: new Text({  //텍스트
                        text: name,
                        textAlign: 'center',
                        font: '15px roboto,sans-serif'
                    })
                })
            }
        });

        var pnt = new point([126,37]).transform('EPSG:4326', 'EPSG:3857');
        var korea = pnt.getCoordinates();

        var layer = new OlTileLayer({ 
            source: new OSM()  
          });

        var myView = new View({
            center: korea,
            zoom: 8
          }); //뷰 객체를 전역변수로 뺀다.

        var map = new Map({
            layers: [layer, geoVector],
            target: 'map_tmp',
            view: myView
        });
    }, [])

    return (
        <div style={{ "width": "100vw", "height": "100vh" }} id='map_tmp'>Main_dis</div>
    )
}

export default Main_dis