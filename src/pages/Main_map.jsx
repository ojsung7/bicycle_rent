import React, { useEffect } from 'react'
import { Map, MapMarker } from 'react-kakao-maps-sdk'
import bicycleData from './bicycle.json'

const Main_map = () => {
  useEffect(() => {
    console.log(bicycleData[0])
  }, [])
  return (
    <Map
      center={{ lat: 33.5563, lng: 126.79581 }}
      style={{ width: "100vw", height: "100vh" }}
    >
      {
        bicycleData.length > 0
          ? bicycleData.map((item, index) =>
            <MapMarker
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
          )
          : null
      }
    </Map>
  )
}

export default Main_map