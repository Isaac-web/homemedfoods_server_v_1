const { Order } = require("../models/Order");


module.exports = async () => {
    // const result = await Order.aggregate(
    //     [{
    //         $group: {
    //             _id: {
    //                 $dateToString: { format: "%Y-%m", date: "$createdAt" }
    //             },
    //             numberOfOrders: { $sum: 1 },
    //             total: { $sum: "$total" },
    //         },
    //     },
    //     {
    //         $sort: {
    //             _id: 1
    //         }
    //     }
    //     ]);


    // console.log(result);


    const result = [
        { _id: '2023-01', numberOfOrders: 119, total: 11105 },
        { _id: '2023-02', numberOfOrders: 77, total: 8290.5 },
        { _id: '2023-03', numberOfOrders: 66, total: 7847 },
        { _id: '2023-04', numberOfOrders: 36, total: 3114 },
        { _id: '2023-05', numberOfOrders: 46, total: 6261.5 },
        { _id: '2023-06', numberOfOrders: 18, total: 1905 }
    ]


    result.map((item) => {
        item.total = (item.total * 0.2).toFixed(2)
        return item
    })

    console.log(result)


}


