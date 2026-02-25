import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller";
import { authorizedMiddleware } from "../middlewares/authorized.middleware";

const router = Router();
const paymentController = new PaymentController();

router.post(
  "/khalti/initiate",
  authorizedMiddleware,
  paymentController.initiateKhaltiEpayment.bind(paymentController)
);

router.post(
  "/khalti/lookup",
  authorizedMiddleware,
  paymentController.lookupKhaltiPayment.bind(paymentController)
);

router.post(
  "/confirm",
  authorizedMiddleware,
  paymentController.confirmPayment.bind(paymentController)
);

router.get(
  "/khalti/mobile-return",
  paymentController.mobileReturnKhaltiPayment.bind(paymentController)
);

export default router;

