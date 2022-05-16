const returnResponseUrl = "/process3ds/";
const NodeSample = {
  operation: function () {
    return "CHECK_3DS_ENROLLMENT";
  },
  endpoint: function () {
    return "/check3dsEnrollment/";
  },
  params: function () {
    return encodeURI("?redirectUrl=" + window.location.protocol + "//" + window.location.host + "/" + returnResponseUrl);
  },
  secureIdResponseUrl: function () {
    return encodeURI(window.location.protocol + "//" + window.location.host + "/process3ds");
  }
};

let errors = [];
PaymentSession.configure({
  fields: {
    // ATTACH HOSTED FIELDS TO YOUR PAYMENT PAGE FOR A CREDIT CARD
    card: {
      number: "#card-number",
      securityCode: "#security-code",
      expiryMonth: "#expiry-month",
      expiryYear: "#expiry-year",
    },
  },
  //SPECIFY YOUR MITIGATION OPTION HERE
  frameEmbeddingMitigation: ["javascript"],
  callbacks: {
    initialized: function (response) {
      // HANDLE INITIALIZATION RESPONSE
      console.log(response);
      errors = [];
    },
    formSessionUpdate: function (response) {
      // HANDLE RESPONSE FOR UPDATE SESSION
      if (response.status) {
        if ("ok" == response.status) {
          //check if the security code was provided by the user
          if (response.sourceOfFunds.provided.card.securityCode) {
            console.log("Security code was provided.");
          }
          // Submit fields
          var data = {
            apiOperation: NodeSample.operation(),
            sessionId: response.session.id,
            transactionId: "trans-" + keyGen(10),
            orderId: "order-" + keyGen(10),
            orderAmount: document.getElementById("order-amount").value,
            orderCurrency: "EGP",
            orderDescription: "Course",
            secureIdResponseUrl: NodeSample.secureIdResponseUrl(),
          };
          var xhr = new XMLHttpRequest();
          xhr.open("POST", NodeSample.endpoint(), true);
          xhr.setRequestHeader("Content-Type", "application/json");
          xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
              document.documentElement.innerHTML = this.response;
            }
          };
          xhr.send(JSON.stringify(data));
          console.log("Data: " + JSON.stringify(data));
        } else if ("fields_in_error" == response.status) {
          console.log("Session update failed with field errors.");
          if (response.errors.cardNumber) {
            errors.push("Card number invalid or missing.");
            console.log("Card number invalid or missing.");
          }
          if (response.errors.expiryYear) {
            console.log("Expiry year invalid or missing.");
            errors.push("Expiry year invalid or missing.");
          }
          if (response.errors.expiryMonth) {
            console.log("Expiry month invalid or missing.");
            errors.push("Expiry month invalid or missing.");
          }
          if (response.errors.securityCode) {
            console.log("security code invalid.");
            errors.push("security code invalid.");
          }
        } else if ("request_timeout" == response.status) {
          console.log(
            "Session update failed with request timeout: " +
              response.errors.message
          );
          errors.push(
            "Session update failed with request timeout: " +
              response.errors.message
          );
        } else if ("system_error" == response.status) {
          console.log(
            "Session update failed with system error: " +
              response.errors.message
          );
          errors.push(
            "Session update failed with system error: " +
              response.errors.message
          );
        }
      } else {
        console.log("Session update failed: " + response);
        errors.push("Session update failed: " + response);
      }
    },
  },
});

async function onSubmit(e) {
  e.preventDefault();
  let errorsHtml = "";

  const invalidCheck = document.getElementById("invalidCheck").checked;
  const divCon = document.getElementById("error-container");
  const amount = document.getElementById("order-amount").value;
  if (!(amount > 0)) {
    errors.push("Order amount invalid or missing.");
  }
  if (invalidCheck) {
    PaymentSession.updateSessionFromForm("card");
  } else {
    errors.push("Plase confirm your information.");
  }
  errors.forEach((e) => {
    errorsHtml += `<p id="invalid-feedback">${e}</p>`;
  });
  divCon.innerHTML = errorsHtml;
  errors = [];
  errorsHtml = "";
}

function keyGen(keyLength) {
  var i,
    key = "",
    characters =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var charactersLength = characters.length;
  for (i = 0; i < keyLength; i++) {
    key += characters.substr(
      Math.floor(Math.random() * charactersLength + 1),
      1
    );
  }
  return key;
}
