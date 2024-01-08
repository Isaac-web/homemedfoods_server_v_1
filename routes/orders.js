const express = require('express');
const controller = require('../controllers/orders');
const customerAuth = require('../middleware/customerAuth');
const validateId = require('../middleware/validateId');
const errorHandler = require('../middleware/routeErrorHandler');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', [customerAuth], errorHandler(controller.createOrder));
router.post(
  '/precheckout_summery',
  [customerAuth],
  errorHandler(controller.getPreCheckOutSummery)
);
router.get('/', auth('admin'), errorHandler(controller.getOrders));
router.get(
  '/customer',
  [customerAuth],
  errorHandler(controller.getCustomerOrders)
);

router.get(
  '/branch',
  auth('mananger'),
  errorHandler(controller.getBranchOrders)
);

router.get(
  '/branch/pending',
  auth('mananger'),
  errorHandler(controller.getBranchPendingOrders)
);

router.get('/shopper', [auth('shopper')], controller.getShopperOrders);
router.get('/rider', [auth('rider')], controller.getRiderOrders);

router.get('/:id', [validateId], errorHandler(controller.getOrder));

router.patch(
  '/:id/shopper',
  [validateId, auth('mananger')],
  errorHandler(controller.updateOrderProcess)
);

router.patch(
  '/:id/dispatch',
  [validateId, auth('shopper')],
  errorHandler(controller.dispatchOrder)
);
router.patch(
  '/:id/opened',
  [validateId, auth('mananger')],
  errorHandler(controller.updateOnOpen)
);
router.patch(
  '/:id/mark_as_delivered',
  [validateId, auth('mananger')],
  errorHandler(controller.markAsDelivered)
);

router.patch(
  '/:id/mark_as_delivered/customer',
  [validateId, customerAuth],
  errorHandler(controller.markAsDelivered)
);

router.patch(
  '/:id',
  [validateId, auth('mananger')],
  errorHandler(controller.updateOrder)
);
router.delete('/:id', auth('mananger'), errorHandler(controller.deleteOrder));

module.exports = router;
