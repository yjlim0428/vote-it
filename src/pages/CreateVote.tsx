import React, { useState } from 'react';
import styled from 'styled-components';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { Scheduler } from '../components';
import apiAxios from '../utils/apiAxios';
import '../fonts/font.css';
import { useDispatch } from 'react-redux';
import { notify } from '../modules/notification';
import { useNavigate } from 'react-router-dom';

const Outer = styled.div`
  font-family: 'EliceDigitalBaeum_Regular';
  padding-top: 48px;
  background-color: var(--bg);
  display: flex;
  width: 100%;
  /* flex-direction: column; */
  justify-content: center;
  align-items: center;
`;
const Container = styled.div`
  width: 1200px;
  display: grid;
  height: 100vh;
  grid-template-columns: repeat(12, 1fr);
  column-gap: 24px;
  align-items: center;
  @media only screen and (max-width: 1200px) {
    width: 768px;
  }
  @media only screen and (max-width: 768px) {
    width: 500px;
  }
  @media only screen and (max-width: 500px) {
    width: 360px;
    grid-template-columns: repeat(6, 1fr);
    column-gap: 16px;
  }
`;

const SubBox = styled.div`
  grid-column: 2 / span 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  @media only screen and (max-width: 500px) {
    grid-column: span 6;
  }
`;

const Title = styled.textarea`
  &:focus {
    outline: none;
  }
  background-color: var(--box-bg);
  box-shadow: -2px -2px 4px var(--box-shadow),
    3px 3px 6px var(--box-shadow-darker);
  font-family: 'SUIT-Light';
  border-radius: 20px;
  font-size: 18px;
  padding: 20px;
  width: 90%;
  height: 40px;
  margin-top: 30px;
  border: none;
  resize: none;
`;
const OptionContainer = styled.div`
  overflow-y: auto;
  margin-top: 30px;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  max-height: 45%;
  padding: 10px;
`;
const Option = styled.div`
  box-shadow: -2px -2px 4px var(--box-shadow),
    3px 3px 6px var(--box-shadow-darker);
  display: flex;
  margin: 0 auto;
  margin-top: 10px;
  width: 95%;
  background-color: var(--box-bg);
  border-radius: 15px;
  padding: 5px;
  justify-content: space-around;
`;
const OptionInput = styled.input`
  font-family: 'SUIT-Light';
  &:focus {
    outline: none;
  }
  height: 40px;
  width: 80%;

  border: none;
`;

const DelOptionBtn = styled.div`
  &:hover {
  }
  all: unset;
  /* margin-right: 10px; */
`;
const PlusOptionBtn = styled.button`
  border: none;
  margin: 0 auto;
  margin-top: 10px;
  width: 50px;
  min-height: 40px;
  border-radius: 20px;
  background-color: var(--main-color);
`;
const CheckboxContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-around;
`;
const CheckboxAndTitle = styled.div`
  display: flex;
  margin: 10px;
  align-items: center;
`;
const Checkbox = styled.input`
  margin-right: 10px;
`;
const CheckboxTitle = styled.div``;
const CalendarBtn = styled.input`
  border: none;
  height: 38px;
  margin: 10px;
`;

const CreateBtn = styled.button`
  font-family: 'KOHIBaeumOTF';
  margin: 0 auto;
  font-size: 20px;
  border: none;
  max-width: 300px;
  width: 50vw;
  height: 40px;
  margin-top: 30px;
  border-radius: 15px;
  color: white;
  box-shadow: -2px -2px 4px var(--box-shadow),
    3px 3px 6px var(--box-shadow-darker);
  background-color: var(--main-color);
  :hover {
    background-color: var(--border-lighter);
  }
`;

function CreateVote() {
  const [calendarValue, setCalendarValue] = useState('');
  const [title, setTitle] = useState('');
  const [optionList, setOptionList] = useState<string[]>(['', '', '', '']);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isPlural, setIsPlural] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const onChangeTitle = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setTitle(value);
  };
  const onChangeOption = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = e.target.value;

    setOptionList([
      ...optionList.slice(undefined, index),
      value,
      ...optionList.slice(index + 1),
    ]);
  };

  interface CalenderValue {
    date: string;
    time: string;
  }

  const CalenderValueHandler = ({ date, time }: CalenderValue) => {
    if (time === '') {
      time = '23:59:59';
    }
    setCalendarValue(
      date.slice(0, 4) +
        '-' +
        date.slice(4, 6) +
        '-' +
        date.slice(6) +
        'T' +
        time +
        '+00:00',
    );
    // TODO : ISO 8601 Time
  };

  const PlusOption = () => {
    // setPlusBtn(!PlusBtn);
    setOptionList([...optionList, '']);
  };

  const DelBtn = (index: number) => {
    const newList = optionList.filter((str, num) => {
      if (index === num) {
        return false;
      }
      return true;
    });
    setOptionList(newList);
  };

  const CreateBtnHandler = () => {
    if (title === '') {
      dispatch(notify('제목을 입력해주세요.'));
      return;
    }
    if (optionList.filter((el) => el !== '').length < 2) {
      dispatch(notify('선택지는 최소 2개 이상입니다.'));
      return;
    }
    if (calendarValue === '') {
      dispatch(notify('마감 시간을 입력해주세요.'));
      return;
    }
    const accessToken = localStorage.getItem('accessToken');
    apiAxios
      .post(
        'users/me/polls',
        {
          subject: title,
          expirationDate: calendarValue,
          isPrivate: isPrivate,
          isPlural: isPlural,
          options: optionList
            .filter((el) => el !== '')
            .map((el) => {
              return { content: el };
            }),
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )
      .then((res) => {
        dispatch(notify('투표가 등록되었습니다.'));
        // window.location.href = '/';
        navigate('/');
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };

  return (
    <Outer>
      <Container>
        <SubBox>
          <Title
            placeholder="질문 내용"
            value={title}
            onChange={onChangeTitle}
          />

          {/* option section */}

          <OptionContainer>
            {optionList.map((el, index) => {
              return (
                <Option key={index}>
                  <OptionInput
                    placeholder="선택지 입력"
                    value={optionList[index]}
                    onChange={(e) => onChangeOption(e, index)}
                  />
                  <DelOptionBtn onClick={() => DelBtn(index)}>
                    <FaMinus style={{ height: '100%', color: 'red' }} />
                  </DelOptionBtn>
                </Option>
              );
            })}
            <PlusOptionBtn onClick={PlusOption}>
              <FaPlus style={{ color: 'white' }} />
            </PlusOptionBtn>
          </OptionContainer>

          {/* checkbox & calendar section */}

          <CheckboxContainer>
            <div>
              <CheckboxAndTitle>
                <Checkbox
                  type={'checkbox'}
                  onChange={() => {
                    setIsPlural(!isPlural);
                  }}
                />
                <CheckboxTitle>중복 체크 여부</CheckboxTitle>
              </CheckboxAndTitle>
              <CheckboxAndTitle>
                <Checkbox
                  type={'checkbox'}
                  onChange={() => {
                    setIsPrivate(!isPrivate);
                  }}
                />
                <CheckboxTitle>비공개</CheckboxTitle>
              </CheckboxAndTitle>
            </div>
            {/* <CalendarBtn
            type="date"
            onChange={dateSelect}
            value={calendarValue}
          ></CalendarBtn> */}
            <Scheduler
              translate={'0, auto'}
              CalenderValueHandler={CalenderValueHandler}
            />
          </CheckboxContainer>
          <CreateBtn onClick={CreateBtnHandler}>투표만들기</CreateBtn>
        </SubBox>
      </Container>
    </Outer>
  );
}

export default CreateVote;
