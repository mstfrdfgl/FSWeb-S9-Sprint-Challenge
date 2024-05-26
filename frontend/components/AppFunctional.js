import React, { useState } from "react";
import axios from "axios";
// önerilen başlangıç stateleri
const initialMessage = "";
const initialEmail = "";
const initialSteps = 0;
const initialIndex = 4; //  "B" nin bulunduğu indexi

export default function AppFunctional(props) {
  // AŞAĞIDAKİ HELPERLAR SADECE ÖNERİDİR.
  // Bunları silip kendi mantığınızla sıfırdan geliştirebilirsiniz.
  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);
  const [steps, setSteps] = useState(initialSteps);
  const [index, setIndex] = useState(initialIndex);

  function getXY() {
    // Koordinatları izlemek için bir state e sahip olmak gerekli değildir.
    // Bunları hesaplayabilmek için "B" nin hangi indexte olduğunu bilmek yeterlidir.
    const x = (index % 3) + 1;
    const y = Math.floor(index / 3) + 1;
    return `(${x}, ${y})`;
  }

  function getXYMesaj(event) {
    // Kullanıcı için "Koordinatlar (2, 2)" mesajını izlemek için bir state'in olması gerekli değildir.
    // Koordinatları almak için yukarıdaki "getXY" helperını ve ardından "getXYMesaj"ı kullanabilirsiniz.
    // tamamen oluşturulmuş stringi döndürür.
    return `Koordinatlar ${getXY()}`;
  }

  function sonrakiIndex(event) {
    // Bu helper bir yön ("sol", "yukarı", vb.) alır ve "B" nin bir sonraki indeksinin ne olduğunu hesaplar.
    // Gridin kenarına ulaşıldığında başka gidecek yer olmadığı için,
    // şu anki indeksi değiştirmemeli.
    const { id } = event.target;
    if (id === "left" && index % 3 !== 0) {
      setIndex(index - 1);
      setSteps(steps + 1);
      setMessage(initialMessage);
    } else if (id === "left" && index % 3 === 0) {
      setMessage("Sola gidemezsiniz");
    }
    if (id === "up" && index >= 3) {
      setIndex(index - 3);
      setSteps(steps + 1);
      setMessage(initialMessage);
    } else if (id === "up" && index < 3) {
      setMessage("Yukarıya gidemezsiniz");
    }
    if (id === "right" && index % 3 !== 2) {
      setIndex(index + 1);
      setSteps(steps + 1);
      setMessage(initialMessage);
    } else if (id === "right" && index % 3 === 2) {
      setMessage("Sağa gidemezsiniz");
    }
    if (id === "down" && index < 6) {
      setIndex(index + 3);
      setSteps(steps + 1);
      setMessage(initialMessage);
    } else if (id === "down" && index >= 6) {
      setMessage("Aşağıya gidemezsiniz");
    }
  }

  function reset() {
    // Tüm stateleri başlangıç ​​değerlerine sıfırlamak için bu helperı kullanın.
    setMessage(initialMessage);
    setEmail(initialEmail);
    setSteps(initialSteps);
    setIndex(initialIndex);
  }

  // function ilerle(event) {
  //   // Bu event handler, "B" için yeni bir dizin elde etmek üzere yukarıdaki yardımcıyı kullanabilir,
  //   // ve buna göre state i değiştirir.
  // }

  function onChange(event) {
    // inputun değerini güncellemek için bunu kullanabilirsiniz
    setEmail(event.target.value);
  }

  function onSubmit(event) {
    // payloadu POST etmek için bir submit handlera da ihtiyacınız var.
    event.preventDefault();
    const formData = { steps: steps, email: email, x: 1, y: 2 };
    axios
      .post("http://localhost:9000/api/result", formData)
      .then((response) => {
        setMessage(response.data.message);
        setEmail(initialEmail);
      })
      .catch((error) => {
        setMessage(error.response.data.message);
      });
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMesaj()}</h3>
        <h3 id="steps">{steps} kere ilerlediniz</h3>
      </div>
      <div id="grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div key={idx} className={`square${idx === index ? " active" : ""}`}>
            {idx === index ? "B" : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={sonrakiIndex}>
          SOL
        </button>
        <button id="up" onClick={sonrakiIndex}>
          YUKARI
        </button>
        <button id="right" onClick={sonrakiIndex}>
          SAĞ
        </button>
        <button id="down" onClick={sonrakiIndex}>
          AŞAĞI
        </button>
        <button id="reset" onClick={reset}>
          reset
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          id="email"
          type="email"
          value={email}
          placeholder="email girin"
        ></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  );
}
