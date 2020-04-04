import React from 'react'
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
    align-items: center;
    justify-content: center;
    min-height: 200px;
`;

export default function List(props) {

    const mapToItem = (hotels) => {
        return hotels.map(hotel => {
            return <Item 
                    key={hotel.id}
                    name={hotel.name}
                    freeServices={hotel.freeServices}
                    imageUrl={hotel.imageUrl}
                    rate={hotel.rate}
                    reviewScore={hotel.reviewScore}
                    totalReviewCount={hotel.totalReviewCount}
            />
        })
    }

    return(
        <Wrapper>
            {
                props.isLoading ? <Info>로드 중..</Info> : (
                    props.isError ? <Info>에러가 발생했습니다. 다시 시도해주세요.</Info> : mapToItem(props.hotels)
                )
            }
        </Wrapper>
    )
}