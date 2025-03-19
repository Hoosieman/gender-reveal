export default function ServerTimestamp() {
    const timestamp = new Date().toISOString()
  
    return <div className="text-xs text-gray-500 text-center mt-2">Server rendered at: {timestamp}</div>
  }
  
  