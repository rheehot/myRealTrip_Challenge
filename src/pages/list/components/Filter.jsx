import 'react-input-range/lib/css/index.css'

import React from 'react'
import InputRange from 'react-input-range'
import styled from 'styled-components'

const Wrapper = styled.div`
    width: 275px;
    grid-area: ft;

    @media (max-width: 1023px) {
        width: 220px;
    }
    @media (max-width: 420px) {
        width: 390px;
    }
`;

const InputContainer = styled.div`
    border: 1px solid #ddd;
    color: #000;
    background-color: #fff;
    padding: 40px;
    width: 100%;
    box-sizing: border-box;
    @media (max-width: 1023px) {
        padding: 36px;
    }

    > div:last-child {
        margin: 0 !important
    }
`;

const Input = styled.div`
    margin-bottom: 48px;
    width: 100%;
    @media (max-width: 1023px) {
        margin-bottom: 40px;
    }
`;

const InputTitle = styled.p`
    margin-bottom: 24px;
`;


export default function Filter(props) {
    

    return (
        <Wrapper>
            <h3>필터</h3>
            <InputContainer>
                <Input>
                    <InputTitle>1박당 요금</InputTitle>
                    <InputRange
                        minValue={0}
                        maxValue={1000000}
                        value={props.value}
                        step={1000}
                        formatLabel={value => (value === 1000000 ? '1,000,000+' : value.toString())}
                        onChange={value => props.handleSlide(value)}
                    />
                </Input>
                <Input>
                    <InputTitle>리뷰 점수</InputTitle>
                    <InputRange
                        minValue={0}
                        maxValue={10}
                        value={props.rating}
                        step={1}
                        formatLabel={rating => (rating)}
                        onChange={rating => props.setRating(rating)}
                    />
                </Input>
                <Input>
                    <InputTitle>시설정보</InputTitle>
                    <input
                        type="checkbox"
                        onChange={props.handleCheck}
                        checked={props.checked.wifi}
                        name="wifi"
                    /> Free WIFI
                    <br/>
                    <input
                        type="checkbox"
                        onChange={props.handleCheck}
                        checked={props.checked.parking}
                        name="parking"
                    /> Free Parking
                    <br/>
                    <input
                        type="checkbox"
                        onChange={props.handleCheck}
                        checked={props.checked.pickup}
                        name="pickup"
                    /> Free Airport Pickup
                </Input>
            </InputContainer>
        </Wrapper>
    )
}