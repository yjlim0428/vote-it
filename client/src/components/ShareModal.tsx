import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { copyClipboard } from '../functions';
import { FaRegCopy, FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { share2info } from '../lib/share2info';
import { useDispatch } from 'react-redux';
import { notify } from '../modules/notification';
import {
  share2NaverBand,
  share2NaverBlog,
  share2Pinterest,
  share2Twitter,
} from '../lib/initialize';

const Canvas = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.4);
  opacity: 0;
  transition: opacity 0.5s;
  z-index: 998;
  &.show {
    opacity: 1;
  }
`;

const View = styled.div`
  --shareModal-width: 400px;
  --shareModal-height: 256px;
  display: flex;
  font-family: 'SUIT-Light';
  flex-direction: column;
  position: absolute;
  left: calc(50vw - var(--shareModal-width) / 2);
  top: calc(50vh - var(--shareModal-height) / 2);
  height: var(--shareModal-height);
  width: var(--shareModal-width);
  color: var(--font);
  background-color: var(--modal-bg);
  border-radius: 16px;
  /* border: var(--modal-border); */
  box-shadow: -1px -1px 1px var(--box-shadow),
    2px 2px 6px var(--box-shadow-darker);
  z-index: 999;
  opacity: 0;
  transition: all 0.5s;
  &.show {
    opacity: 1;
  }

  .subject {
    text-align: left;
    font-size: 18px;
    font-weight: bold;
    flex: 1 0 auto;
    margin: 16px;
    .exit {
      font-weight: normal;
      font-size: 18px;
      width: 24px;
      height: 24px;
      text-align: center;
      float: right;
      transform: translate(4px, -4px);
      cursor: pointer;
    }
  }
  .wrapper {
    flex: 2 0 auto;
    margin: 16px;
    &.first {
      margin-top: 8px;
      margin-bottom: 0;
      flex: 4 0 auto;
      .share2sns {
        display: flex;
        overflow-x: scroll;
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
        ::-webkit-scrollbar {
          display: none;
        }
      }
      .arrows {
        position: relative;
        width: 0;
      }
      img {
        width: 60px;
      }
    }

    &.second {
      padding-top: 16px;
      border-top: 1px solid var(--border-lighter);
    }
  }
  .input-wrapper {
    margin: auto;
    padding: 0 4px;
    border: 1px solid var(--border-lighter);
    border-radius: 8px;
    width: fit-content;
  }
  input {
    font-family: 'SUIT-Light';
    width: 256px;
    margin: 4px;
    padding: 4px;
    font-size: 16px;
    border: none;
    border-right: 1px solid var(--border-lighter);
  }
  button {
    width: 24px;
    height: 24px;
    margin: 4px;
    font-size: 16px;
    transform: translate(0, 2px);
    border-radius: 100px;
    background-color: transparent;
    :hover {
      color: var(--font-lighter);
      background-color: transparent;
    }
    -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
  }
`;

const ShareToSNS = styled.div`
  user-select: none;
  font-size: 0.8rem;
  margin: 0 4px;
  padding: 8px;
  border-radius: 8px;
  white-space: pre;
  cursor: pointer;
  :hover {
    background-color: var(--button-bg-lighter);
  }
  div {
    display: table-cell;
    margin-top: 4px;
    width: 60px;
    height: 32px;
    text-align: center;
    align-items: center;
    vertical-align: middle;
  }
`;

const SlideButton = styled.div<{ right: boolean }>`
  user-select: none;
  position: absolute;
  top: 40px;
  left: ${(props) => (props.right ? '346px' : '-10px')};
  font-size: 22px;
  line-height: 32px;
  width: 32px;
  height: 32px;
  background-color: var(--button-bg);
  border-radius: 100px;
  cursor: pointer;
  svg {
    transform: ${(props) =>
      props.right ? 'translate(1px, 1px)' : 'translate(-1px, 1px)'};
    margin-top: 4px;
  }
  :hover {
    background-color: var(--button-bg-lighter);
  }
