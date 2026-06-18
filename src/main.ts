import './scss/styles.scss';

import { Api } from './components/base/Api.js';
import { API_URL, CDN_URL } from './utils/constants.js';
import { AppApi } from './components/AppApi.js';
import { EventEmitter } from './components/base/Events';
import { CatalogModel } from './components/models/CatalogModel.js';
import { BasketModel } from './components/models/BasketModel.js';
import { BuyerModel } from './components/models/BuyerModel.js';
import { Modal } from './components/Modal';
import { Header } from './components/Header';
import { Gallery } from './components/Gallery';
import { CardCatalog } from './components/CardCatalog';
import { CardPreview } from './components/CardPreview';
import { CardBasket } from './components/CardBasket';
import { Basket } from './components/Basket';
import { FormOrder } from './components/FormOrder';
import { FormContacts } from './components/FormContacts';
import { OrderSuccess } from './components/OrderSuccess';
import { FormValidator } from './utils/validation';

const events = new EventEmitter();

const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);
const buyerModel = new BuyerModel(events);

const baseApi = new Api(API_URL);
const appApi = new AppApi(baseApi, CDN_URL);

// DOM-элементы для компонентов View
const modalElement = document.querySelector('.modal') as HTMLElement;
const headerElement = document.querySelector('.header') as HTMLElement;
const galleryElement = document.querySelector('.gallery') as HTMLElement;

// компоненты View
const modal = new Modal(modalElement, events);
const header = new Header(headerElement, events);
const gallery = new Gallery(galleryElement);

