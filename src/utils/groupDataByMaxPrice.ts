const groupDataByMaxPrice = (data: MapPoint[]) => {
  if (!data || !Array.isArray(data)) {
    return {
      group_1: [],
      group_2: [],
      group_3: [],
      group_4: [],
      group_5: [],
    };
  }

  const getMaxPrice = (offers: Offers[]) => {
    return Math.max(...offers.map((offer) => offer.price));
  };

  const sortedData = [...data].sort((a, b) => {
    const maxPriceA = getMaxPrice(a.offers);
    const maxPriceB = getMaxPrice(b.offers);
    return maxPriceB - maxPriceA;
  });

  const top5Items = sortedData.slice(0, 5);

  const groupedData = {
    group_1: top5Items[0] ? [top5Items[0]] : [],
    group_2: top5Items[1] ? [top5Items[1]] : [],
    group_3: top5Items[2] ? [top5Items[2]] : [],
    group_4: top5Items[3] ? [top5Items[3]] : [],
    group_5: top5Items[4] ? [top5Items[4]] : [],
  };

  return groupedData;
};

export default groupDataByMaxPrice;
//=========================
// функция группировки только по цене(без учета приоритетности)
// const groupDataByMaxPrice = (data: any) => {
//   const getMaxPrice = (offers: any) => {
//     let maxPrice = -Infinity;

//     offers.forEach((offer: any) => {
//       if (offer.price > maxPrice) {
//         maxPrice = offer.price;
//       }
//     });

//     return maxPrice;
//   };

//   const getLastUpdateItem = (items: any) => {
//     const itemsWithMaxOffer = items.map((item: any) => {
//       const maxOffer = item.offers.reduce((acc: any, offer: any) => {
//         return offer.price > acc.price ? offer : acc;
//       }, item.offers[0]);

//       return {
//         ...item,
//         maxOffer,
//       };
//     });

//     return itemsWithMaxOffer.sort((a: any, b: any) => {
//       return (
//         new Date(b.maxOffer?.updated_at).getTime() -
//         new Date(a.maxOffer?.updated_at).getTime()
//       );
//     })[0];
//   };

//   const groupedData: any = {
//     group_1: [],
//     group_2: [],
//     group_3: [],
//     group_4: [],
//     group_5: [],
//   };

//   let copyData = data ? [...data] : [];

//   for (let groupIndex = 1; groupIndex <= 5; groupIndex++) {
//     if (copyData?.length === 0) break;

//     const maxPrice = copyData?.reduce((acc, item) => {
//       const itemMaxPrice = getMaxPrice(item.offers);
//       return itemMaxPrice > acc ? itemMaxPrice : acc;
//     }, -Infinity);

//     const maxPriceItems = copyData?.filter((item) => {
//       const itemMaxPrice = getMaxPrice(item.offers);
//       return itemMaxPrice === maxPrice;
//     });

//     groupedData[`group_${groupIndex}`] =
//       maxPriceItems.length > 1
//         ? [getLastUpdateItem(maxPriceItems)]
//         : maxPriceItems;

//     copyData = copyData?.filter((item) => {
//       const itemMaxPrice = getMaxPrice(item.offers);
//       return itemMaxPrice !== maxPrice;
//     });
//   }

//   return groupedData;
// };

// export default groupDataByMaxPrice;

//====================================
// const groupDataByPriorityAndPrice = (data: any) => {
//     if (!Array.isArray(data)) {
//       console.error("Data is not an array");
//       return {
//         group_1: [],
//         group_2: [],
//         group_3: [],
//         group_4: [],
//         group_5: [],
//       };
//     }

//     const getPriorityAndPrice = (offers: any) => {
//       let minPriority = Infinity;
//       let maxPrice = -Infinity;

//       offers.forEach((offer: any) => {
//         if (offer.priority < minPriority) {
//           minPriority = offer.priority;
//           maxPrice = offer.price;
//         } else if (offer.priority === minPriority && offer.price > maxPrice) {
//           maxPrice = offer.price;
//         }
//       });

//       return { minPriority, maxPrice };
//     };

//     const groupedData: any = {
//       group_1: [],
//       group_2: [],
//       group_3: [],
//       group_4: [],
//       group_5: [],
//     };

//     let copyData = [...data];

//     for (let groupIndex = 1; groupIndex <= 5; groupIndex++) {
//       if (copyData.length === 0) break;

//       const { minPriority, maxPrice } = copyData.reduce(
//         (acc, item) => {
//           const { minPriority: itemPriority, maxPrice: itemPrice } = getPriorityAndPrice(item.offers);
//           if (itemPriority < acc.minPriority) {
//             acc.minPriority = itemPriority;
//             acc.maxPrice = itemPrice;
//           } else if (itemPriority === acc.minPriority && itemPrice > acc.maxPrice) {
//             acc.maxPrice = itemPrice;
//           }
//           return acc;
//         },
//         { minPriority: Infinity, maxPrice: -Infinity }
//       );

//       const minPriorityMaxPriceItems = copyData.filter((item) => {
//         const { minPriority: itemPriority, maxPrice: itemPrice } = getPriorityAndPrice(item.offers);
//         return itemPriority === minPriority && itemPrice === maxPrice;
//       });

//       groupedData[`group_${groupIndex}`] = minPriorityMaxPriceItems;

//       copyData = copyData.filter((item) => {
//         const { minPriority: itemPriority, maxPrice: itemPrice } = getPriorityAndPrice(item.offers);
//         return !(itemPriority === minPriority && itemPrice === maxPrice);
//       });
//     }

//     return groupedData;
//   };

//   export default groupDataByPriorityAndPrice;
