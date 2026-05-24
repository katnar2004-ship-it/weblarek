import './scss/styles.scss';

import { CatalogModel } from './components/base/models/CatalogModel.js';
import { BasketModel } from './components/base/models/BuyerModel.js';
import { BuyerModel } from './components/base/models/BasketModel.js';
import { apiProducts } from './utils/data.js';
import { Api } from './components/base/Api.js';
import { API_URL } from './utils/constants.js';
import { AppApi } from './components/base/AppApi.js';

const catalogModel = new CatalogModel();
const basketModel = new BasketModel();
const buyerModel = new BuyerModel();

console.log("---Тестирование CatalogModel---");

// Сохранение массива товаров
catalogModel.setProducts(apiProducts.items);
console.log("Товары сохранены");

// Получение массива товаров
const allProducts = catalogModel.getProducts();
console.log("Массив товаров из каталога: ", allProducts);
console.log("Количество товаров:", allProducts.length);

// Получение товара по id
const testProductId = allProducts[0]?.id;
if (testProductId) {
    const productById = catalogModel.getProductById(testProductId);
    console.log(`Товар с id "${testProductId}":`, productById);
}

// Сохранение и получение товара для подробного отображения
const previewProduct = allProducts[1];
if (previewProduct) {
    catalogModel.setPreview(previewProduct);
    console.log(`Preview установлен: ${previewProduct.title}`);
    const savedPreview = catalogModel.getPreview();
    console.log(`Preview получен:`, savedPreview?.title);
}

console.log("---Тестирование BasketModel---");

// Добавление товаров
const product1 = allProducts[0];
const product2 = allProducts[1];
const product3 = allProducts[2];

basketModel.addItem(product1);
console.log(`Добавлен: ${product1.title}`);

basketModel.addItem(product2);
console.log(`Добавлен: ${product2.title}`);

basketModel.addItem(product3);
console.log(`Добавлен: ${product3.title}`);

// Получение стоимости всех товаров в корзине.
console.log('Общая стоимость:', basketModel.getTotalPrice());

// Получение количества товаров в корзине.
console.log('Товаров в корзине:', basketModel.getItemCount());

// Проверка наличия товара в корзине по его id
console.log(`Товар "${product1.title}" в корзине?`, basketModel.hasItem(product1.id));

// Удаление товара
console.log(`Удаляем: ${product2.title}`);
basketModel.removeItem(product2.id);
console.log("Товаров в корзине после удаления:", basketModel.getItemCount());
console.log("Общая стоимость после удаления:", basketModel.getTotalPrice());

// Получение массива товаров
console.log(basketModel.getItems());

// Очистка корзины
basketModel.clear();
console.log("Товаров в корзине после очистки:", basketModel.getItemCount());
console.log("Общая стоимость после очистки:", basketModel.getTotalPrice());

console.log("---Тестирование BuyerModel---");

// Получение данных покупателя
console.log("Данные покупателя:", buyerModel.getBuyerData());
console.log("Валидация:", buyerModel.validate());

// Добавление частичный данных (только email и phone)
buyerModel.setBuyerField({ 
  email: "test@example.com", 
  phone: "+79091234567" 
});
console.log("Данные после обновления:", buyerModel.getBuyerData());

// Добавление адреса и способа оплаты
buyerModel.setBuyerField({ 
  address: "г. Москва, ул. Тверская, д. 1",
  payment: "card"
});
console.log("Полные данные покупателя:", buyerModel.getBuyerData());

// Обновление только одного поля (телефона)
buyerModel.setBuyerField({ phone: "+79876543210" });
console.log("Данные после обновления телефона:", buyerModel.getBuyerData());

// Валидация корректных данных
const validationResult = buyerModel.validate();
console.log("Ошибки валидации (должно быть пусто):", validationResult);

// Валидация с пустыми полями
buyerModel.clear();
buyerModel.setBuyerField({ 
  email: '', 
  phone: '', 
  address: '',
  payment: null as any
});
console.log("Ошибки валидации:", buyerModel.validate());

// Очистка данных покупателя
buyerModel.clear();
console.log("Данные после очистки:", buyerModel.getBuyerData());

console.log("---Тестирование работы Api---");

const baseApi = new Api(API_URL);
const appApi = new AppApi(baseApi);

// Получение товаров
appApi.getProducts()
  .then((response) => {
    console.log("Всего товаров на сервере:", response.total);
    
    catalogModel.setProducts(response.items);
    
    const savedProducts = catalogModel.getProducts();
    console.log("Каталог после сохранения в модели:", savedProducts);
    console.log("Количество товаров в модели:", savedProducts.length);
    
    // Поиск по id
    if (savedProducts.length > 0) {
      const firstProductId = savedProducts[0].id;
      const foundProduct = catalogModel.getProductById(firstProductId);
      console.log(`Поиск товара по id "${firstProductId}":`, foundProduct?.title);
    }
  });

