const express = require("express");
const session = require("express-session");
const dotenv = require("dotenv");
const request = require("request");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require("fs");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
app.use((req, _res, next) => {
  req.session.cookie = {};
  next();
});

const baseUrl = process.env.BASE_URL;
const apiVersion = process.env.API_VERSION;
const merchant = process.env.MERCHANT;
const ssl = fs.readFileSync(process.env.CRT);
const key = fs.readFileSync(process.env.KEY);

const auth = {
  user: "merchant." + merchant,
  pass: process.env.PASSWORD,
  sendImmediately: false,
};

const agentOptions = {
  cert: ssl,
  key: key,
  passphrase: merchant,
};

app.use(express.static(__dirname + "/public"));
app.set("views", __dirname + "/public");
app.engine("ejs", require("ejs").renderFile);
app.set("view engine", "ejs");

app.get("/api", (req, res) => {
 // fs.writeFileSync("ssl.txt", ssl);
 // fs.writeFileSync("key.txt", key);
	    res.status(200).json({ dir: __dirname });
});

app.post("/check3dsEnrollment", function (request, response, next) {
  const apiOperation = request.body.apiOperation;
  const sessionId = request.body.sessionId;
  const redirectUrl = request.body.secureIdResponseUrl;
  const orderId = request.body.orderId;
  const transactionId = request.body.transactionId;
  const orderAmount = request.body.orderAmount;
  const orderDescription = request.body.orderDescription;
  const orderCurrency = request.body.orderCurrency;
  const secureId = getSecureId();
  request.session.sessionidVariable = sessionId;
  request.session.securityVariable = getSecureId();
  get3DSData(orderAmount, orderCurrency);
  setSessionVariables(sessionId, secureId);

  check3dsEnrollment(apiOperation, sessionId, function (error, result) {
    if (!error) {
      var requestData = {
        apiOperation: apiOperation,
        order: {
          amount: orderAmount,
          currency: orderCurrency,
        },
        session: {
          id: sessionId,
        },
        "3DSecure": {
          authenticationRedirect: {
            responseUrl: redirectUrl,
            pageGenerationMode: "SIMPLE",
          },
        },
      };
      check3dsEnrollmentAccess(secureId, requestData, function (err, body) {
        if (err) {
          // const result = err;
          // response.render("apiResponse", result);
          next();
        }
        if (body.error) {
          const result = body.error.cause;
          // response.render("apiResponse", result);
          next();
        } else {
          var secure = body["3DSecure"];
          var htmlcontent =
            secure.authenticationRedirect.simple.htmlBodyContent;
          const dom = new JSDOM(htmlcontent);
          var resdata = {
            title: "browserPaymentReceipt",
            resbody: htmlcontent,
            pareq: dom.window.document.getElementsByName("PaReq")[0].value,
            echoForm:
              dom.window.document.getElementsByName("echoForm")[0].action,
            termUrl: dom.window.document.getElementsByName("TermUrl")[0].value,
            md: dom.window.document.getElementsByName("MD")[0].value,
          };
          response.render("secureIdPayerAuthenticationForm", resdata);
          next();
        }
      });
      request.session.save();
    } else {
      response.render("apiResponse", result);
    }
  });
});

