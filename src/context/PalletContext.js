import React, { createContext, useState, useEffect } from "react";
import useDataRead from "../hooks/useDataRead";
import database from "@react-native-firebase/database";
export const PalletContext = createContext();

const PalletContextProvider = (props) => {
  const [pallets, setPallets] = useState([]);
  const [count, setCount] = useState(0);
  const [countToAssign, setCountToAssign] = useState(0);
  const [currentCode, setCurrentCode] = useState(null);

  const addPallet = async (slot, countToAdd) => {
    try {
      await database()
        .ref("pallets")
        .push({ code: currentCode, slot: slot, count: countToAdd });
      setCountToAssign(countToAssign - countToAdd);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const ref = database().ref("pallets");
    return ref.on("value", (snapshot) => {
      console.log("pallets: ", snapshot?.val());
      const data = snapshot?.val() ?? {};
      const arr = Object.keys(data).map((key) => {
        let item = data[key];
        item = { ...item, id: key };
        return item;
      });
      setPallets(arr);
    });
  }, []);

  const existPallet = (id) => {
    return pallets.some((item) => {
      return item.id === id;
    });
  };

  const deletePallet = async (id) => {
    await database().ref("pallets").child(id).remove();
  };

  return (
    <PalletContext.Provider
      value={{
        pallets,
        addPallet,
        existPallet,
        currentCode,
        setCurrentCode,
        count,
        setCount,
        countToAssign,
        setCountToAssign,
        deletePallet,
      }}
    >
      {props.children}
    </PalletContext.Provider>
  );
};

export default PalletContextProvider;
