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

    > span {
        margin-right: 4px;
        padding: 4px 8px;
        background-color: #eee;
        font-size: 0.875rem;
    }
`;


export default function RecentView(props) {

    return (
        <Wrapper>
            <h3>최근 본 호텔</h3>
            <ViewContainer>
                {props.names.map((name, idx) => <span key={idx}>{name}</span>)}
            </ViewContainer>
        </Wrapper>
    )
}