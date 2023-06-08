import React, { useEffect, useRef, useState } from 'react'
import { CustomOverlayMap, Map, MapMarker, MarkerClusterer, Polygon } from 'react-kakao-maps-sdk'
import bicycleData from '../data/bicycle.json'
import SigunguGeoData from '../data/SigunguGeoData.json'
import SigunguPointData from '../data/SigunguPointData.json'
import Main_menu from './Main_menu';

const Main_map = () => {
  const map_ref = useRef();

  const [level, setLevel] = useState(8);
  const [center, setCenter] = useState({ lat: 37.566826004661, lng: 126.978652258309 });
  const [isOpen, setIsOpen] = useState('close')

  const [thisSido, setThisSido] = useState({
    thisSido_name: null,
    thisSido_code: null
  });

  const [SigunguPolygone, setSigunguPolygone] = useState([]);
  const [SigunguPosition, setSigunguPosition] = useState([]);

  const marker_click = (marker_index, marker_position) => {
    setLevel(2);
    setCenter({
      lat: marker_position.lat,
      lng: marker_position.lng
    })
    setIsOpen(marker_index);
  }

  const GeoDataFromMenu = (GeoData) => {
    let thisLevel = 9;
    const check_sido = ["41", "42", "43", "44", "45", "46", "47", "48", "50"]

    for (let tmp of check_sido) {
      if (tmp === GeoData.thisSido.thisSido_code) thisLevel = 11;
    }

    if (GeoData.thisSigungu !== null) thisLevel = 7;
    setLevel(thisLevel)
    setCenter(GeoData.centerPosition)
    setThisSido(GeoData.thisSido)
    
    const Sido_code = GeoData.thisSido.thisSido_code
    makeSigungoPoint(Sido_code)
  }

  const makeSigungoPoint = (Sido_code) => {
    let resultOfPoint = [];
    for(let Sigungu_element of SigunguPointData.features){
      const containedSigungu = (Sigungu_element.properties.SIG_CD).startsWith(Sido_code)
      if(containedSigungu){
        const Sigungu_object = {
          name: Sigungu_element.properties.SIG_KOR_NM,
          lat: Sigungu_element.geometry.coordinates[1],
          lng: Sigungu_element.geometry.coordinates[0],
        }
        resultOfPoint.push(Sigungu_object)
      }
    }
    sortBySigunguName(resultOfPoint)
  }

  const sortBySigunguName = (notSortSigunguData) => {
    let notSortSigunguData_tmp = notSortSigunguData.sort((a, b) => {
      if (a.name > b.name) return 1;
      if (a.name < b.name) return -1;
      return 0
    })
    setSigunguPosition(notSortSigunguData_tmp)
  }

  // useEffect(() => {
  //   if (thisSido.thisSido_code !== null) MaKeSigunguPolygone(thisSido.thisSido_code)
  // }, [thisSido])
  const MaKeSigunguPolygone = (Sido_code) => {
    const resultOfPolygone = [];
    let tmp;

    for (let GeoData_tmp of SigunguGeoData.features) {
      const Sigungu_code = GeoData_tmp.properties.SIG_CD
      if (Sigungu_code.startsWith(Sido_code)) {
        const coordinates = GeoData_tmp.geometry.coordinates;

        for (let GeoData1 of coordinates) {
          const coordinates_array = [];
          for (let GeoData2 of GeoData1[0]) {
            const coordinates = {
              lat: GeoData2[1],
              lng: GeoData2[0]
            }
            coordinates_array.push(coordinates)
          }
          resultOfPolygone.push(coordinates_array)
        }
      }
    }
    setSigunguPolygone(resultOfPolygone);
  }

  return (
    <main>
      <Main_menu GeoDataFromMenu={GeoDataFromMenu} />
      <Map
        center={center}
        style={{ width: "70vw", height: "100vh" }}
        level={level}
        ref={map_ref}
        onZoomChanged={(e) => setLevel(e.getLevel())}
      >
        {
          SigunguPolygone.length > 0 && (
            SigunguPolygone.map((item) =>
              <Polygon
                path={item}
                strokeWeight={3} // 선의 두께입니다
                strokeColor={"#0089FF"} // 선의 색깔입니다
                //strokeOpacity={0.8} // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
                //strokeStyle={"longdash"} // 선의 스타일입니다
                fillColor={"#DEF0FF"} // 채우기 색깔입니다
                fillOpacity={0.6} // 채우기 불투명도 입니다
              />
            )
          )
        }
        <MarkerClusterer
          averageCenter={true} // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
          minLevel={4} // 클러스터 할 최소 지도 레벨
        >
          {bicycleData.length > 0 && (
            bicycleData.map((item, index) =>
              <>
                <MapMarker
                  onClick={() => marker_click(index, { lat: item.위도, lng: item.경도 })}
                  key={index}
                  position={{ lat: item.위도, lng: item.경도 }}
                  image={{
                    src: item.요금구분 === "무료" ? "icon/bicycle_free.png" : "icon/bicycle_charge.png",
                    size: {
                      width: 35,
                      height: 40
                    },
                  }}
                />
                {isOpen == index && (
                  <CustomOverlayMap // 커스텀 오버레이를 표시할 Container
                    // 커스텀 오버레이가 표시될 위치입니다
                    position={{
                      lat: item.위도,
                      lng: item.경도,
                    }}
                    // 커스텀 오버레이가에 대한 확장 옵션
                    xAnchor={0.5}
                    yAnchor={1.3}
                  >
                    <div className='bicycle_info'>
                      {item.자전거대여소명 && (<p className='title'>{item.자전거대여소명}<span className={'charge_sort' + (item.요금구분 === '무료' ? ' free' : '')}>({item.요금구분})</span></p>)}
                      {
                        item.요금구분 === '유료' && item.자전거이용요금
                          ? <p>이용요금 : {item.자전거이용요금}</p>
                          : null
                      }
                      <div className='address'>
                        {item.소재지도로명주소 && (<p>도로명주소 : {item.소재지도로명주소}</p>)}
                        {item.소재지지번주소 && (<p>지번주소 : {item.소재지지번주소}</p>)}
                      </div>
                      <p>자전거보유대수 : {item.자전거보유대수}</p>
                      {item.운영시작시각 && (<p>운영시간 : {item.운영시작시각} ~ {item.운영종료시각}</p>)}
                      {item.휴무일 && (<p>휴무일 : {item.휴무일}</p>)}
                      {item.공기주입기비치여부 && (<p>공기주입기비치여부 : {item.공기주입기비치여부}</p>)}
                      {item.수리대설치여부 && (<p>수리대설치여부 : {item.수리대설치여부}</p>)}
                      <div className='etc'>
                        {item.관리기관명 && (<p>※ 관리기관 : {item.관리기관명}({item.관리기관전화번호})</p>)}
                        {item.데이터기준일자 && (<p>※ 데이터기준일자 : {item.데이터기준일자}</p>)}
                      </div>
                    </div>
                  </CustomOverlayMap>
                )}
              </>
            ))}
        </MarkerClusterer>
        {
          SigunguPosition.length > 0 && (
            SigunguPosition.map((item) =>
              <CustomOverlayMap // 커스텀 오버레이를 표시할 Container
                // 커스텀 오버레이가 표시될 위치입니다
                position={{
                  lat: item.lat,
                  lng: item.lng,
                }}
              >
                {/* 커스텀 오버레이에 표시할 내용입니다 */}
                <div className='sigungu_name'>
                  {item.name}
                </div>
              </CustomOverlayMap>
            )
          )
        }
      </Map>
    </main>
  )
}

export default Main_map