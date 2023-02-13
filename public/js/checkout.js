const inputFullName = document.getElementById('full-name');
const inputNationalId = document.getElementById('national-id');
const inputPhone = document.getElementById('phone');
const inputCourse = document.getElementById('select-course');
const inputAmount = document.getElementById('amount');
const checkBox = document.getElementById('checkbox');
const inputInvalid = document.getElementById('invalid-input');

document.forms[0].onsubmit = e => {
  e.preventDefault();

  if (
    inputNationalId.value.length != 14 ||
    inputPhone.value.length < 11 ||
    Number(inputAmount.value) < 100
  ) {
    inputInvalid.style.display = 'block';
    return;
  }

  const orderData = {
    amount: inputAmount.value,
    phone: inputPhone.value,
    name: inputFullName.value,
    description: inputCourse.value,
    nationalId: inputNationalId.value,
  };

  inputFullName.value = '';
  inputNationalId.value = '';
  inputPhone.value = '';
  inputCourse.value = '';
  inputAmount.value = '';
  checkBox.checked = false;

  checkout(orderData);
};

async function checkout(orderData) {
  try {
    const res = await fetch('/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    const { sessionId } = await res.json();

    Checkout.configure({
      session: {
        id: sessionId,
      },
    });
    Checkout.showPaymentPage();
  } catch (err) {
    throw err;
  }
}

function errorCallback(error) {
  alert(JSON.stringify(error));
}

function completeCallback(result) {
  console.log(result);
  alert('Payment Done Successfully.');
}
