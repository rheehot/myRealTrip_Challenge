import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.article`
    width: 100%;
    background-color: #fff;
    height: 200px;
    margin-bottom: 35px;
    display: flex;

    @media (max-width: 1023px) {
        margin-bottom: 24px;
    }
    @media (max-width: 420px) {
        height: 150px;
        margin-bottom: 12px;
    }
`;

const ImageContainer = styled.div`
    width: 260px;
    height: 100%;
    margin-right: 26px;
    
    > img { 
        width: 100%;
        height: 100%;
        object-fit: fit-content;
    }

    @media (max-width: 1023px) {
        width: 200px;
        margin-right: 20px;
    }
    @media (max-width: 420px) {
        width: 170px;
        margin-right: 12px;
    }
`;

const TextContainer = styled.div`
    flex: 1;
    position: relative;
`;

const Title = styled.h3`
    font-size:1.125rem;
    margin-bottom: 20px;
    @media (max-width: 1023px) {

    }
    @media (max-width: 420px) {
        margin-bottom: 15px;
    }
`;

const Free = styled.div`
    margin-bottom: 20px;
    display: flex;
    flex-wrap: wrap;
    @media (max-width: 1023px) {

    }
    @media (max-width: 420px) {
        margin-bottom: 15px;
    }

    > span {
        font-size: 0.875rem;
        border: 1px solid #1fbc41;
        color: #1fbc41;
        padding: 4px 8px;
        margin-right: 8px;
        margin-bottom: 4px;

        @media (max-width: 420px) {
            padding: 2px 4px;
        }
    }
`;

const Rating = styled.div``;

const Review = styled.div`
    position: absolute;
    top: 5px;
    right: 5px;
    line-height: 32px;

    > span:first-child {
        @media (max-width: 420px) {
            visibility: hidden;
        }
    }
    > span:last-child {
        display: inline-block;
        width: 32px;
        height: 32px;
        text-align: center;
        line-height: 32px;
        color: #fff;
        background-color: #060cab;
        margin-left: 8px;
        border-radius: 4px;

        @media (max-width: 420px) {
            width: 24px;
            height: 24px;
            line-height: 24px;
        }
    }
`;

export default function Item(props) {

    return(
        <Wrapper onClick={props.handleClickHotel}>
            <ImageContainer>
                <img src={props.imageUrl} alt={props.name} />
            </ImageContainer>
            <TextContainer>
                <Title>{props.name}</Title>
                <Free>
                    {
                        props.freeServices.map((f,idx) => <span key={idx}>{f}</span>)
                    }
                </Free>
                <Rating>{props.rate}성급 호텔</Rating>
                <Review>
                    <span>{props.totalReviewCount}개의 이용후기</span>
                    <span>{props.reviewScore}</span>
                </Review>
            </TextContainer>
        </Wrapper>
    )
}