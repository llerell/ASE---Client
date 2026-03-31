import { useState, useEffect, useRef } from 'react'
import './App.css'
import { getGrid, updateGrid, changePixel, getLastUpdateTime } from './api/fetch.js'
import { Grid } from './grid/grid.jsx'

const baseUrl = import.meta.env.VITE_PIXELWAR_API_URL;
import { TransformWrapper,TransformComponent } from 'react-zoom-pan-pinch'
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";

const initialGrid = new Map();
for (let i = 0; i < 100; i++) {
  for (let j = 0; j < 100; j++) {
    const key = `${j},${i}`;
    initialGrid.set(key, { x: j, y: i, r: 255, g: 255, b: 255 });
  }
}

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  let refreshRate = 1000;
  const [grid, setGrid] = useState(initialGrid);
  const [r, setR] = useState(0);
  const [g, setG] = useState(0);
  const [b, setB] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(0);
  const lastUpdateRef = useRef(lastUpdate);

  const [color, setColor] = useColor("rgb(86 30 203)");


  useEffect(() => {
    lastUpdateRef.current = lastUpdate;
  }, [lastUpdate]);

  const login = () => {
    setError(null);

    fetch(`${baseUrl.replace(/\/$/, "")}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    })
    .then(res => {
      if (!res.ok) {
        return res.json().then(err => {
          throw new Error(err.message || "Login failed");
        });
      }
      return res.json();
    })
    .then(data => {
      setToken(data.token);
      localStorage.setItem("token", data.token);
    })
    .catch(err => setError(err.message));
  };

  const register = () => {
    setError(null);

    fetch(`${baseUrl.replace(/\/$/, "")}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    })
    .then(res => {
      if (!res.ok) {
        return res.json().then(err => {
          throw new Error(err.message || "Register failed");
        });
      }
      return res.json();
    })
    .then(data => {
      setToken(data.token);
      localStorage.setItem("token", data.token);
    })
    .catch(err => setError(err.message));
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  useEffect(() => {
    if (!token) return;

    async function init() {
      setIsLoading(true);
      setError(null);

      try {
        await getGrid(setGrid, token);
      } catch (err) {
        setError("Error loading data: " + err.message);
      } finally {
        setIsLoading(false);
        const time = await getLastUpdateTime(token);
        setLastUpdate(time);
      }
    }

    async function refreshGrid() {
      try {
        const time = await getLastUpdateTime(token);
        if (time <= lastUpdateRef.current) return;
        await updateGrid(setGrid, lastUpdateRef.current, token);
        setLastUpdate(time);
        console.log("Updated last update time to: " + lastUpdateRef.current);
      } catch (err) {
        console.log("Refresh error:", err.message);
      }
    }
    init();
    const intervalId = setInterval(refreshGrid, refreshRate);

    return () => clearInterval(intervalId);
  }, [token]);

  if (!token) {
    return (
      <div>
        <h2>{isRegistering ? "Register" : "Login"}</h2>

        {error && <div style={{color: "red"}}>{error}</div>}

        <input
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {isRegistering ? (
          <button onClick={register}>Register</button>
        ) : (
          <button onClick={login}>Login</button>
        )}

        <br /><br />

        <button onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering
            ? "Already have an account ? Login"
            : "Create an account"}
        </button>
      </div>
    );
  }

  return (
    <>
      <h1>Pixel War</h1>

      <button onClick={logout}>Logout</button>

      {error && <div style={{color: 'red'}}>{error}</div>}

      <div className="grid-viewport">
        <TransformWrapper
          initialScale={1}
          minScale={0.5}
          maxScale={20}
          centerOnInit={true}
          limitToBounds={false}
          disabled={isLoading}
        >
          <TransformComponent
            wrapperStyle={{ width: '100%', height: '100%' }}
            contentStyle={{ width: '1000px', height: '1000px' }}
          >
            <Grid
              grid={grid}
              isLoading={isLoading}
              color={{ r, g, b }}
            />
          </TransformComponent>
        </TransformWrapper>
      </div>

      <ColorPicker hideInput={true} width={100} color={color} onChange={(res) => {
        setColor(res)
        setR(res.rgb.r)
        setG(res.rgb.g)
        setB(res.rgb.b)

      }} />

    </>
  );
}

export default App;