`;

interface ShareModal {
  isOn: boolean;
  isShow: boolean;
}

interface Props {
  voteSub: string;
  shareModal: ShareModal;
  setShareModal: Dispatch<SetStateAction<ShareModal>>;
  location: number;
}

export const Share = ({
  voteSub,
  shareModal,
  setShareModal,
  location,
}: Props) => {
  const copyUrlRef = useRef(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const urlOrigin = window.location.origin;
  const urlMod = btoa(btoa(location + '?approach=allow'));
  const urlValue = urlOrigin + '/vote/' + urlMod;
  // const [scrollBtn, setScrollBtn] = useState({ left: false, right: true });
  const dispatch = useDispatch();
  const copyUrl = () => {
    copyClipboard(
      urlValue,
      () => {
        // 성공했을 경우 Toast 메시지 팝업
        dispatch(notify('클립보드에 주소가 복사되었습니다.'));
      },
      () => {
        // 실패했을 경우 Toast 메시지 팝업
        dispatch(notify('복사 실패, 다시 시도해주세요.'));
      },
    );
  };

  const setModalOff = () => {
    setShareModal({ isOn: false, isShow: false });
  };

  const { Kakao } = window;

  const handleShare2sns =
    (idx: number) => (e: React.MouseEvent<HTMLDivElement>) => {
      const funcList = [
        () => {
          // 이메일 공유하기
          window.open(
            `mailto:?subject=Vote-it 링크 공유&body=아래 링크를 통해 투표에 참여해주세요!%0D%0A 주제: ${voteSub}%0D%0A${urlValue}`,
          );
        },
        () => {
          // 카카오 메시지 템플릿 종류는 다음 링크 참고 후 적절한 것으로 변경 가능
          // https://developers.kakao.com/docs/latest/ko/message/message-template#type
          Kakao.Link.sendDefault({
            objectType: 'text',
            text: `[Vote-it] 투표에 참여해주세요! 주제: ${voteSub}`,
            link: {
              mobileWebUrl: `${urlValue}`,
              webUrl: `${urlValue}`,
            },
          });
        },
        () => {
          // 카카오스토리 공유하기
          Kakao.Story.share({
            url: `${urlValue}`,
            text: `[Vote-it] 투표에 참여해주세요! [${voteSub}]\n [별도 링크: ${urlValue}]\n#VoteIt #투표`,
          });
        },
        () => {
          // 페이스북 공유하기
          //! 링크오류가 발생함. 점검필요
          //! localhost가 아닌 www상 도메인에서도 URL오류 발생하는지 확인 필요
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${urlValue}`,
          );
        },

        () => {
          share2NaverBlog(urlValue, `[Vote-it] ${voteSub}`, 500, 500);
        },
        () => {
          share2NaverBand(
            urlValue,
            `[Vote-it] 투표에 참여해주세요!%0D%0A 주제: ${voteSub}`,
            500,
            500,
          );
        },
        () => {
          // 트위터 공유하기
          share2Twitter(
            urlValue,
            `[Vote-it] 투표해줘요!\n주제: ${voteSub}\n`,
            600,
            500,
          );
        },
        () => {
          share2Pinterest(urlValue, `[Vote-it] 투표주제: ${voteSub}`, 500, 500);
        },
      ];
      funcList[idx]();
    };

  // const innerWidth = scrollRef.current?.clientWidth || 0;
  // const scrollWidth = scrollRef.current?.scrollWidth || 0;
  // const endOfScroll = scrollWidth - innerWidth;
  const handleScroll = (key: number) => () => {
    const scrollLeft = scrollRef.current?.scrollLeft || 0;
    scrollRef.current?.scrollTo({
      top: 0,
      left: scrollLeft + 168 * key,
      behavior: 'smooth',
    });
  };

  const handleRowWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    // e.preventDefault();
    // e.stopPropagation();
    if (e.deltaY > 0)
      scrollRef.current?.scrollBy({ top: 0, left: 168, behavior: 'smooth' });
    else if (e.deltaY < 0)
      scrollRef.current?.scrollBy({ top: 0, left: -168, behavior: 'smooth' });
  };
  // const handleScrollBtn = () => {
  //   const scrollLeft = scrollRef.current?.scrollLeft || 0;
  //   console.log(scrollLeft);
  //   if (scrollLeft !== 0) setScrollBtn({ ...scrollBtn, left: true });
  //   else setScrollBtn({ ...scrollBtn, left: false });
  //   if (scrollLeft >= endOfScroll) setScrollBtn({ ...scrollBtn, right: false });
  //   else setScrollBtn({ ...scrollBtn, right: true });
  // };

  // useEffect(() => {
  //   return () => {
  //     handleScrollBtn();
  //   };
  // },[handleScroll]);
  // const { Kakao } = window;

  const modalESC = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setModalOff();
    }
  };

  useEffect(() => {
    document.addEventListener('keyup', modalESC);
    return () => {
      document.removeEventListener('keyup', modalESC);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Canvas
        onClick={setModalOff}
        className={shareModal.isShow ? 'canvas show' : 'canvas'}
      />
      <View className={shareModal.isShow ? 'view show' : 'view'}>
        <div className="subject">
          공유
          <div className="exit" onClick={setModalOff}>
            &times;
          </div>
        </div>
        <div onWheel={handleRowWheel} className="wrapper first">
          <div className="arrows">
            <SlideButton onClick={handleScroll(-1)} right={false}>
              <FaAngleLeft />
            </SlideButton>
            <SlideButton onClick={handleScroll(1)} right={true}>
              <FaAngleRight />
            </SlideButton>
          </div>
          <div ref={scrollRef} className="share2sns">
            {share2info.map((v, i) => {
              return (
                <ShareToSNS key={i} onClick={handleShare2sns(i)}>
                  <img src={v.src} alt={v.alt} />
                  <div>{v.name}</div>
                </ShareToSNS>
              );
            })}
          </div>
        </div>
        <div className="wrapper second">
          <div className="input-wrapper">
            <input ref={copyUrlRef} value={urlValue} readOnly />
            <button
              className="copyBtn"
              onClick={() => {
                // document.querySelector('.copyBtn')?.classList.add('btn-touch');
                copyUrl();
              }}
            >
              <FaRegCopy />
            </button>
          </div>
        </div>
      </View>
    </>
  );
};
