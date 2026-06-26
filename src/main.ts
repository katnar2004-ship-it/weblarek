import './scss/styles.scss';

import { Api } from './components/base/Api.js';
import { API_URL, CDN_URL } from './utils/constants.js';
import { AppApi } from './components/AppApi.js';
import { cloneTemplate } from './utils/utils';
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
import { IProduct } from './types/index.js'; 

const events = new EventEmitter();

const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);
const buyerModel = new BuyerModel(events);

const baseApi = new Api(API_URL);
const appApi = new AppApi(baseApi);

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

// статичные компоненты
const cardPreview = new CardPreview(cloneTemplate<HTMLElement>(cardPreviewTemplate), events);
const basket = new Basket(cloneTemplate<HTMLElement>(basketTemplate), events);
const orderForm = new FormOrder(cloneTemplate<HTMLElement>(orderTemplate), events);
const contactsForm = new FormContacts(cloneTemplate<HTMLElement>(contactsTemplate), events);
const success = new OrderSuccess(cloneTemplate<HTMLElement>(successTemplate), events);

// перерисовка корзины
const renderBasketItems = () => {
  const basketItems = basketModel.getItems();
    
  const cards = basketItems.map((item, index) => {
    const cardElement = cloneTemplate<HTMLElement>(cardBasketTemplate);
    const card = new CardBasket(cardElement, events, {
      onClick: () => events.emit('card:remove-from-basket', { id: item.id })
    });

    card.title = item.title;
    card.price = item.price;
    card.index = index + 1;
    return card.render();
  });

  basket.setItems(cards);
  basket.setPrice(basketModel.getTotalPrice());
  basket.setButtonState(basketModel.getItemCount() === 0);

  return basket.render();
};

// фильтрация ошибок
const filterErrors = (allErrors: Record<string, string>, fields: string[]) => {
  const errors: Record<string, string> = {};
  fields.forEach(field => {
    if (allErrors[field]) {
      errors[field] = allErrors[field];
    }
  });
  return errors;
};

// обновление каталога
events.on('catalog:changed', () => {
  const products = catalogModel.getProducts();
  const cards = products.map(product => {
    const cardElement = cloneTemplate<HTMLElement>(cardCatalogTemplate);
    const card = new CardCatalog(cardElement, events, {
      onClick: () => events.emit('card:select', product)
    });
    card.title = product.title;
    card.price = product.price;
    card.category = product.category;
    card.image = `${CDN_URL}${product.image}`;
    return card.render();
  });
  gallery.setCatalog(cards);
});

// открытие preview товара
events.on('catalog:preview-changed', () => {
  const product = catalogModel.getPreview();
  if (!product) return;
  cardPreview.title = product.title;
  cardPreview.price = product.price;
  cardPreview.category = product.category;
  cardPreview.image = `${CDN_URL}${product.image}`;
  cardPreview.description = product.description;
   
  const isInBasket = basketModel.hasItem(product.id);
    
  if (product.price === null) {
    cardPreview.disableButton(true);
    cardPreview.buttonText = "Недоступно";
  } else if (isInBasket) {
    cardPreview.buttonText = "Удалить из корзины";
    cardPreview.disableButton(false);
  } else {
    cardPreview.buttonText = "Купить";
    cardPreview.disableButton(false);
  }

  modal.setContent(cardPreview.render());
  modal.open();
});

// обновление корзины
events.on('basket:changed', () => {
  header.setCounter(basketModel.getItemCount());
  renderBasketItems();
});

// обновление покупателя
events.on('buyer:changed', () => {
  const buyerData = buyerModel.getBuyerData();

  orderForm.payment = buyerData.payment;
  orderForm.address = buyerData.address;
  contactsForm.email = buyerData.email;
  contactsForm.phone = buyerData.phone;

  const allErrors = buyerModel.validate();

  const orderErrors = filterErrors(allErrors, ['payment', 'address']);
  orderForm.setErrors(orderErrors);
  orderForm.disableSubmit(Object.keys(orderErrors).length > 0);

  const contactsErrors = filterErrors(allErrors, ['email', 'phone']);
  contactsForm.setErrors(contactsErrors);
  contactsForm.disableSubmit(Object.keys(contactsErrors).length > 0);
});

// выбор товара в каталоге
events.on('card:select', (product: IProduct) => {
  catalogModel.setPreview(product);
});

// добавление товара в корзину из preview
events.on('card:add-to-basket', () => {
  const product = catalogModel.getPreview();
  if (!product || product.price === null) return;

  if (basketModel.hasItem(product.id)) {
    basketModel.removeItem(product.id);
  } else {
    basketModel.addItem(product);
  }

  modal.close();
});

// удаление товара из корзины
events.on('card:remove-from-basket', (data: { id: string }) => {
  basketModel.removeItem(data.id);
});

// открытие корзины
events.on('header:basket-click', () => {
  modal.setContent(basket.render());
  modal.open();
});

// оформление заказа
events.on('basket:order', () => {
  modal.setContent(orderForm.render());
  modal.open();

  const allErrors = buyerModel.validate();
  const errors = filterErrors(allErrors, ['payment', 'address']);
  orderForm.setErrors(errors);
  orderForm.disableSubmit(Object.keys(errors).length > 0);
});

// форма заказа
events.on('order:submit', () => {
  modal.setContent(contactsForm.render());
  modal.open();

  const allErrors = buyerModel.validate();
  const errors = filterErrors(allErrors, ['email', 'phone']);
  contactsForm.setErrors(errors);
  contactsForm.disableSubmit(Object.keys(errors).length > 0);
});

// изменение способа оплаты
events.on('order:payment-change', (data: { payment: 'card' | 'cash' | null }) => {
  buyerModel.setBuyerField({ payment: data.payment });
});

// изменение адреса
events.on('order:address-change', (data: { address: string }) => {
  buyerModel.setBuyerField({ address: data.address });
});

// изменение email
events.on('contacts:email-change', (data: { email: string }) => {
  buyerModel.setBuyerField({ email: data.email });
});

// изменение телефона
events.on('contacts:phone-change', (data: { phone: string }) => {
  buyerModel.setBuyerField({ phone: data.phone });
});

// отправка заказа
events.on('contacts:submit', async () => {
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
        
    success.setTotal(response.total);
        
    modal.setContent(success.render());
    modal.open();
  } catch (error) {
    contactsForm.setErrors({ email: 'Ошибка при оформлении заказа' });
  }
});

// сообщение об успехе
events.on('success:close', () => {
  modal.close();
});

appApi.getProducts()
  .then((response) => {
    console.log("Всего товаров на сервере:", response.total);
    catalogModel.setProducts(response.items);
    renderBasketItems();
  })
  .catch((error) => {
    console.error("Ошибка при загрузке товаров:", error);
  });

