import React, { useState, useEffect } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import Filter from './components/Filter'
import RecentView from './components/RecentView'
import List from './components/List'

const BASE_URL = 'https://x0ofq07ykl.execute-api.ap-northeast-2.amazonaws.com/dev'; 

const GlobalStyle = createGlobalStyle`
	body, html {
		padding: 0;
        margin: 0;
        width: 100%;
        height: 100%;
        background-color: #eee;
        font-size: 16px;
        @media (max-width: 1023px) {
            font-size: 14px;
        }
        @media (max-width: 420px) {
            font-size: 13px;
        }
    }
    * { box-sizing: border-box; }
`;

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 275px 650px;
    grid-template-rows: 130px 1fr;
    grid-template-areas:
        "ft rv"
        "ft ls";
    grid-gap: 20px;
    justify-content: center;
    padding: 20px;

    @media (max-width: 1023px) {
        grid-template-columns: 220px 500px;
        grid-template-rows: 110px 1fr;
    }
    @media (max-width: 420px) {
        grid-template-columns: 390px;
        grid-template-rows: 430px 1fr;
        grid-template-areas:
        "ft"
        "ls";
        padding: 12px 0;
    }
    
`;



export default function HotelListPage() {
    const [value, setValue] = useState({
        min: 0,
        max: 1000000,
    })

    const [rating, setRating] = useState({
        min: 0,
        max: 10,
    })

    const [checked, setChecked] = useState({
        wifi: false,
        parking: false,
        pickup: false,
    })

    const [hotel, setHotel] = useState({
        list: [],
        isLoading: true,
        isError: false,
    })

    const [recentView, setRecnet] = useState({
        names: [],
    })

    

    const handleCheck = (event) => {
        let target = event.target;
        let name = target.name;
        let isChecked = target.checked;

        setChecked((prev) => {
            return {
                ...prev,
                [name]: isChecked,
            }
        })
    }

    hnadleClickHotel = (name) => {

        setRecnet((prev) => {
            let names = [...prev.names];

            if (names.length >= 5) {
                names.splice(0, 1);
            }
            
            names.push(name);

            return {
                names;
            }
        })
    }
  
  useEffect(() => { 
    fetch(`${BASE_URL}/hotels`)
        .then(async res => {
            if (res.status === 200) {
                let result = await res.json();
                setHotel((prev) => {
                    return {
                        ...prev,
                        list: result,
                        isLoading: false,
                        isError: false,
                    }
                })
            }
            else {
                setHotel((prev) => {
                    return {
                        ...prev,
                        isLoading: false,
                        isError: true,
                    }
                })
            }
        })
        .catch(err => {
            setHotel((prev) => {
                return {
                    ...prev,
                    isLoading: false,
                    isError: true,
                }
            })
        })  
  }, []);

  return (
    <Wrapper>
        <GlobalStyle/>
        <Filter 
            value={value}
            rating={rating}
            checked={checked}
            setValue={setValue}
            setRating={setRating}
            setChecked={setChecked}
            handleCheck={handleCheck}
        />
        <RecentView />
        <List 
            hotels={hotel.list}
            isLoading={hotel.isLoading}
            isError={hotel.isError}
        />
    </Wrapper>
  )
}
