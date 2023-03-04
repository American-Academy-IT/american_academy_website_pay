const query = require('../services/db-query');

async function addNewOrder(order) {
  console.log(order);
  return await query(
    `
    INSERT INTO orders 
     SET order_id=?, full_name=?, national_id=?, mobile=?, course_name=?, amount=?, currency=?
  `,
    [
      order.id,
      order.name,
      order.nationalId,
      order.phone,
      order.description,
      order.amount,
      order.currency,
    ]
  );
}

module.exports = {
  addNewOrder,
};
