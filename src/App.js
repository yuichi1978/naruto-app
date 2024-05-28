import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

// 定数で15ページで設定してレンダリングさせる
const limit = 15;

function App() {
  // キャラクターを表示するためuseStateを使う 初期値は空配列をいれてmapでレンダリングさせる
  const [characters, setCharacters] = useState([]);
  // 前回のページを格納するstateを作る
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCharacters();
  }, []);

  // 1 キャラクターを呼び出すAPIをたたいてデータを出力させるため非同期関数のasyncを使う
  const fetchCharacters = async (page) => {
    // 2 apiUrlの定数を作りAPIエンドポイントを貼り付ける
    const apiUrl = "https://narutodb.xyz/api/character";
    // limitの定数を作り800を指定する
    setIsLoading(true);

    // 3 次にaxiosを使ってAPIをたたく部分を書いていく
    // axiosのGETメソッドを使うリクエストを送るデータが返るのを待つ
    // paramsのキーでページの2を入力して２ページ目のデータがとれる
    const result = await axios.get(apiUrl, { params: { page, limit } });
    setCharacters(result.data.characters);
    setIsLoading(false);
  };

  // handleNextを押したときの次へのメソッドを非同期処理で書いていく
  const handleNext = async () => {
    const nextPage = page + 1;
    // fetchCharactersを呼び出してpageを１ページづつ表示させる
    await fetchCharacters(nextPage);
    // pageStateの中身をnextPageを使い更新する
    setPage(nextPage);
  };

  const handlePrev = async () => {
    const prevPage = page - 1;
    await fetchCharacters(prevPage);
    setPage(prevPage);
  };

  return (
    <div className="container">
      {/* headerコンテンツ */}
      <div className="header">
        <div className="header-content">
          <img src="logo.png" alt="logo" className="logo" />
        </div>
      </div>

      {/* 三項演算子でisLoadingがtrueの場合はloadingが表示されfalseの場合は非表示になる */}
      {isLoading ? (
        <div>Now Loading...</div>
      ) : (
        <main>
          <div className="cards-container">
            {/* キャラクターのデータを出力してループでまわす */}
            {characters.map((character) => (
              <div className="card" key={character.id}>
                <img
                  // 三項演算子は前の条件で？の後ろの処理である character.images[0]
                  // キャラクターの一前目の画像がnullでなければcharacter.images[0]が定義され
                  src={
                    character.images[0] != null
                      ? character.images[0]
                      : "dummy.png"
                  }
                  className="card-image"
                  alt="character"
                />
                <div className="card-content">
                  <h3 className="card-title">{character.name}</h3>
                  <p className="card-description">
                    {/* 三項演算子で??は左側の条件がnullでない場合は表示して左側がnullだったら右側を表示する */}
                    {character.debut?.appearsIn ?? "なし"}
                  </p>
                  <div className="card-footer">
                    <span className="affiliation">
                      {/* 三項演算子でpersonalがnullでない場合は表示してnullならなしが表示される */}
                      {character.personal?.affiliation ?? "なし"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="pager">
            {/* disabledで１ページ前はクリックしても押せなくなる */}
            <button disabled={page === 1} onClick={handlePrev} className="prev">
              Previous
            </button>
            {/* page-numberとは現在のページ数が１ */}
            {/* pageが動的に１ページごと切り替わる */}
            <span className="page-number">{page}</span>
            {/* limitよりも現在のページで取得したキャラクターズの数が少なければtrueになる */}
            <button
              disabled={limit > characters.length}
              onClick={handleNext}
              className="next"
            >
              Next
            </button>
          </div>
        </main>
      )}
    </div>
  );
}

export default App;
