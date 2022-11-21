var fullNameInput = document.getElementById("full-name");
var nationalIDInput = document.getElementById("national-id");
var phoneNumberInput = document.getElementById("phone-number");
var selectCourseInput = document.getElementById("select-course");
var validParag = document.getElementById("valid-parag");
var captchaValue = document.getElementById("captcha-value");
var inputCaptcha = document.getElementById("input-captcha");
var allValueCaptcha = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

var CVal1 = allValueCaptcha[Math.floor(Math.random() * allValueCaptcha.length)];
var CVal2 = allValueCaptcha[Math.floor(Math.random() * allValueCaptcha.length)];
var CVal3 = allValueCaptcha[Math.floor(Math.random() * allValueCaptcha.length)];
var CVal4 = allValueCaptcha[Math.floor(Math.random() * allValueCaptcha.length)];
var CVal5 = allValueCaptcha[Math.floor(Math.random() * allValueCaptcha.length)];
var CVal6 = allValueCaptcha[Math.floor(Math.random() * allValueCaptcha.length)];
var CValue = CVal1 + CVal2 + CVal3 + CVal4 + CVal5 + CVal6;
captchaValue.innerHTML = CValue;
var inputCaptchaValue = "";
inputCaptcha.addEventListener("change", function () {
  inputCaptchaValue = inputCaptcha.value;
});


// var API_URL = "https://americanacademyeg.com/api/pay/user";
// var API_URL = "http://localhost:5000/api/pay/user";

if (self === top) {
  var antiClickjack = document.getElementById("antiClickjack");
  if (antiClickjack) antiClickjack.parentNode.removeChild(antiClickjack);
} else {
  top.location = self.location;
}
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
            transactionId: $("#transaction-id").val(),
            orderId: $("#order-id").val(),
            orderAmount: $("#order-amount").val(),
            orderCurrency: $("#order-currency").val(),
            orderDescription: $("#order-description").val(),
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
          xhr.send(data);
          console.log("Data: " + JSON.stringify(data));
        } else if ("fields_in_error" == response.status) {
          console.log("Session update failed with field errors.");
          if (
            validParag.innerText !== "All inputs is required" ||
            validParag.innerText !== "Invalid Captcha"
          ) {
            if (response.errors.cardNumber) {
              validParag.innerHTML = "Card number invalid or missing";
              console.log("Card number invalid or missing");
            } else if (response.errors.expiryYear) {
              validParag.innerHTML = "Expiry year invalid or missing";
              console.log("Expiry year invalid or missing");
            } else if (response.errors.expiryMonth) {
              validParag.innerHTML = "Expiry month invalid or missing";
              console.log("Expiry month invalid or missing");
            } else if (response.errors.securityCode) {
              validParag.innerHTML = "Security code invalid";
              console.log("Security code invalid");
            }
          }
        } else if ("request_timeout" == response.status) {
          console.log(
            "Session update failed with request timeout: " +
              response.errors.message,
          );
        } else if ("system_error" == response.status) {
          console.log(
            "Session update failed with system error: " +
              response.errors.message,
          );
        }
      } else {
        console.log("Session update failed: " + response);
      }
    },
  },
});

function pay(e) {
  e.preventDefault();
  var inputValue = {
    fullName: fullNameInput.value,
    nationalID: nationalIDInput.value,
    phoneNumber: phoneNumberInput.value,
    selectCourse: selectCourseInput.value,
  };
  //TODO send Data to Database Server
  // function createUser() {
  //   try {
  //     fetch(API_URL, {
  //       method: "POST",
  //       body: JSON.stringify(inputValue)
  //     })
  //       .then((response) => response.json())
  //       .then((data) => {
  //         console.log("Success:", data);
  //       })
  //       .catch((error) => {
  //         console.error("Error:", error);
  //       });
  //   } catch (error) {
  //     return error;
  //   }
  // }

  function sendEmail() {
    fetch("https://formsubmit.co/ajax/8a071e139bd3a67ce1c02a682b4bd934", {
    method: "POST",
    headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    body: JSON.stringify({
        FullName: `${inputValue.fullName}`,
        NationalID: `${inputValue.nationalID}`,
        PhoneNumber: `${inputValue.phoneNumber}`,
        SelectCourse: `${inputValue.selectCourse}`,
    })
})
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.log(error));
  }
  if (
    inputValue.fullName == "" ||
    inputValue.nationalID == "" ||
    inputValue.phoneNumber == "" ||
    inputValue.selectCourse== ""
  ) {
    validParag.innerHTML = "All inputs is required";
  } else if (CValue !== inputCaptchaValue) {
    validParag.innerHTML = "Invalid Captcha";
  } else {
    validParag.innerHTML = "";
    // UPDATE THE SESSION WITH THE INPUT FROM HOSTED FIELDS
    PaymentSession.updateSessionFromForm("card");
    sendEmail();
  }
}

