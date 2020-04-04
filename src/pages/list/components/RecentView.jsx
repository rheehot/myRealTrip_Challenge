import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
    width: 100%;
    grid-area: rv;

    @media (max-width: 420px) {
        display: none;
    }
`;

const ViewContainer = styled.div`
    width: 100%;
    height: 63px;
    border: 1px solid #ddd;
    background-color: #fff;
    color: #000;
    padding: 15px;
    display: flex;
    align-items: center;

    @media (max-width: 1023px) {
        height: 50px;
        padding: 10px;
    }
    @media (max-width: 420px) {
        display: none;
    }
`;


export default function RecentView() {

    return (
        <Wrapper>
            <h3>최근 본 호텔</h3>
            <ViewContainer>
                <p>1</p>
                <p>2</p>
                <p>3</p>
            </ViewContainer>
        </Wrapper>
    )
}