app.post("/process3ds", function (request, response, next) {
  var DDDsData = get3DSData();
  var orderAmount = DDDsData[0];
  var orderCurrency = DDDsData[1];
  var ssid = request.session.sessionidVariable;
  var scid = getSecureId();
  if (!ssid) {
    ssid = tempVariables.sessionidVariable;
  }
  if (!scid) {
    scid = getSecureId();
  }
  var apiOperation = "PROCESS_ACS_RESULT";
  var pares = request.body.PaRes;
  var requestData = {
    apiOperation: "PROCESS_ACS_RESULT",
    "3DSecure": {
      paRes: pares,
    },
  };
  process3ds(requestData, scid, function (result) {
    if (!result.error) {
      var payload = {
        apiOperation: "PAY",
        "3DSecureId": getSecureId(),
        order: {
          amount: orderAmount,
          currency: orderCurrency,
        },
        session: {
          id: ssid,
        },
      };
      var transactionId = keyGen(10);
      var orderId = keyGen(10);
      process3dsResult(payload, orderId, transactionId, function (finalresult) {
        var data = JSON.stringify(finalresult.message);
        if (data.error) {
          // const result = data.error;
          // response.render("apiResponse", result);
        } else {
          var url = finalresult.url;
          var reqPayload = JSON.stringify(payload);
          var responseData = {
            title: "browserPaymentReceipt",
            apiOperation: "PAY",
            method: "PUT",
            url: url,
            payload: reqPayload,
            resbody: data,
          };
          response.render("apiResponse", JSON.parse(responseData.resbody));
          // response.send(JSON.parse(responseData.resbody))
        }
        next();
      });
    } else {
      // errorService.showErrorPage(result, response, null, null, null);
      response.render("apiResponse", result);
    }
  });
});

app.get("/", (req, res) => {
  res.send(
    `<h1>hi from server <script src='${baseUrl}/form/version/${apiVersion}/merchant/${merchant}/session.js'></script></h1>`
  );
});

function getSecureId() {
  if (typeof session.secureId == "undefined") {
    session.secureId = keyGen(10);
  }
  return session.secureId;
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

function get3DSData(amount, currency) {
  if (
    typeof amount != undefined &&
    typeof currency != "undefined" &&
    amount &&
    currency
  ) {
    session["3dsAmount"] = amount;
    session["3dsCurrency"] = currency;
  }

  return [session["3dsAmount"], session["3dsCurrency"]];
}

function setSessionVariables(sessionid, secureid) {
  tempVariables = {
    sessionidVariable: sessionid,
    securityVariable: getSecureId(),
  };
}

function check3dsEnrollment(operation, sessionId, callback) {
  var url =
    baseUrl + "/api/rest/version/" + apiVersion + "/session/" + sessionId;
  var options = {
    url: url,
    user: "merchant." + merchant,
    pass: "9c6a123857f1ea50830fa023ad8c8d1b",
    sendImmediately: false,
  };
  request.get(options, function (error, response, body) {
    return callback(error, body);
  });
}

function check3dsEnrollmentAccess(secureId, requestData, callback) {
  var url =
    baseUrl +
    "/api/rest/version/" +
    apiVersion +
    "/merchant/" +
    merchant +
    "/3DSecureId/" +
    secureId;
  var options = {
    url: url,
    json: requestData,
    // auth,
    agentOptions,
  };
  request.put(options, function (error, response, body) {
    return callback(error, body);
  });
}

function process3ds(requestData, secureId, callback) {
  var requestUrl =
    baseUrl +
    "/api/rest/version/" +
    apiVersion +
    "/merchant/" +
    merchant +
    "/3DSecureId/" +
    secureId;
  var options = {
    url: requestUrl,
    method: "POST",
    json: requestData,
    // auth,
    agentOptions,
  };
  return request(options, function (error, response, body) {
    return callback(body);
  });
}

function process3dsResult(requestData, orderId, transactionId, callback) {
  var requestUrl =
    baseUrl +
    "/api/rest/version/" +
    apiVersion +
    "/merchant/" +
    merchant +
    "/order/" +
    orderId +
    "/transaction/" +
    transactionId;
  var options = {
    url: requestUrl,
    method: "PUT",
    json: requestData,
    // auth,
    agentOptions,
  };
  return request(options, function (error, response, body) {
    if (error) {
      return callback({
        error: true,
        message: error,
        url: requestUrl,
      });
    } else {
      return callback({
        error: false,
        message: body,
        url: requestUrl,
      });
    }
  });
}

app.listen(PORT, () => {
  console.log("app run on port:" + PORT);
});
