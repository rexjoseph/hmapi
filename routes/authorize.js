const router = require('express').Router();
const ApiContracts = require("authorizenet").APIContracts;
const ApiControllers = require("authorizenet").APIControllers;
const SDKConstants = require("authorizenet").Constants;
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// PAYMENT ROUTE
router.post("/payment", async (req, res) => {
  const { cc, cvv, expiry } = req.body.data;

  const merchantAuthenticationType =
    new ApiContracts.MerchantAuthenticationType();
    merchantAuthenticationType.setName(process.env.AUTH_LOGIN_ID);
    merchantAuthenticationType.setTransactionKey(process.env.AUTH_TRANSACTION_KEY);

  const creditCard = new ApiContracts.CreditCardType();
  creditCard.setCardNumber(cc);
  creditCard.setExpirationDate(expiry);
  creditCard.setCardCode(cvv);

  const paymentType = new ApiContracts.PaymentType();
  paymentType.setCreditCard(creditCard);

  const orderDetails = new ApiContracts.OrderType();
	orderDetails.setInvoiceNumber('INVOICE');
	orderDetails.setDescription('Desc-');

  const billTo = new ApiContracts.CustomerAddressType();
	billTo.setFirstName(req.body.data.billFirstName);
	billTo.setLastName(req.body.data.billLastName);
	billTo.setAddress(req.body.data.billStreet + ' ' + req.body.data.billApartment);
	billTo.setCity(req.body.data.billCity);
	billTo.setState(req.body.data.billState);
	billTo.setZip(req.body.data.billZip);
	billTo.setCountry(req.body.data.billCountry);

  const shipTo = new ApiContracts.CustomerAddressType();
  shipTo.setFirstName(req.body.shipFirstName);
  shipTo.setLastName(req.body.shipLastName);
  shipTo.setAddress(req.body.shipAddress.street + ' ' + req.body.shipAddress.apartment);
  shipTo.setCity(req.body.shipAddress.city);
  shipTo.setState(req.body.shipAddress.state);
  shipTo.setZip(req.body.shipAddress.zip);
  shipTo.setCountry(req.body.shipAddress.country);

  const transactionSetting = new ApiContracts.SettingType();
  transactionSetting.setSettingName("recurringBilling");
  transactionSetting.setSettingValue("false");

  const transactionSettingList = [];
  transactionSettingList.push(transactionSetting);

  const transactionSettings = new ApiContracts.ArrayOfSetting();
  transactionSettings.setSetting(transactionSettingList);

  const transactionRequestType = new ApiContracts.TransactionRequestType();
  transactionRequestType.setTransactionType(
    ApiContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION
  );

  transactionRequestType.setPayment(paymentType);
	transactionRequestType.setOrder(orderDetails);
  transactionRequestType.setAmount(req.body.amount.toFixed(2));
  transactionRequestType.setBillTo(billTo);
	transactionRequestType.setShipTo(shipTo);
  transactionRequestType.setTransactionSettings(transactionSettings);

  const createRequest = new ApiContracts.CreateTransactionRequest();
  createRequest.setMerchantAuthentication(merchantAuthenticationType);
  createRequest.setTransactionRequest(transactionRequestType);

  const ctrl = new ApiControllers.CreateTransactionController(createRequest.getJSON());
  // Defaults to Sandbox => Sets to PRODUCTION
  // ctrl.setEnvironment(SDKConstants.endpoint.production);
  
  ctrl.execute(async () => {
    const apiResponse = ctrl.getResponse();
    const response = new ApiContracts.CreateTransactionResponse(apiResponse);

    if (response != null) {
      if (
        response.getMessages().getResultCode() ==
        ApiContracts.MessageTypeEnum.OK
      ) {
        if (response.getTransactionResponse().getMessages() != null) {
          // console.log(
          //   "Successfully created transaction with Transaction " +
          //     response.getTransactionResponse().getMessages()
          // );
          res.status(200).json({ transactionId: response.getTransactionResponse().getTransId(), paymentType: response.getTransactionResponse().accountType, accountNumber: response.getTransactionResponse().accountNumber });
        } else {
          console.log("Failed Transaction.");
          if (response.getTransactionResponse().getErrors() != null) {
            console.log(
              "Error Code: " +
                response
                  .getTransactionResponse()
                  .getErrors()
                  .getError()[0]
                  .getErrorCode()
            );
            console.log(
              "Error message: " +
                response
                  .getTransactionResponse()
                  .getErrors()
                  .getError()[0]
                  .getErrorText()
            );
            // req.flash('errors', 'Your transaction was declined.')
            res.status('500').json({message: 'Your transaction was declined'});
          }
        }
      } else {
        // console.log("Failed Transaction.");
        if (
          response.getTransactionResponse() != null &&
          response.getTransactionResponse().getErrors() != null
        ) {
          // req.flash('errors', 'The credit card has expired');
          res.status(500).json({message: 'The credit card has expired'});
        } else {
          console.log(
            "Error Code: " + response.getMessages().getMessage()[0].getCode()
          );
          console.log(
            "Error message: " + response.getMessages().getMessage()[0].getText()
          );
          // req.flash('errors', 'Sorry, we encountered an error')
          res.status(500).json({message: 'Sorry we encountered an error'});
        }
      }
    } else {
      console.log("Null Response.");
    }
  });
})

module.exports = router;