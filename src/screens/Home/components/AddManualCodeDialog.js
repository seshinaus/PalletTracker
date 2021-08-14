import React, { useState, useContext} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Dialog from "react-native-dialog";
import { PalletContext } from '../../../context/PalletContext';
const AddManualCodeDialog = ({ showManual, setShowManual}) => {

  const [manualCode, setManualCode] = useState(null);
  const [manualCount, setManualCount] = useState(1);

  const {
    existPallet,
    setCurrentCode,
    setCount,
    setCountToAssign,
  } = useContext(PalletContext);

  const handleSubmit = () => {
    if (manualCode === "" || manualCode === null || Number(manualCount) == 0) {
      console.log(`ignore, ${manualCode}, ${manualCount}`);
      return;
    }
    if (existPallet(manualCode)) {
      Alert.alert("Already exists");
    }
    setShowManual(false);
    setCurrentCode(manualCode);
    setCountToAssign(manualCount);
    setCount(manualCount);
    setManualCode(null);
    setManualCount(1);
  };

   const onChangeCount = (count) => {
     setManualCount(Number(count));
   };
  
  const handleCancel = () => {
    setShowManual(false);
  };


  return (
    <Dialog.Container visible={showManual}>
        <Dialog.Title>Code</Dialog.Title>
        <Dialog.Description>
          Please input the code and count of pallet!
        </Dialog.Description>
        <Dialog.Input
          value={manualCode}
          placeholder="Code"
          onChangeText = {
            setManualCode
          }
        ></Dialog.Input>

        <Dialog.Input
          value={String(manualCount)}
          placeholder="Count"
          keyboardType="numeric"
          textContentType="oneTimeCode"
          onChangeText={onChangeCount}
        ></Dialog.Input>
        <Dialog.Button label="Cancel" onPress={handleCancel} />
        <Dialog.Button label="Submit" onPress={handleSubmit} />
      </Dialog.Container>
  )
}

export default AddManualCodeDialog

const styles = StyleSheet.create({})
