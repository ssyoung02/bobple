import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import '../../assets/style/allSearch/AllSearch.css'

function AllSearch(){

    return(
        <div className={"SearchBox"}>
            <div className={"SearchInput"}>
                <input className={"AllSaerchBox"} placeholder={"검색 키워드를 입력해주세요"}/>
                <button className={"AllSearchButton"}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </button>
            </div>
        </div>

    );

}

export default AllSearch;