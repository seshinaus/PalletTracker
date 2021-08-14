export const getDataSource = (areaList, pallets, keyword) => {
  if (keyword) {
    return filterArea(areaList, pallets, keyword)
  } else {
    return getEntireList(areaList, pallets, keyword)
  }
}

const reducer = (accumulator, currentValue) =>
  accumulator + currentValue.count;

const getEntireList = (areaList, pallets, keyword) => {
  const source = [];
  areaList.forEach((tile) => {
    let count = 0;
    const info = tile.slots.map((slotIndex) => {

      const palletsCount = pallets
        .filter((pallet) => {
          return pallet.slot === slotIndex;
        })
        .reduce(reducer, 0);
      count += palletsCount;
      return {
        id: slotIndex,
        count: palletsCount,
      };
    });
    source.push({
      title: tile.title,
      count: count,
      data: info
    });
  });
  return source;
}

const filterArea = (areaList, pallets, keyword) => {
  const source = [];

  areaList.forEach((tile) => {
    const data = pallets.filter((item) => {
      return (
        tile.slots.includes(item.slot) &&
        item.code.includes(keyword) === true
      );
    })
    const count = data.reduce(reducer, 0)
    if (count > 0) {
      source.push({
        title: tile.title,
        count: count,
        data: data,
      });
    }

  });
  return source;
}