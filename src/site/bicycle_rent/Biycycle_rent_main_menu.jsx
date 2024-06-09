import React, { useEffect, useState } from 'react'
import SidoData from '../../data/Sido.json'
import SigunguData from '../../data/Sigungu.json'
import bicycleData from '../../data/bicycle.json'

const { kakao } = window;
const Main_menu = ({ GeoDataFromMenu, BicycleCodeFromMemu }) => {

  const [thisSido, setThisSido] = useState({
    thisSido_name: null,
    thisSido_code: null
  });

  const [thisSigungu, setThisSigungu] = useState({
    thisSigungu_name: null,
    thisSigungu_code: null
  });

  const [selectedBicycle, setSelectedBicycle] = useState(null);

  const [sortedSigunguData, setSortedSigunguData] = useState(null);

  const [bicycleCardData, setBicycleCardData] = useState([]);


  const setSidoAndGetSigungu = (e) => {
    setThisSigungu(null);
    document.getElementsByClassName("select_Sigungu")[0].children[0].selected = true

    const selected_index = e.target.selectedIndex
    if (selected_index === 0) return false;
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
    if (selected_index === 0) return false;
    const selected_Sigungu_name = e.target[selected_index].text;
    const selected_Sigungu_code = e.target.value;

    setThisSigungu({
      ...thisSigungu,
      thisSigungu_name: selected_Sigungu_name,
      thisSigungu_code: selected_Sigungu_code
    });
  }

  useEffect(() => {
    if (thisSido.thisSido_code !== null) {
      deliverGeoDataToMapComponent();
      makeBicycleCardData();
    }
  }, [thisSido, thisSigungu])

  const deliverGeoDataToMapComponent = () => {
    var kakaoGeocoder = new kakao.maps.services.Geocoder();
    let SigunguCenter_array = [];

    // if(thisSigungu === null){
    for (let tmp of sortedSigunguData) {
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

    //     kakaoGeocoder.addressSearch(thisSido.thisSido_name + ' ' + tmp.Sigungu_name, call_test);
    //   }
    // }
    var callback = function (result, status) {
      if (status === kakao.maps.services.Status.OK) {
        const getCenter = result[0]
        GeoDataFromMenu({
          centerPosition: { lat: getCenter.y, lng: getCenter.x },
          // SigunguPosition: SigunguCenter_array,
          thisSido,
          thisSigungu
        })
      }
    };
    let getCenterAddress = thisSido.thisSido_name;
    if (thisSigungu !== null) getCenterAddress += ' ' + thisSigungu.thisSigungu_name
    kakaoGeocoder.addressSearch(getCenterAddress, callback);
  }

  var makeBicycleCardData = () => {
    let resultOfBicycleCard = [];

    let searchAddressKeyword = ''
    if (thisSido) searchAddressKeyword += thisSido.thisSido_name
    if (thisSigungu) searchAddressKeyword += ' ' + thisSigungu.thisSigungu_name

    for (let bicycleTmp of bicycleData) {
      const 도로명주소 = bicycleTmp.소재지도로명주소
      const 지번주소 = bicycleTmp.소재지지번주소
      if (도로명주소.includes(searchAddressKeyword) || 지번주소.includes(searchAddressKeyword)) {
        resultOfBicycleCard.push(bicycleTmp)
      }
    }

    resultOfBicycleCard = resultOfBicycleCard.sort(() => Math.random() - 0.5)

    // console.log(resultOfBicycleCard)

    setBicycleCardData(resultOfBicycleCard);
  }

  useEffect(() => {
    // console.log(selectedBicycle)
  }, [selectedBicycle])

  return (
    <div className='main_menu'>
      <p className='main_title'>자전거대여소 찾기</p>
      <p className='data_src'>데이터 출처 : <a href = "https://www.data.go.kr/data/15017319/standard.do#/layer_data_infomation" target='_blank'>공공데이터포털</a></p>
      <div className='select_wrap'>
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
      <div className='main_card'>
        {
          bicycleCardData.length > 0 && (
            bicycleCardData.map((item, index) =>
              <div key={index} className='bicycle_card_info'>
                <p className='title' onClick={() => setSelectedBicycle(item.구분코드)}>{item.자전거대여소명}<span className={'charge_sort' + (item.요금구분 === '무료' ? ' free' : '')}>({item.요금구분})</span></p>                
                <div className='etc_info'>
                  <p>이용요금 : {
                    item.요금구분 === '무료'
                    ? "무료"
                    : item.자전거이용요금
                    }</p>
                  <p>도로명주소 : {item.소재지도로명주소}</p>
                  <p>지번주소 : {item.소재지지번주소}</p>
                </div>
              </div>
            )
          )
        }
      </div>
    </div>
  )
}

export default Main_menu