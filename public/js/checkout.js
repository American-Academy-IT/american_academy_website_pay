const checkoutForm = document.getElementById('checkout-form');
const inputFullName = document.getElementById('full-name');
const inputNationalId = document.getElementById('national-id');
const inputPhone = document.getElementById('phone');
const inputCourse = document.getElementById('select-course');
const inputAmount = document.getElementById('amount');
const inputCurrency = document.getElementById('select-currency');
const checkBox = document.getElementById('checkbox');
const inputInvalid = document.getElementById('invalid-input');
const termsCheckbox = document.getElementById('terms-checkbox');

checkoutForm.onsubmit = e => {
  e.preventDefault();

  if (
    inputNationalId.value.length != 14 ||
    inputPhone.value.length < 11 ||
    Number(inputAmount.value) < 100 ||
    !['EGP', 'USD'].includes(inputCurrency.value)
  ) {
    inputInvalid.style.display = 'block';
    return;
  }

  const orderData = {
    amount: inputAmount.value,
    currency: inputCurrency.value,
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
  termsCheckbox.checked = false;

  checkout(orderData);
};

async function checkout(orderData) {
  try {
    const res = await fetch('/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    const session = await res.json();

    Checkout.configure({
      session: {
        id: session.id,
      },
    });
    Checkout.showPaymentPage();
  } catch (err) {
    throw err;
  }
}

function errorCallback(error) {
  alert(JSON.stringify(error.message || error));
}

function completeCallback(result) {
  console.log(result);
  alert('Payment Done Successfully.');
}
