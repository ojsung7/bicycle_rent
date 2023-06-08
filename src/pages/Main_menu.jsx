import React, { useEffect, useState } from 'react'
import SidoData from '../data/Sido.json'
import SigunguData from '../data/Sigungu.json'

const { kakao } = window;
const Main_menu = ({GeoDataFromMenu}) => {

  const [thisSido, setThisSido] = useState({
    thisSido_name: null,
    thisSido_code: null
  });

  const [thisSigungu, setThisSigungu] = useState(null);

  const [sortedSigunguData, setSortedSigunguData] = useState(null);

  const setSidoAndGetSigungu = (e) => {
    setThisSigungu(null);

    const selected_index = e.target.selectedIndex
    const selected_Sido_name = e.target[selected_index].text;
    const selected_Sido_code = e.target.value;

    setThisSido({
      ...thisSido,
      thisSido_name: selected_Sido_name,
      thisSido_code: selected_Sido_code
    });

    let notSortSigunguData = [];
    for (let i = 0; i < SigunguData.length; i++) {
      let bool_includeSigunguBySido = SigunguData[i].Sigungu_code.toString().startsWith(selected_Sido_code);
      if (bool_includeSigunguBySido) {
        notSortSigunguData.push(SigunguData[i])
      }
      sortBySigunguName(notSortSigunguData);
    }
  }

  const sortBySigunguName = (notSortSigunguData) => {
    let notSortSigunguData_tmp = notSortSigunguData.sort((a, b) => {
      if (a.Sigungu_name > b.Sigungu_name) return 1;
      if (a.Sigungu_name < b.Sigungu_name) return -1;
      return 0
    })
    setSortedSigunguData(notSortSigunguData_tmp)
  }

  const setSelectedSigungu = (e) => {
    const selected_index = e.target.selectedIndex
    const selected_Sigungu_name = e.target[selected_index].text;

    setThisSigungu(selected_Sigungu_name);
  }
  
  useEffect(() => {
    if(thisSido.thisSido_code !== null){
      deliverGeoDataToMapComponent();
    }
  }, [thisSido, thisSigungu])

  const deliverGeoDataToMapComponent = () => {
    var kakaoGeocoder = new kakao.maps.services.Geocoder();
    let SigunguCenter_array = [];

    // if(thisSigungu === null){
      for(let tmp of sortedSigunguData){
        var call_test = (result, status) => {
          if (status === kakao.maps.services.Status.OK) {
            const SigunguCenter_object = {
              Sigungu_name: tmp.Sigungu_name,
              lat: result[0].y,
              lng: result[0].x
            }
            SigunguCenter_array.push(SigunguCenter_object);
          }
        }

        kakaoGeocoder.addressSearch(thisSido.thisSido_name + ' ' + tmp.Sigungu_name, call_test);
      }
    // }

    var callback = function (result, status) {
      if (status === kakao.maps.services.Status.OK) {
        const getCenter = result[0]
        GeoDataFromMenu({
          centerPosition : {lat: getCenter.y, lng: getCenter.x},
          SigunguPosition: SigunguCenter_array,
          thisSido,
          thisSigungu
        })
      }
    };
    let getCenterAddress = thisSido.thisSido_name;
    if(thisSigungu !== null) getCenterAddress += ' ' + thisSigungu
    kakaoGeocoder.addressSearch(getCenterAddress, callback);
  }

  return (
    <div className='main_menu'>
      <select className='select_Sido' onChange={(e) => setSidoAndGetSigungu(e)}>
        <option>시/도</option>
        {
          SidoData.map((item, index) =>
            <option key={index} value={item.Sido_code}>{item.Sido_name}</option>
          )
        }
      </select>
      <select className='select_Sigungu' onChange={(e) => setSelectedSigungu(e)}>
        <option>시/군/구</option>
        {
          sortedSigunguData && (
            sortedSigunguData.map((item, index) =>
              <option key={index} value={item.Sigungu_code}>{item.Sigungu_name}</option>
            ))
        }
      </select>
    </div>
  )
}

export default Main_menu