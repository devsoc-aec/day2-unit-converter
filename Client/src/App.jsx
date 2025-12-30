import { useState, useEffect } from 'react'

function App() {
  const [value, setValue] = useState('')
  const [fromUnit, setFromUnit] = useState('meters')
  const [toUnit, setToUnit] = useState('feet')
  const [result, setResult] = useState('')
  const [history, setHistory] = useState([])

  const conversions = {
    meters: { feet: 3.28084, inches: 39.3701, kilometers: 0.001, miles: 0.000621371 },
    feet: { meters: 0.3048, inches: 12, kilometers: 0.0003048, miles: 0.000189394 },
    kilograms: { pounds: 2.20462, grams: 1000, ounces: 35.274 },
    pounds: { kilograms: 0.453592, grams: 453.592, ounces: 16 },
    celsius: { fahrenheit: (c) => c * 9 / 5 + 32, kelvin: (c) => c + 273.15 },
    fahrenheit: { celsius: (f) => (f - 32) * 5 / 9, kelvin: (f) => (f - 32) * 5 / 9 + 273.15 }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/history').then(res => res.json())
      setHistory(response.data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const convert = async () => {
    if (!value) return
    const val = parseFloat(value)
    let converted = val

    if (conversions[fromUnit]?.[toUnit]) {
      const factor = conversions[fromUnit][toUnit]
      converted = typeof factor === 'function' ? factor(val) : val * factor
    }

    setResult(converted.toFixed(4))

    try {
      await fetch('http://localhost:5000/api/history', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ from: value, fromUnit, to: converted.toFixed(4) }).then(res => res.json()), toUnit })
      fetchHistory()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="container">
      <h1 style={{ textAlign: 'center', margin: '20px 0' }}>🔄 Unit Converter</h1>

      <div className="card">
        <h2>Convert Units</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '15px', alignItems: 'end' }}>
          <div>
            <label>From</label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter value"
            />
            <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
              <optgroup label="Length">
                <option value="meters">Meters</option>
                <option value="feet">Feet</option>
              </optgroup>
              <optgroup label="Weight">
                <option value="kilograms">Kilograms</option>
                <option value="pounds">Pounds</option>
              </optgroup>
              <optgroup label="Temperature">
                <option value="celsius">Celsius</option>
                <option value="fahrenheit">Fahrenheit</option>
              </optgroup>
            </select>
          </div>

          <button onClick={convert} style={{ marginBottom: '10px' }}>→</button>

          <div>
            <label>To</label>
            <input
              type="text"
              value={result}
              readOnly
              placeholder="Result"
              style={{ background: '#f8f9fa' }}
            />
            <select value={toUnit} onChange={(e) => setToUnit(e.target.value)}>
              <optgroup label="Length">
                <option value="meters">Meters</option>
                <option value="feet">Feet</option>
              </optgroup>
              <optgroup label="Weight">
                <option value="kilograms">Kilograms</option>
                <option value="pounds">Pounds</option>
              </optgroup>
              <optgroup label="Temperature">
                <option value="celsius">Celsius</option>
                <option value="fahrenheit">Fahrenheit</option>
              </optgroup>
            </select>
          </div>
        </div>
      </div>

      {history.length > 0 && (
        <div className="card">
          <h3>Recent Conversions ({history.length})</h3>
          {history.slice(-10).reverse().map(h => (
            <div key={h.id} style={{ padding: '10px', background: '#f8f9fa', borderRadius: '4px', marginBottom: '10px' }}>
              {h.from} {h.fromUnit} = {h.to} {h.toUnit}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
