import { useState, useRef } from 'react'

function App() {
  const [status, setStatus] = useState("Awaiting Media...")
  const [isScanning, setIsScanning] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
      setStatus(`Ready to scan: ${e.target.files[0].name}`)
    }
  }

  const handleScan = async () => {
    if (!selectedFile) {
      setStatus("Error: Please select a file first.")
      return
    }

    setIsScanning(true)
    setStatus("Analyzing temporal and spectral artifacts...")

    try {
      // Package the file securely for transmission
      const formData = new FormData()
      formData.append("file", selectedFile)

      const response = await fetch('/api/scan', { 
        method: 'POST',
        body: formData // Send the file data!
      })
      
      const data = await response.json()
      setStatus(data.result)
    } catch (error) {
      setStatus("Error: Neural Engine offline.")
    } finally {
      setIsScanning(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-neutral-900 border border-neutral-800 rounded-xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-sky-400 mb-2">Satya-Shield 🛡️</h1>
        <p className="text-neutral-400 mb-8">Real-Time Deepfake & Voice Clone Detection</p>
        
        {/* Hidden File Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileSelect} 
          className="hidden" 
          accept="audio/*,video/*"
        />

        <div className="grid grid-cols-2 gap-4 mb-6">
          <button 
            onClick={() => fileInputRef.current.click()}
            className="w-full border border-neutral-700 hover:border-sky-500 text-neutral-300 font-semibold py-3 px-4 rounded-lg transition-colors cursor-pointer"
          >
            {selectedFile ? 'Change File' : 'Upload Audio/Video'}
          </button>

          <button 
            disabled={isScanning || !selectedFile}
            onClick={handleScan}
            className={`w-full font-bold py-3 px-4 rounded-lg transition-colors text-neutral-950 
              ${(isScanning || !selectedFile) ? 'bg-neutral-700 text-neutral-500 cursor-not-allowed' : 'bg-sky-500 hover:bg-sky-400 cursor-pointer'}`}
          >
            {isScanning ? 'Scanning...' : 'Initialize Scan'}
          </button>
        </div>

        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-6 text-center min-h-[8rem] flex flex-col justify-center">
          <p className="text-sm uppercase tracking-widest text-neutral-500 mb-2">System Output</p>
          <p className={`text-lg font-mono ${isScanning ? 'text-amber-400 animate-pulse' : (status.includes('⚠️') ? 'text-red-400' : 'text-emerald-400')}`}>
            {status}
          </p>
        </div>
      </div>
    </div>
  )
}

export default App