import React, { useState, useEffect } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import Filter from './components/Filter'
import RecentView from './components/RecentView'
import List from './components/List'
import { useHistory, useLocation } from "react-router-dom"

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
            font-size: 12px;
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
    const history = useHistory();
    const location = useLocation();

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

    const [page, setPage] = useState({
        page: 1,
    });

    const [timer, setTimer] = useState({
        timer: {},
    })
    
    const fetchAPI = (query = '') => {
        fetch(`${BASE_URL}${query}`)
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
    }

    const handleSlide = (value) => {
        setValue(value);

        clearTimeout(timer.timer);
        setTimer({
            timer: setTimeout(() => {
                let isPriceIncluded = (value.min !== 0 || value.max !== 1000000);
                let priceFilter = isPriceIncluded ? `filters=PRICE=${value.min}:${value.max}` : '';

                history.replace(`/hotels?pages=1&${priceFilter}`);
                fetchAPI(`/hotels?pages=1&${priceFilter}`);
                setHotel({
                    list: [],
                    isLoading: true,
                    isError: false,
                });
            }, 500)
        })
    }

    const handleCheck = (event) => {
        console.log(event.target);
    }

    const fetchWithURL = () => {
        // what is query?
        const query = location.search; // ?key=value
        console.log(query);

        // fetch depending on query
        fetchAPI(`/hotels${query}`);

        // set state
        const params = new URLSearchParams(query);
        const hasFilters = params.has('filters');

        if (!hasFilters) {
            return;
        }

        
        params
            .get('filters')
            .split('|')
            .map(p => {
                let key = p.split('=')[0];
                let value = p.split('=')[1]

                if (key === 'PRICE') {
                    const [ min, max ] = value.split(':');
                    
                    setValue({
                        min: parseInt(min),
                        max: parseInt(max),
                    })
                }
                else if (key === 'REVIEW-SCORE') {
                    setRating({
                        min: parseInt(value),
                        max: 10,
                    })
                }
                else if (key === 'FREE') {
                    const arr = value.split(',');

                    setValue({
                        wifi: arr.includes('FREE-WIFI'),
                        parking: arr.includes('FREE-PARKING'),
                        pickup: arr.includes('FREE-AIRPORT-PICKUP'),
                    })
                }
            })
        
    }

    const reload = () => {
        setHotel({
            list: [],
            isLoading: true,
            isError: false,
        })
        fetchWithURL();
    }
  
    // 초기 로딩 
    useEffect(() => { 
        fetchWithURL();
    }, []);

    const handleClickHotel = (name) => {
        window.alert(`${name}을 조회하였습니다`);

        setRecnet((prev) => {
            let names = [...prev.names];

            if (names.length >= 5) {
                names.splice(0, 1);
            }
            
            names.push(name);

            return {
                names,
            }
        })
    }

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
                handleSlide={handleSlide}
            />
            <RecentView
                names={recentView.names}
            />
            <List 
                hotels={hotel.list}
                isLoading={hotel.isLoading}
                isError={hotel.isError}
                handleClickHotel={handleClickHotel}
                reload={reload}
            />
        </Wrapper>
    )
}
