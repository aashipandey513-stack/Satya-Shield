import { useState, useRef } from 'react'

function App() {
  // Core Engine States
  const [status, setStatus] = useState("Awaiting media upload...")
  const [isScanning, setIsScanning] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [verdict, setVerdict] = useState(null) // 'safe', 'threat', 'error', or null
  const fileInputRef = useRef(null)

  // Firewall Config States (Phase 2)
  const [minCentroid, setMinCentroid] = useState(1600);
  const [minZcr, setMinZcr] = useState(0.085);
  const [maxMfccVar, setMaxMfccVar] = useState(15000);

  // Dynamic History Log State (Starts empty)
  const [scanHistory, setScanHistory] = useState([]);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setSelectedFile(file)
      setVerdict(null)
      setStatus(`File staged: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`)
    }
  }

  const handleScan = async () => {
    if (!selectedFile) return

    setIsScanning(true)
    setVerdict(null)
    setStatus("Deconstructing media layers & extracting tensors...")

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)
      
      // Pass the current slider thresholds to the backend (Optional for future backend updates)
      formData.append("minCentroid", minCentroid)
      formData.append("minZcr", minZcr)
      formData.append("maxMfccVar", maxMfccVar)

      const response = await fetch('/api/scan', { 
        method: 'POST',
        body: formData 
      })
      
      const data = await response.json()
      setStatus(data.result)
      
      // 1. Determine Verdict
      let currentVerdict = 'safe';
      if (data.result.includes('ALERT')) {
        currentVerdict = 'threat'
      } else if (data.result.includes('Warning') || data.result.includes('Error')) {
        currentVerdict = 'error'
      }
      setVerdict(currentVerdict)

      // 2. Dynamically Generate History Log Entry
      // We grab the exact time of the scan
      const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      const newLogEntry = {
        id: Date.now(), // Unique ID for React rendering
        filename: selectedFile.name,
        timestamp: currentTime,
        // If your backend doesn't send these metrics in the JSON yet, we display 'Extracted' or mock them.
        centroid: data.centroid ? data.centroid.toFixed(0) : "Extracted", 
        zcr: data.zcr ? data.zcr.toFixed(3) : "Extracted",
        variance: data.variance ? data.variance.toFixed(0) : "Extracted",
        status: currentVerdict.toUpperCase()
      };

      // 3. Prepend the new log to the top of the history array
      setScanHistory(prevHistory => [newLogEntry, ...prevHistory]);

    } catch (error) {
      setStatus("System Error: Analytics engine failed to respond.")
      setVerdict('error')
    } finally {
      setIsScanning(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans antialiased flex flex-col justify-between selection:bg-sky-500/30">
      
      {/* Top Professional Navigation Bar */}
      <header className="border-b border-zinc-900 bg-zinc-900/20 backdrop-blur-md px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Premium iOS-Style App Icon Container */}
          <div className="bg-white rounded-lg h-10 w-10 flex items-center justify-center p-1 shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-zinc-700">
            <img 
              src="/logo.png" 
              alt="SatyaShield Logo"
              className="h-full w-full object-contain" 
            />
          </div>
          <div>
            <span className="font-semibold tracking-tight text-sm block">SATYA-SHIELD</span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest block -mt-1">Deep Learning Media Authentication</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs text-zinc-400 font-mono">CORE_ENGINE: ACTIVE</span>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 grid md:grid-cols-2 gap-8 items-start">
        
        {/* LEFT COLUMN: Controls & Config */}
        <div className="space-y-6">
          
          {/* Media Ingestion Panel */}
          <section className="bg-zinc-900/30 border border-zinc-900 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-medium mb-1">Ingest Media</h2>
            <p className="text-xs text-zinc-400 mb-6">Upload audio (.mp3, .wav) or video (.mp4) for spectral analysis.</p>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileSelect} 
              className="hidden" 
              accept="audio/*,video/*"
            />

            <div 
              onClick={() => !isScanning && fileInputRef.current.click()}
              className={`border border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-3
                ${selectedFile 
                  ? 'border-sky-500/40 bg-sky-500/[0.02]' 
                  : 'border-zinc-800 bg-zinc-900/10 hover:border-zinc-700 hover:bg-zinc-900/20'}`}
            >
              <svg className={`w-8 h-8 ${selectedFile ? 'text-sky-400' : 'text-zinc-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <div>
                <p className="text-sm font-medium">{selectedFile ? selectedFile.name : "Select source file"}</p>
                <p className="text-xs text-zinc-500 mt-1">{selectedFile ? "Click to swap media payload" : "RAW containers up to 50MB"}</p>
              </div>
            </div>

            <button
              disabled={isScanning || !selectedFile}
              onClick={handleScan}
              className={`mt-6 w-full font-medium text-sm py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 border
                ${(isScanning || !selectedFile)
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-500 cursor-not-allowed'
                  : 'bg-zinc-50 border-zinc-50 text-zinc-950 hover:bg-zinc-200 cursor-pointer active:scale-[0.99]'}`}
            >
              {isScanning ? (
                <>
                  <div className="h-4 w-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin"></div>
                  Processing Neural Tensors...
                </>
              ) : (
                "Execute Verification Scan"
              )}
            </button>
          </section>

          {/* Heuristic Firewall Configuration Panel */}
          <section className="bg-zinc-900/30 border border-zinc-900 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-medium tracking-tight">Heuristic Firewall Profiles</h2>
                <p className="text-xs text-zinc-400">Scale mathematical boundaries for the validation tier.</p>
              </div>
              <span className="text-[10px] font-mono bg-zinc-800 text-zinc-300 px-2 py-1 rounded border border-zinc-700">
                MANUAL_OVERRIDE
              </span>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-zinc-400">Min Spectral Centroid (Frequency Clarity)</span>
                  <span className="font-mono text-emerald-400">{minCentroid} Hz</span>
                </div>
                <input 
                  type="range" min="1000" max="3000" step="50"
                  value={minCentroid} onChange={(e) => setMinCentroid(Number(e.target.value))}
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-zinc-400">Min Zero-Crossing Rate (Vocal Friction)</span>
                  <span className="font-mono text-emerald-400">{minZcr}</span>
                </div>
                <input 
                  type="range" min="0.010" max="0.200" step="0.005"
                  value={minZcr} onChange={(e) => setMinZcr(Number(e.target.value))}
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-zinc-400">Max MFCC Variance (Dynamic Range Limit)</span>
                  <span className="font-mono text-emerald-400">{maxMfccVar}</span>
                </div>
                <input 
                  type="range" min="5000" max="20000" step="250"
                  value={maxMfccVar} onChange={(e) => setMaxMfccVar(Number(e.target.value))}
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN: Monitors & Logs */}
        <div className="space-y-6">
          
          {/* Analysis Output Monitor */}
          <section className={`border rounded-xl p-6 transition-all duration-300 shadow-xl
            ${verdict === 'safe' ? 'border-emerald-500/20 bg-emerald-500/[0.01] shadow-emerald-950/10' : 
              verdict === 'threat' ? 'border-red-500/20 bg-red-500/[0.01] shadow-red-950/10' : 
              verdict === 'error' ? 'border-amber-500/20 bg-amber-500/[0.01] shadow-amber-950/10' : 
              'border-zinc-900 bg-zinc-900/10'}`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs uppercase font-mono tracking-wider text-zinc-500">Analysis Output Monitor</h3>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase
                ${verdict === 'safe' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 
                  verdict === 'threat' ? 'border-red-500/30 bg-red-500/10 text-red-400' : 
                  verdict === 'error' ? 'border-amber-500/30 bg-amber-500/10 text-amber-400' : 
                  'border-zinc-800 bg-zinc-900/50 text-zinc-400'}`}
              >
                {verdict ? verdict : "Idle"}
              </span>
            </div>
            
            <div className={`font-mono text-xs p-4 rounded-lg bg-zinc-950 border leading-relaxed h-32 overflow-y-auto relative overflow-hidden
              ${verdict === 'safe' ? 'border-emerald-500/10 text-emerald-300' : 
                verdict === 'threat' ? 'border-red-500/10 text-red-300' : 
                verdict === 'error' ? 'border-amber-500/10 text-amber-300' : 
                'border-zinc-900 text-zinc-400'}`}
            >
              {isScanning && (
                <div className="absolute left-0 w-full h-0.5 bg-sky-500 shadow-[0_0_10px_#0284c7] animate-[bounce_2s_infinite]"></div>
              )}
              <span className="text-zinc-600 block mb-1">$&gt; telemetry_log_initialized</span>
              {status}
            </div>
          </section>

          {/* Dynamic Scan History Log */}
          <section className="bg-zinc-900/30 border border-zinc-900 rounded-xl p-6 shadow-sm h-[325px] overflow-hidden flex flex-col">
            <h2 className="text-lg font-medium tracking-tight mb-4">Acoustic Fingerprint History</h2>
            
            {scanHistory.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center border border-dashed border-zinc-800 rounded-lg">
                <svg className="w-8 h-8 text-zinc-700 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-xs text-zinc-500 font-mono uppercase tracking-widest">No telemetry recorded</span>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto pr-2 -mr-2">
                <table className="w-full text-left text-xs text-zinc-400">
                  <thead className="bg-zinc-950/80 sticky top-0 text-zinc-300 uppercase font-mono tracking-wider border-b border-zinc-800 text-[10px] backdrop-blur-sm">
                    <tr>
                      <th className="p-2 pb-3">Time</th>
                      <th className="p-2 pb-3">Target</th>
                      <th className="p-2 pb-3">Metrics</th>
                      <th className="p-2 pb-3">Verdict</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900/50">
                    {scanHistory.map((log) => (
                      <tr key={log.id} className="hover:bg-zinc-900/40 transition-colors">
                        <td className="p-2 font-mono text-[10px] whitespace-nowrap">{log.timestamp}</td>
                        <td className="p-2 font-medium text-zinc-200 truncate max-w-[120px]" title={log.filename}>
                          {log.filename}
                        </td>
                        <td className="p-2 font-mono text-[10px] text-zinc-500">
                          {log.centroid === "Extracted" ? "Math Logged" : `C:${log.centroid}`}
                        </td>
                        <td className="p-2">
                          <span className={`px-2 py-0.5 rounded font-mono text-[9px] uppercase tracking-wider border ${
                            log.status === 'SAFE' 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                              : log.status === 'THREAT'
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

        </div>
      </main>

      <footer className="border-t border-zinc-900 px-8 py-4 text-center text-xs text-zinc-600 font-mono">
        SECURE PIPELINE // COUNTER-GENERATIVE AI TECHNOLOGY
      </footer>
    </div>
  )
}

export default App