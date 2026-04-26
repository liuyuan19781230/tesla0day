import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Activity, AlertTriangle, Shield, TrendingUp, Clock, DollarSign } from "lucide-react";
import "./styles.css";

const defaultInputs = {
  account: 1000,
  price: 245.32,
  vwap: 244.8,
  atr: 4.2,
  trend: "up",
  volume: "high",
  openingRangeBreak: true,
  timeWindow: "A",
  lossesToday: 0,
  dailyPnL: 0
};

function getTradeScore(data) {
  let score = 0;
  if (data.trend !== "chop") score += 1;
  if (Number(data.atr) > 3.5) score += 1;
  if (data.volume === "high") score += 1;
  if (data.openingRangeBreak) score += 1;
  return score;
}

function getTradeStatus(score, data) {
  if (data.lossesToday >= 3 || data.dailyPnL <= -50) {
    return {
      label: "STOP TRADING",
      tone: "red",
      detail: "Risk lock triggered. No more trades today."
    };
  }

  if (data.timeWindow === "C") {
    return {
      label: "NO TRADE",
      tone: "red",
      detail: "Low-quality time window. Avoid chop and theta decay."
    };
  }

  if (score >= 3 && data.timeWindow === "A") {
    return {
      label: "ALLOW TRADE",
      tone: "green",
      detail: "Conditions are aligned. Trade only with strict stop."
    };
  }

  if (score >= 2) {
    return {
      label: "OBSERVE",
      tone: "yellow",
      detail: "Setup is not clean enough. Wait for confirmation."
    };
  }

  return {
    label: "NO TRADE",
    tone: "red",
    detail: "Market quality is poor. Protect capital."
  };
}

function getPositionSize(account, atr, lossesToday) {
  const baseRisk = lossesToday >= 2 ? 0.005 : lossesToday === 1 ? 0.01 : 0.02;
  const volFactor = atr > 4 ? 1.5 : atr > 3 ? 1 : 0.5;
  return Math.max(5, Math.round(account * baseRisk * volFactor));
}

function Card({ title, icon, children }) {
  return (
    <div className="card">
      <div className="card-title">
        {icon}
        <span>{title}</span>
      </div>
      {children}
    </div>
  );
}

function Pill({ tone, children }) {
  return <span className={`pill ${tone}`}>{children}</span>;
}

function App() {
  const [data, setData] = useState(defaultInputs);

  const score = useMemo(() => getTradeScore(data), [data]);
  const status = useMemo(() => getTradeStatus(score, data), [score, data]);
  const position = useMemo(
    () => getPositionSize(Number(data.account), Number(data.atr), Number(data.lossesToday)),
    [data.account, data.atr, data.lossesToday]
  );

  function update(key, value) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <main className="page">
      <section className="hero">
        <div>
          <p className="eyebrow">TSLA 0DTE MVP</p>
          <h1>Trade OS Dashboard</h1>
          <p className="sub">
            A simple red/yellow/green decision system for TSLA 0DTE trades:
            market quality, trade window, position size, and risk lock.
          </p>
        </div>
        <div className={`status-box ${status.tone}`}>
          <span>{status.label}</span>
          <small>{status.detail}</small>
        </div>
      </section>

      <section className="grid metrics">
        <Card title="Today Score" icon={<Activity size={18} />}>
          <div className="big">{score}/4</div>
          <p>Trend + volatility + volume + opening range.</p>
        </Card>

        <Card title="Trade Window" icon={<Clock size={18} />}>
          <div className="big">Window {data.timeWindow}</div>
          <p>{data.timeWindow === "A" ? "High quality" : data.timeWindow === "B" ? "Watch only" : "Avoid trading"}</p>
        </Card>

        <Card title="Position Size" icon={<DollarSign size={18} />}>
          <div className="big">${position}</div>
          <p>Risk-adjusted for volatility and losses today.</p>
        </Card>

        <Card title="Risk Status" icon={<Shield size={18} />}>
          <div className="big">
            {data.lossesToday >= 3 || data.dailyPnL <= -50 ? "Locked" : "Active"}
          </div>
          <p>Stops trading after 3 losses or -$50 daily P/L.</p>
        </Card>
      </section>

      <section className="grid two">
        <Card title="Market State" icon={<TrendingUp size={18} />}>
          <div className="rows">
            <div><span>TSLA Price</span><strong>${data.price}</strong></div>
            <div><span>VWAP</span><strong>${data.vwap}</strong></div>
            <div><span>ATR</span><strong>{data.atr}</strong></div>
            <div><span>Trend</span><Pill tone={data.trend === "chop" ? "red" : "green"}>{data.trend}</Pill></div>
            <div><span>Volume</span><Pill tone={data.volume === "high" ? "green" : "yellow"}>{data.volume}</Pill></div>
          </div>
        </Card>

        <Card title="Manual Controls / Inputs" icon={<AlertTriangle size={18} />}>
          <div className="form">
            <label>Account Size ($)
              <input type="number" value={data.account} onChange={(e) => update("account", e.target.value)} />
            </label>

            <label>TSLA Price
              <input type="number" value={data.price} onChange={(e) => update("price", e.target.value)} />
            </label>

            <label>VWAP
              <input type="number" value={data.vwap} onChange={(e) => update("vwap", e.target.value)} />
            </label>

            <label>ATR
              <input type="number" value={data.atr} onChange={(e) => update("atr", e.target.value)} />
            </label>

            <label>Trend
              <select value={data.trend} onChange={(e) => update("trend", e.target.value)}>
                <option value="up">Up</option>
                <option value="down">Down</option>
                <option value="chop">Chop</option>
              </select>
            </label>

            <label>Volume
              <select value={data.volume} onChange={(e) => update("volume", e.target.value)}>
                <option value="high">High</option>
                <option value="low">Low</option>
              </select>
            </label>

            <label>Time Window
              <select value={data.timeWindow} onChange={(e) => update("timeWindow", e.target.value)}>
                <option value="A">A - High Quality</option>
                <option value="B">B - Watch</option>
                <option value="C">C - Avoid</option>
              </select>
            </label>

            <label>Losses Today
              <input type="number" value={data.lossesToday} onChange={(e) => update("lossesToday", e.target.value)} />
            </label>

            <label>Daily P/L ($)
              <input type="number" value={data.dailyPnL} onChange={(e) => update("dailyPnL", e.target.value)} />
            </label>

            <label className="checkbox">
              <input type="checkbox" checked={data.openingRangeBreak} onChange={(e) => update("openingRangeBreak", e.target.checked)} />
              Opening range breakout
            </label>
          </div>
        </Card>
      </section>

      <section className="rules">
        <h2>Trading Rules</h2>
        <div className="rule-grid">
          <div>Score ≥ 3 + Window A → Allow trade</div>
          <div>Score = 2 → Observe only</div>
          <div>Window C → No trade</div>
          <div>3 losses or -$50 → Stop trading</div>
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