// шаблоны
const cardCatalogTemplate = document.getElementById('card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.getElementById('card-preview') as HTMLTemplateElement;
const cardBasketTemplate = document.getElementById('card-basket') as HTMLTemplateElement;
const basketTemplate = document.getElementById('basket') as HTMLTemplateElement;
const orderTemplate = document.getElementById('order') as HTMLTemplateElement;
const contactsTemplate = document.getElementById('contacts') as HTMLTemplateElement;
const successTemplate = document.getElementById('success') as HTMLTemplateElement;

// функция валидации
function validateAndUpdateUI(validationResult: any, formType: 'order' | 'contacts'): void {
  const { isValid, errors } = validationResult;
  const buttonSelector = formType === 'order' 
    ? '.order__button' 
    : '.contacts .button[type="submit"]';
    
  const button = document.querySelector(buttonSelector) as HTMLButtonElement;
  if (button) {
    button.disabled = !isValid;
  }

  const errorContainer = document.querySelector('.form__errors') as HTMLElement;
    
  if (errorContainer) {
    const errorMessages = Object.values(errors).filter(Boolean);
    errorContainer.textContent = errorMessages.join('; ') || '';
  }
}

// обновление каталога
events.on('catalog:changed', () => {
  const products = catalogModel.getProducts();
  const productsWithImages = products.map(product => ({
        ...product,
        image: `${CDN_URL}${product.image}`
    }));
  const cards = products.map(product => {
    const fragment = cardCatalogTemplate.content.cloneNode(true) as DocumentFragment;
    const cardElement = fragment.firstElementChild as HTMLElement;
    const card = new CardCatalog(cardElement, events);
    card.id = product.id;
    card.title = product.title;
    card.price = product.price;
    card.category = product.category;
    card.image = product.image;
    return card.render();
  });
  gallery.setCatalog(cards);
});

// открытие preview товара
events.on('catalog:preview-changed', () => {
  const product = catalogModel.getPreview();
  if (!product) return;
  const productWithImage = {
        ...product,
        image: `${CDN_URL}${product.image}`
    };
  const fragment = cardPreviewTemplate.content.cloneNode(true) as DocumentFragment;
  const cardElement = fragment.firstElementChild as HTMLElement;
  const card = new CardPreview(cardElement, events);
  card.id = product.id;
  card.title = product.title;
  card.price = product.price;
  card.category = product.category;
  card.image = product.image;
  card.description = product.description;
   
  const isInBasket = basketModel.hasItem(product.id);
    
  if (product.price === null) {
    card.disableButton(true);
    card.buttonText = "Недоступно";
  } else if (isInBasket) {
    card.buttonText = "Удалить из корзины";
    card.disableButton(false);
    const oldClick = (card as any)._onAddToBasket;
    const button = cardElement.querySelector('.card__button');
    if (button) {
      button.removeEventListener('click', oldClick);
      button.addEventListener('click', () => {
        basketModel.removeItem(product.id);
        modal.close();
        header.setCounter(basketModel.getItemCount());
      });
    }
  } else {
    card.buttonText = "Купить";
    card.disableButton(false);
  }
   
  modal.setContent(card.render());
  modal.open();
});

// обновление корзины
events.on('basket:changed', (data: { count: number }) => {
  header.setCounter(data.count);
});


// выбор товара в каталоге
events.on('card:select', (data: { id: string }) => {
  const product = catalogModel.getProductById(data.id);
  if (product) {
    catalogModel.setPreview(product);
  }
});

// добавление товара в корзину из preview
events.on('card:add-to-basket', (data: { id: string }) => {
  const product = catalogModel.getProductById(data.id);
  if (product && product.price !== null) {
    basketModel.addItem(product);
    modal.close();
  }
});

// удаление товара из корзины
events.on('card:remove-from-basket', (data: { id: string }) => {
  basketModel.removeItem(data.id);
  if (modal.isOpen()) {
    events.emit('header:basket-click');
  }
});

// открытие корзины
events.on('header:basket-click', () => {
  const basketItems = basketModel.getItems();
  // карточка товара в корзине
  const cards = basketItems.map((item, index) => {
  const fragment = cardBasketTemplate.content.cloneNode(true) as DocumentFragment;
  const cardElement = fragment.firstElementChild as HTMLElement;
  const card = new CardBasket(cardElement, events);
  card.id = item.id;
  card.title = item.title;
  card.price = item.price;
  card.index = index + 1;
       
  return card.render();
  });
   
  // элемнет корзины
  const basketElement = basketTemplate.content.cloneNode(true) as HTMLElement;
  const basket = new Basket(basketElement, events);
   
  basket.setItems(cards);
  basket.setPrice(basketModel.getTotalPrice());
  basket.setButtonState(basketModel.getItemCount() === 0);
   
  modal.setContent(basket.render());
  modal.open();
});

// оформлению заказа
events.on('basket:order', () => {
  if (basketModel.getItemCount() === 0) {
    return;
  }
  const fragment = orderTemplate.content.cloneNode(true) as DocumentFragment;
  const orderElement = fragment.firstElementChild as HTMLElement;
  const orderForm = new FormOrder(orderElement, events);
  const buyerData = buyerModel.getBuyerData();
  if (buyerData.address) {
    orderForm.address = buyerData.address;
  }
  if (buyerData.payment) {
    orderForm.payment = buyerData.payment;
  }
   
  modal.setContent(orderForm.render());
  modal.open();

  const initialValidation = FormValidator.validateOrder(
    buyerData.payment,
    buyerData.address
  );
  validateAndUpdateUI(initialValidation, 'order');
});

// форма заказа
events.on('order:submit', (data: { payment: string | null; address: string }) => {
  const validation = FormValidator.validateOrder(data.payment, data.address); 
  if (!validation.isValid) {
    validateAndUpdateUI(validation, 'order');
    return;
  }
  buyerModel.setBuyerField({
    payment: data.payment as 'card' | 'cash',
    address: data.address
  });
  const fragment = contactsTemplate.content.cloneNode(true) as DocumentFragment;
  const contactsElement = fragment.firstElementChild as HTMLElement;
  const contactsForm = new FormContacts(contactsElement, events);
   
  // Восстанавливаем сохранённые данные
  const buyerData = buyerModel.getBuyerData();
  if (buyerData.email) {
    contactsForm.email = buyerData.email;
  }
  if (buyerData.phone) {
    contactsForm.phone = buyerData.phone;
  }
   
  modal.setContent(contactsForm.render());
  modal.open();

  const initialValidationContacts = FormValidator.validateContacts(
    buyerData.email || '',
    buyerData.phone || ''
  );
  validateAndUpdateUI(initialValidationContacts, 'contacts');
});

// валидация формы заказа
events.on('order:validate', () => {
  const buyerData = buyerModel.getBuyerData();
  const validation = FormValidator.validateOrder(
    buyerData.payment,
    buyerData.address
  );
  validateAndUpdateUI(validation, 'order');
});

// изменение способа оплаты
events.on('order:payment-change', (data: { payment: 'card' | 'cash' | null }) => {
  buyerModel.setBuyerField({ payment: data.payment });
  events.emit('order:validate');
});

// изменение адреса
events.on('order:address-change', (data: { address: string }) => {
  buyerModel.setBuyerField({ address: data.address });
  events.emit('order:validate');
});

// изменение email
events.on('contacts:email-change', (data: { email: string }) => {
  buyerModel.setBuyerField({ email: data.email });
  events.emit('contacts:validate');
});

// изменение телефона
events.on('contacts:phone-change', (data: { phone: string }) => {
  buyerModel.setBuyerField({ phone: data.phone });
  events.emit('contacts:validate');
});

// валидация формы контактов
events.on('contacts:validate', () => {
  const buyerData = buyerModel.getBuyerData();
  const validation = FormValidator.validateContacts(
    buyerData.email,
    buyerData.phone
  );
  validateAndUpdateUI(validation, 'contacts');
});

// отправка заказа
events.on('contacts:submit', async (data: { email: string; phone: string }) => {
  const validation = FormValidator.validateContacts(data.email, data.phone);
  if (!validation.isValid) {
    validateAndUpdateUI(validation, 'contacts');
    return;
  }
    
  buyerModel.setBuyerField({
    email: data.email,
    phone: data.phone
  });
    
  const buyerData = buyerModel.getBuyerData();
  const order = {
    payment: buyerData.payment as 'card' | 'cash',
    email: buyerData.email,
    phone: buyerData.phone,
    address: buyerData.address,
    total: basketModel.getTotalPrice(),
    items: basketModel.getItems().map(item => item.id)
  };
    
  try {
    const response = await appApi.postOrder(order);
    basketModel.clear();
    buyerModel.clear();
        
    const fragment = successTemplate.content.cloneNode(true) as DocumentFragment;
    const successElement = fragment.firstElementChild as HTMLElement;
    const success = new OrderSuccess(successElement, events);
    success.setTotal(response.total);
        
    modal.setContent(success.render());
    modal.open();
  } catch (error) {
    const errorContainer = document.querySelector('.contacts .form__errors') as HTMLElement;
    if (errorContainer) {
      errorContainer.textContent = "Ошибка при оформлении заказа. Попробуйте позже.";
    }
  }
});

// сообщение об успехе
events.on('success:close', () => {
  modal.close();
});

// закрытие модального окна
events.on('modal:close', () => {
  modal.clearContent();
});

appApi.getProducts()
  .then((response) => {
    console.log("Всего товаров на сервере:", response.total);
    catalogModel.setProducts(response.items);
    catalogModel.getProducts();
   
  })
  .catch((error) => {
    console.error("Ошибка при загрузке товаров:", error);
  });

