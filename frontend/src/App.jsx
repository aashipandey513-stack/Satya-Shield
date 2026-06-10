import { useState, useRef } from 'react'

function App() {
  const [status, setStatus] = useState("Awaiting media upload...")
  const [isScanning, setIsScanning] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [verdict, setVerdict] = useState(null) // 'safe', 'threat', 'error', or null
  const fileInputRef = useRef(null)

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

      const response = await fetch('/api/scan', { 
        method: 'POST',
        body: formData 
      })
      
      const data = await response.json()
      setStatus(data.result)
      
      // Advanced verdict classification matching our robust backend chunks
      if (data.result.includes('ALERT')) {
        setVerdict('threat')
      } else if (data.result.includes('Warning') || data.result.includes('Error')) {
        setVerdict('error')
      } else {
        setVerdict('safe')
      }
    } catch (error) {
      setStatus("System Error: Analytics engine failed to respond.")
      setVerdict('error')
    } finally {
      setIsScanning(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans antialiased flex flex-col justify-between selection:bg-sky-500/30">
      
      {/* Top Professional Navigation Bar with Your Logo! */}
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
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12 grid md:grid-cols-5 gap-8 items-start">
        
        {/* Left Side: Control & Upload Panels (3 Columns) */}
        <div className="md:col-span-3 space-y-6">
          <div className="bg-zinc-900/30 border border-zinc-900 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-medium mb-1">Ingest Media</h2>
            <p className="text-xs text-zinc-400 mb-6">Upload audio (.mp3, .wav) or video (.mp4, .mov) vectors for spectral-temporal analysis.</p>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileSelect} 
              className="hidden" 
              accept="audio/*,video/*"
            />

            {/* Premium Drag/Drop Styled Box */}
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

            {/* Action Trigger Button */}
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
          </div>
        </div>

        {/* Right Side: Analytical Output Monitor (2 Columns) */}
        <div className="md:col-span-2 space-y-6">
          <div className={`border rounded-xl p-6 min-h-[310px] flex flex-col justify-between transition-all duration-300 shadow-xl
            ${verdict === 'safe' ? 'border-emerald-500/20 bg-emerald-500/[0.01] shadow-emerald-950/10' : 
              verdict === 'threat' ? 'border-red-500/20 bg-red-500/[0.01] shadow-red-950/10' : 
              verdict === 'error' ? 'border-amber-500/20 bg-amber-500/[0.01] shadow-amber-950/10' : 
              'border-zinc-900 bg-zinc-900/10'}`}
          >
            <div>
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
              
              {/* Output Content Wrapper */}
              <div className="space-y-4">
                <div className={`font-mono text-xs p-4 rounded-lg bg-zinc-950 border leading-relaxed h-36 overflow-y-auto relative overflow-hidden
                  ${verdict === 'safe' ? 'border-emerald-500/10 text-emerald-300' : 
                    verdict === 'threat' ? 'border-red-500/10 text-red-300' : 
                    verdict === 'error' ? 'border-amber-500/10 text-amber-300' : 
                    'border-zinc-900 text-zinc-400'}`}
                >
                  {/* Animated Scanning Line - Sweeps down and bounces back up smoothly */}
                  {isScanning && (
                    <div className="absolute left-0 w-full h-0.5 bg-sky-500 shadow-[0_0_10px_#0284c7] animate-[bounce_2s_infinite]"></div>
                  )}

                  <span className="text-zinc-600 block mb-1">$&gt; telemetry_log_initialized</span>
                  {status}
                </div>
              </div>
            </div>

            {/* Micro Metadata Indicator at the Bottom */}
            <div className="border-t border-zinc-900/60 pt-4 flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <span>SCANNER_V1.0</span>
              <span>MATH_METHOD: LAPLACIAN/MFCC</span>
            </div>
          </div>
        </div>

      </main>

      {/* Professional Footer */}
      <footer className="border-t border-zinc-900 px-8 py-4 text-center text-xs text-zinc-600 font-mono">
        SECURE PIPELINE // COUNTER-GENERATIVE AI TECHNOLOGY
      </footer>

    </div>
  )
}

export default App