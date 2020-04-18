import React, { useRef, useEffect } from 'react'
import styled from 'styled-components'
import Item from './Item'


const Wrapper = styled.div`
    width: 100%;
    grid-area: ls;
`;

const Info = styled.div`
    width: 100%;
    height: 100%;
    background-color: #fff;
    border: 1px solid #ddd;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 200px;
`;

export default function List(props) {

    const lastHotelRef= useRef(null);
    const lastHotelObserver = new IntersectionObserver((entries, observer) => {
        const lastHotel = entries[0];
        
        if (lastHotel.intersectionRatio > 0) {
          observer.unobserve(lastHotel.target);
          lastHotelRef.current = null;
    
          props.fetchWithScroll();
          console.log("infinite scroll!");
        }
    });

    useEffect(() => {
        if (lastHotelRef.current) {
            lastHotelObserver.observe(lastHotelRef.current);
        }
    },[props.hotels.length]);

    const mapToItem = (hotels) => {
        return hotels.map((hotel, idx) => {
            return (
                idx === hotels.length -1 ? 
                    <Item 
                        key={hotel.id}
                        name={hotel.name}
                        freeServices={hotel.freeServices}
                        imageUrl={hotel.imageUrl}
                        rate={hotel.rate}
                        reviewScore={hotel.reviewScore}
                        totalReviewCount={hotel.totalReviewCount}
                        price={hotel.price ? `${hotel.price}원~` : `가격 불러오는 중..` }
                        handleClickHotel={() => props.handleClickHotel(hotel.name)}
                        lastHotelRef={lastHotelRef}
                    />
                :
                    <Item 
                        key={hotel.id}
                        name={hotel.name}
                        freeServices={hotel.freeServices}
                        imageUrl={hotel.imageUrl}
                        rate={hotel.rate}
                        reviewScore={hotel.reviewScore}
                        totalReviewCount={hotel.totalReviewCount}
                        price={hotel.price ? `${hotel.price}원~` : `가격 불러오는 중..` }
                        handleClickHotel={() => props.handleClickHotel(hotel.name)}
                    />
            )
        })
    }

    const Error = (
        <Info>
            에러가 발생했습니다. 다시 시도해주세요.
            <button onClick={props.reload}>다시 시도</button>
        </Info>
    )
    
    const List = mapToItem(props.hotels)

    return(
        <Wrapper>
            { props.isError ? Error : List }
            { (!props.isError && props.isLoading) ? <Info>로드 중..</Info> : '' }
        </Wrapper>
    )
}