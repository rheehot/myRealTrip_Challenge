import React, { useState, useEffect, useRef } from 'react'
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
    const lastHotelRef = useRef(null);

    const [value, setValue] = useState({
        min: 0,
        max: 1000000,
        wifi: false,
        parking: false,
        pickup: false,
    })

    const [rating, setRating] = useState({
        min: 0,
        max: 10,
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
                            list: [...prev.list, ...result],
                            isLoading: false,
                            isError: false,
                        }
                    })
                }
                else {
                    setHotel((prev) => {
                        return {
                            ...prev,
                            list: [],
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
                        list: [],
                        isLoading: false,
                        isError: true,
                    }
                })
            })  
    }

    useEffect(() => {
        console.log("fetch New Price");
        const ids = hotel.list
            .filter(hotel => {
                return hotel.price === undefined;
            })
            .map(hotel => {
                return hotel.id;
            });
        
        fetchPrice(ids);
    }, [ hotel.list.length ])

    const fetchPrice = (ids) => {

        while (ids.length > 0) {
            const splicedId = ids.splice(0, 4);
            recursiveFetchPrice(splicedId, 0);
        }
    }

    const recursiveFetchPrice = (ids, num) => {
        if (num >= 1) {
            console.log("retry fetchPrice..", ids, num);
        }
        if (num >= 4) {
            return console.error("가격을 불러오는데 실패했습니다");
        }

        fetch(`${BASE_URL}/hotel-prices?ids=${ids.join(',')}`)
            .then(async res => {
                if(res.status === 200) { 
                    let priceObj = await res.json();
                    let hotelList = hotel.list;
                    
                    Object.keys(priceObj).forEach((id) => {
                        let idx = hotelList.findIndex(hotel => hotel.id === parseInt(id));

                        hotelList[idx] = {
                            ...hotelList[idx],
                            price: priceObj[id],
                        }

                        setHotel(prev => {
                            return {
                                ...prev,
                                list: hotelList
                            }
                        })
                    })  
                }
                else {
                    return recursiveFetchPrice(ids, num + 1);
                }
            })
            .catch(err => {
                console.log(err);
                return recursiveFetchPrice(ids, num + 1);
            })
    }

    const handleSlide = (value) => {
        
        setValue((prev) => {
            return {
                ...prev,
                ...value,
            }
        });

        clearTimeout(timer.timer);
        setTimer({
            timer: setTimeout(() => {
                let isPriceIncluded = (value.min !== 0 || value.max !== 1000000);
                let priceFilter = isPriceIncluded ? `filters=PRICE=${value.min}:${value.max}` : '';

                history.replace(`/hotels?${priceFilter}`);
                fetchAPI(`/hotels?page=${page.page}&${priceFilter}`);
                setHotel({
                    list: [],
                    isLoading: true,
                    isError: false,
                });
            }, 500)
        })
    }

    const handleCheck = (event) => {
        console.log('handle Check');
    }

    const fetchWithURL = () => {
        // what is query?
        const query = location.search.replace('?', ''); // key=value

        // fetch depending on query
        fetchAPI(`/hotels?page=${page.page}&${query}`);

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
                    
                    setValue((prev) => {
                        return {
                            ...prev,
                            min: parseInt(min),
                            max: parseInt(max),
                        }
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

                    setValue(prev => {
                        return {
                            ...prev,
                            wifi: arr.includes('FREE-WIFI'),
                            parking: arr.includes('FREE-PARKING'),
                            pickup: arr.includes('FREE-AIRPORT-PICKUP'),
                        }
                    })
                }
            })
        
    }

    const fetchWithScroll = () => {
        // what is query?
        const query = location.search.replace('?', ''); // key=value

        // fetch depending on query
        fetchAPI(`/hotels?page=${page.page + 1}&${query}`);

        // set state
        setPage({
            page: page.page + 1,
        })
        setHotel((prev) => {
            return {
                ...prev,
                isLoading: true,
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
                setValue={setValue}
                setRating={setRating}
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
                lastHotelRef={lastHotelRef}
                fetchWithScroll={fetchWithScroll}
            />
        </Wrapper>
    )
}
