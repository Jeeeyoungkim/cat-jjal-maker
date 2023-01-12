import logo from './logo.svg';
import React from "react"
import './App.css';
import Title from "./components/Title";

const jsonLocalStorage = {
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key) => {
    return JSON.parse(localStorage.getItem(key));
  },
};

const fetchCat = async (text) => {
  const OPEN_API_DOMAIN = "https://cataas.com";
  const response = await fetch(`${OPEN_API_DOMAIN}/cat/says/${text}?json=true`);
  const responseJson = await response.json();
  return `${OPEN_API_DOMAIN}/${responseJson.url}`;
};


const Form = ({ updateMaincat }) => {
  const includesHangul = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/i.test(text); //한글 있는지 검증
  const [value, setValue] = React.useState(''); //기본값은 ''
  const [errorMessage, setErrorMessage] = React.useState('');

  function handleInputChange(e) {
    const userValue = e.target.value;
    console.log(includesHangul(userValue));

    if (includesHangul(userValue)) {
      setErrorMessage("한글은 입력할 수 없습니다.");
    } else {
      setErrorMessage(''); //에러메시지 초기화
    }
    setValue(userValue.toUpperCase()); //대문자로 만들기
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    setErrorMessage(''); //초기화 이렇게 해도 됨
    if (value === '') {
      setErrorMessage('빈 값으로 만들 수 없습니다.');
      return;
    }

    updateMaincat(value);
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <input type="text" name="name" placeholder="영어 대사를 입력해주세요"
        value={value}
        onChange={handleInputChange} />
      <button type="submit">생성</button>
      <p style={{ color: 'red' }}>{errorMessage}</p>
    </form>
  )
}

function CatItem(props) {
  return (
    <li>
      <img src={props.img} style={{
        width: "150px"
      }} />
    </li>
  )
}

function Favorites({ favorites }) {
  if (favorites.length === 0) {
    return <div>사진 위 하트를 눌러 고양이 사진을 저장해봐요!</div>;
  }

  return (
    <ul className="favorites">
      {favorites.map(cat => <CatItem img={cat} key={cat} />
      )}
    </ul>
  )
}

const MainCard = ({ img, onHeartClick, alreadayFavorite }) => {
  const heartIcon = alreadayFavorite ? "💖" : "🤍";

  return (
    <div className="main-card">
      <img src={img} alt="고양이" width="400" />
      <button onClick={onHeartClick}>{heartIcon}</button>
    </div>
  )
}

const App = () => {
  const CAT1 = "https://cataas.com/cat/HSENVDU4ZMqy7KQ0/says/react";
  const CAT2 = "https://cataas.com/cat/BxqL2EjFmtxDkAm2/says/inflearn";
  const CAT3 = "https://cataas.com/cat/18MD6byVC1yKGpXp/says/JavaScript";


  const [counter, setCounter] = React.useState(() => {
    return jsonLocalStorage.getItem("counter")
  }); //로컬스토리지에 저장된 카운터 불러오기,

  const [mainCat, setMainCat] = React.useState(CAT1);

  const [favorites, setFavorites] = React.useState(() => {
    return jsonLocalStorage.getItem("favorites") || []
  }); //null값이면 빈배열로 해라

  const alreadayFavorite = favorites.includes(mainCat);

  async function setInitialCat() {
    const newCat = await fetchCat('firstcat');
    console.log(newCat);
    setMainCat(newCat);
  }

  //setInitialCat(); -> 앱이 만들어 졌을때 한번만 불리는게 아니라 계에에속 불리고 있다....

  React.useEffect(() => {
    setInitialCat();
  }, []);

  async function updateMaincat(value) {
    const newCat = await fetchCat(value);

    setMainCat(newCat);

    setCounter((prev) => {
      const nextCounter = prev + 1;
      jsonLocalStorage.setItem('counter', nextCounter);
      return nextCounter;
    })
    //setState에 변수 대신 함수를 넣으면 지연초기화가 된담. 
  }

  function handleHeartClick() {
    const nextFavorites = [...favorites, mainCat]; //favorites 기존 배열에 CAT3 추가
    setFavorites(nextFavorites);
    jsonLocalStorage.setItem('favorites', nextFavorites);
  }

  const counterTitle = counter == null ? "" : counter + "번째 ";

  return (
    <div>
      <Title>{counterTitle} 야옹이 가라사대</Title>
      <Form updateMaincat={updateMaincat} />
      <MainCard img={mainCat} onHeartClick={handleHeartClick} alreadayFavorite={alreadayFavorite} />
      <Favorites favorites={favorites} />
    </div>
  )
};

export default App; //파일을 모듈처럼 가져오고 ? 내보내는 !!??!
