import React, { useEffect, useState } from 'react'
import si_do_data from '../data/si_do.json'
import si_gun_gu_data from '../data/si_gun_gu.json'

const Main_menu = () => {
  const [sidoCode, setSidoCode] = useState(null);

  const [sortedGugunData, setSortedGugunData] = useState();

  useEffect(() => {
    if (sidoCode != null) {
      let notSortGungunData = [];
      for (let i = 0; i < si_gun_gu_data.length; i++) {
        let bool_includeGugunBySido = si_gun_gu_data[i].gugunCode.toString().startsWith(sidoCode);
        if(bool_includeGugunBySido){
          notSortGungunData.push(si_gun_gu_data[i])
        }
      }
      sortByGugunName(notSortGungunData);
    }
  }, [sidoCode])

  // 시군구
  const sortByGugunName = (notSortGungunData) => {
    let sortedGugunData_tmp = notSortGungunData.sort((a,b) => {
      if(a.gugun > b.gugun) return 1;
      if(a.gugun < b.gugun) return -1;
      return 0
    })
    setSortedGugunData(sortedGugunData_tmp)
  }

  return (
    <div className='main_menu'>
      <select onChange={(e) => setSidoCode(e.target.value)}>
        <option>시/도</option>
        {
          si_do_data.map((item, index) =>
            <option key={index} value={item.si_do_code}>{item.si_do}</option>
          )
        }
      </select>
    </div>
  )
}

export default Main_menu