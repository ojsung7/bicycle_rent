import React, { useEffect, useRef, useState } from 'react'
import { CustomOverlayMap, Map, MapMarker, MarkerClusterer } from 'react-kakao-maps-sdk'
import bicycleData from './bicycle.json'

const Main_map = () => {
  const map_ref = useRef();

  const [level, setLevel] = useState(3);
  const [center, setCenter] = useState({ lat: 37.8039066655, lng: 128.9042348363 });
  const [isOpen, setIsOpen] = useState('close')

  const marker_click = (marker_index, marker_position) => {
    setLevel(2);
    setCenter(marker_position)
    setIsOpen(marker_index);
  }

  return (
    <Map
      center={center}
      style={{ width: "100vw", height: "100vh" }}
      level={level}
      ref={map_ref}
      onZoomChanged={(e) => setLevel(e.getLevel())}
    >
      <MarkerClusterer
        averageCenter={true} // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
        minLevel={7} // 클러스터 할 최소 지도 레벨
      >
        {bicycleData.length > 0 && (
          bicycleData.map((item, index) =>
            <>
              <MapMarker
                onClick={() => marker_click(index, { lat: item.위도, lng: item.경도 })}
                key={index}
                position={{ lat: item.위도, lng: item.경도 }}
                image={{
                  src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png", // 마커이미지의 주소입니다
                  size: {
                    width: 24,
                    height: 35
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
    </Map>
  )
}

export default Main_map