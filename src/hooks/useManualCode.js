import React, {
  useState
} from 'react'

const useManualCode = () => {
  const [showManual, setShowManual] = useState(false);

  const [manualCode, setManualCode] = useState(null);
  const [manualCount, setManualCount] = useState(1);
  return [showManual, manualCode, manualCount]
}

export default useManualCode