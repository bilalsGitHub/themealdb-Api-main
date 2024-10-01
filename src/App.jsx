import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(false); // Hata durumunu takip etmek için

  const fetchData = async (term = "") => {
    try {
      const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`
      );
      if (response.data.meals) {
        setItems(response.data.meals);
        setError(false); // Veri bulundu, hatayı sıfırla
      } else {
        setItems([]); // Eğer veri yoksa boş bir dizi ayarla
        setError(true); // Hata durumu, ürün bulunamadı
      }
    } catch (error) {
      console.error(error);
      setError(true); // API çağrısında hata olursa hatayı ayarla
    }
  };

  useEffect(() => {
    fetchData(); // İlk renderda tüm yemekleri getir
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData(searchTerm); // Arama terimine göre veriyi getir
    setSearchTerm(""); // Arama terimini sıfırla
  };

  const handleClear = () => {
    setSearchTerm(""); // Arama terimini sıfırla
    fetchData(); // Tüm yemekleri geri getir
    setError(false); // Hata mesajını sıfırla
  };

  const itemlist = items.map(({ strMeal, strMealThumb, idMeal }) => {
    return (
      <section key={idMeal} className="card">
        <img src={strMealThumb} alt={strMeal} />
        <section className="content">
          <p>{strMeal}</p>
          <p>{idMeal}</p>
        </section>
      </section>
    );
  });

  return (
    <>
      <div className="body">
        <form className="form" onSubmit={handleSubmit}>
          <h2>Themealdb Api</h2>
          <div className="inputfield">
            <input
              value={searchTerm}
              className="food-input"
              type="text"
              placeholder="Type in"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="button" onClick={handleClear}>
              Clear
            </button>
          </div>
        </form>

        {/* Eğer hata varsa hata mesajını göster */}
        {error && <div>No items found. Please try again.</div>}

        {/* Eğer hata yoksa listeyi göster */}
        {!error && <div className="items-container">{itemlist}</div>}
      </div>
    </>
  );
}

export default App;
