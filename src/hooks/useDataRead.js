import React, { useEffect, useState } from "react";
import database from "@react-native-firebase/database";
const useDataRead = (path) => {
  const [data, setData] = useState({
    isLoading: true,
    data: null,
  });

  useEffect(() => {
    const ref = database().ref(path);
    return ref.once("value").then((snapshot) => {
      console.log("DB data: ", snapshot.val());
      setData(snapshot.val());
    });
  }, []);

  return data;
};

export default useDataRead;
