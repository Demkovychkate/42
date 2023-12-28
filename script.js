const leftBlock = document.querySelectorAll('.leftBlock li');
const middleBlock = document.querySelector('.middleBlock');
const bookslist = document.querySelector('.bookslist');
const rightBlock = document.querySelector('.rightBlock');
const sale = document.querySelector('.sale');
const btn = document.querySelector('.btn');
const customerForm = document.querySelector('.customerForm');
const btnPrimary = document.querySelector('.btn-primary');
const customerInfoForm = document.querySelector('.customerInfoForm');
const customerOrderWrapper = document.querySelector('.customerOrderWrapper');
const customerBtn = document.querySelector('.customerBtn');
const ORDER_STORAGE_KEY = 'customerOrders';


const booksCatalouge = {
  "Сучасна література": ["Прислуга", "Страшенно голосно і неймовірно близько", "Малавіта"],
  "Дитяча література": ["Друзяки динозаврики", "Історія про піратів", "Кнопик переможець"],
  "Методичні матеріали": ["Вчимося писати", "Вчимося читати", "Вчимося рахувати"],
};

const saleInformation = {
  "Сучасна література": "Ця книжка екранізована",
  "Дитяча література": "Бестселери в даній категорії",
  "Методичні матеріали": "Незамінна річ для вашої дитини",
};

const bookPrice = {
  "Сучасна література": 550,
  "Дитяча література": 450,
  "Методичні матеріали": 350,
};

function displayBooksInCategory(categoryName) {
  const BookProducts = booksCatalouge[categoryName];
  bookslist.innerHTML = "";

  BookProducts.forEach((book) => {
    const li = document.createElement("li");
    li.textContent = book;
    li.addEventListener("click", () => {
      selectedBook = book;
      sale.innerHTML = " ";
      const p = document.createElement("p");
      const orderPrice = document.createElement("p");
      orderPrice.className = 'orderPrice';
      p.textContent = saleInformation[categoryName];
      selectedBookPrice = bookPrice[categoryName]; 
      orderPrice.textContent = `${selectedBookPrice} грн`;     
      sale.appendChild(p);
      sale.appendChild(orderPrice);
      rightBlock.style.display = "block";
    });
    bookslist.appendChild(li);
  });

  middleBlock.style.display = "block";
  rightBlock.style.display = "none";
}

leftBlock.forEach((category) => {
  category.addEventListener("click", () => {
    const categoryName = category.textContent;
    displayBooksInCategory(categoryName);
  });
});


function getCustomerInfo() {
  const customerName = document.querySelector('#customerName').value;
  const customerCity = document.querySelector('#customerCity').value;
  const customerDelivery = document.querySelector('#customerDelivery').value;
  const customerPayMethod = document.querySelector('#customerPayMethod').value;
  const numberofOrder = document.querySelector('#numberofOrder').value;
  const customerComment = document.querySelector('#customerComment').value;  
  const customerBookPrice = selectedBookPrice;

  customerData = {
    name: customerName,
    city: customerCity,
    delivery: customerDelivery,
    payMethod: customerPayMethod,
    numberOrder: numberofOrder,
    comment: customerComment,
    book: selectedBook,   
    price: customerBookPrice,
  };

  return customerData;
}

btn.addEventListener('click', async () => {
  customerForm.style.display = "block";
  getCustomerInfo();
});


function renderCustomerForm(customerData) {
  const infoForm = document.createElement('div');
  infoForm.classList = "infoForm";
  customerInfoForm.appendChild(infoForm);

  const commentContent = customerData.comment?.trim() || "";
  const commentMessage = commentContent !== ""
    ? `<p>Коментар: ${commentContent}</p>`
    : "<p>Немає коментарів до замовлення</p>";
 
  const totalOrderPrice = customerData.numberOrder * customerData.price;

  customerInfoForm.innerHTML = `
    <p>Дані Вашого замовлення</p>
    <p> Ви замовили книжку : ${customerData.book}</p>
    <p> Замовник: ${customerData.name}</p>
    <p>Місто для відправки: ${customerData.city}</p>
    <p> Склад НП: ${customerData.delivery}</p>
    <p> Ваш метод оплати: ${customerData.payMethod}</p>
    <p> Кількіть товару в замовленні: ${customerData.numberOrder}</p>
    <p> Вартість вашого замовлення : ${totalOrderPrice} грн</p>
    ${commentMessage}`;
}

function validation(form) {
  const formElements = form.querySelectorAll('input, select');
  let isValid = true;

  formElements.forEach((element) => {
    if (!element.value.trim()) {
      alert('Заповніть всі дані');
      isValid = false;
    }
  });

  return isValid;
}

function getOrderFromLocalStorage() {
  const order = localStorage.getItem(ORDER_STORAGE_KEY);
  return order ? JSON.parse(order) : [];
}

function displayCustomerOrders() {
  const totalOrderPrice = customerData.numberOrder * customerData.price;
  const orderList = document.querySelector('.orderList');
  orderList.innerHTML = '';

  const orders = getOrderFromLocalStorage();

  orders.forEach((order, index) => { 
   
    const li = document.createElement('li');
    li.innerHTML = `Замовлення ${index + 1} - ${order.date}, Ціна: ${totalOrderPrice}  грн,<button class="deleteOrderBtn" data-index="${index}">Видалити замовлення</button>`;
    orderList.appendChild(li);
  });

  customerOrderWrapper.style.display = 'block';

  const deleteOrderBtn = document.querySelectorAll('.deleteOrderBtn');
  deleteOrderBtn.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      deleteOrder(index);
    });
  });
}

function deleteOrder(index) {
  const orders = getOrderFromLocalStorage();
  orders.splice(index, 1);
  localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
  displayCustomerOrders();
}

function saveOrderToLocalStorage(order, selectedBook) {
  const orders = getOrderFromLocalStorage();
  order.price = bookPrice[selectedBook];
  orders.push(order);
  localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
}

btnPrimary.addEventListener('click', () => {
  const isValid = validation(customerForm);
   
  if (isValid) {
    customerData = getCustomerInfo();
    customerInfoForm.style.display = 'block';
    renderCustomerForm(customerData);
  }
});

customerBtn.addEventListener('click', () => {
  saveOrderToLocalStorage({
    date: new Date().toLocaleString(),
    ...customerData,
  }, selectedBook);
  displayCustomerOrders();
});