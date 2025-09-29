// src/scripts/seed.ts
import 'dotenv/config';
import 'reflect-metadata';
import { Orm } from '../db/sequelize.js';

import Category from '../models/categories/category.model.js';
import Product from '../models/products/product.model.js';
import ProductVariant from '../models/products/productVariant.model.js';
import ProductImage from '../models/products/productImage.model.js';
import ProductSpecification from '../models/products/productSpecification.model.js';
import ProductVariantSpecification from '../models/products/productVariantSpecification.model.js';

async function addImages(productId: number, variantId: number, seeds: string[]) {
    const rows = seeds.map((s, i) => ({
        productId,
        variantId,
        image: `https://picsum.photos/seed/${s}/800/600`,
        alt_text: `img-${s}-${i + 1}`,
    }));
    await ProductImage.bulkCreate(rows as any[]);
    }

    async function seed() {
    await Orm.init({ sync: false });

    // === CATEGORIES ===
    const [catElectronics] = await Category.upsert({ name: 'Elektronika', slug: 'elektronika', parentId: null } as any);
    const [catShoes]      = await Category.upsert({ name: 'Buty',        slug: 'buty',        parentId: null } as any);
    const [catAgd]        = await Category.upsert({ name: 'AGD',         slug: 'agd',         parentId: null } as any);
    const [catBooks]      = await Category.upsert({ name: 'Książki',     slug: 'ksiazki',     parentId: null } as any);

    // === PRODUCT #1 — Telefon X10 ===
    const phone = await Product.create({
        name: 'Telefon X10',
        description: 'Smartfon 6.1", 128 GB, NFC',
        categoryId: catElectronics.id,
        tax_rate: '23.00',
        is_active: true,
    } as any);

    await ProductSpecification.bulkCreate([
        { productId: phone.id, name: 'Ekran',  value: '6.1" OLED' },
        { productId: phone.id, name: 'Pamięć', value: '128 GB' },
        { productId: phone.id, name: 'NFC',    value: 'Tak' },
    ] as any[]);

    const phoneVarBlack = await ProductVariant.create({
        productId: phone.id, name: 'Czarny / 128 GB', price: '2199.00', discount_price: null, stock: 42, is_active: true,
    } as any);
    const phoneVarBlue = await ProductVariant.create({
        productId: phone.id, name: 'Niebieski / 128 GB', price: '2199.00', discount_price: '1999.00', stock: 15, is_active: true,
    } as any);

    await ProductVariantSpecification.bulkCreate([
        { productId: phone.id, variantId: phoneVarBlack.id, name: 'Kolor',  value: 'Czarny' },
        { productId: phone.id, variantId: phoneVarBlack.id, name: 'Pamięć', value: '128 GB' },
        { productId: phone.id, variantId: phoneVarBlue.id,  name: 'Kolor',  value: 'Niebieski' },
        { productId: phone.id, variantId: phoneVarBlue.id,  name: 'Pamięć', value: '128 GB' },
    ] as any[]);

    await addImages(phone.id, phoneVarBlack.id, ['phone-black-a', 'phone-black-b', 'phone-black-c']);
    await addImages(phone.id, phoneVarBlue.id,  ['phone-blue-a',  'phone-blue-b',  'phone-blue-c']);

    // === PRODUCT #2 — Runner Pro ===
    const shoe = await Product.create({
        name: 'Runner Pro',
        description: 'Buty do biegania – lekkie i przewiewne',
        categoryId: catShoes.id,
        tax_rate: '23.00',
        is_active: true,
    } as any);

    await ProductSpecification.bulkCreate([
        { productId: shoe.id, name: 'Cholewka', value: 'Siatka' },
        { productId: shoe.id, name: 'Podeszwa', value: 'Pianka EVA' },
    ] as any[]);

    const shoeVar42 = await ProductVariant.create({
        productId: shoe.id, name: 'Rozmiar 42, czarne', price: '349.00', discount_price: null, stock: 24, is_active: true,
    } as any);
    const shoeVar43 = await ProductVariant.create({
        productId: shoe.id, name: 'Rozmiar 43, czarne', price: '349.00', discount_price: '299.00', stock: 12, is_active: true,
    } as any);

    await ProductVariantSpecification.bulkCreate([
        { productId: shoe.id, variantId: shoeVar42.id, name: 'Rozmiar', value: '42' },
        { productId: shoe.id, variantId: shoeVar43.id, name: 'Rozmiar', value: '43' },
        { productId: shoe.id, variantId: shoeVar42.id, name: 'Kolor',   value: 'Czarny' },
        { productId: shoe.id, variantId: shoeVar43.id, name: 'Kolor',   value: 'Czarny' },
    ] as any[]);

    await addImages(shoe.id, shoeVar42.id, ['shoe-42-a', 'shoe-42-b', 'shoe-42-c']);
    await addImages(shoe.id, shoeVar43.id, ['shoe-43-a', 'shoe-43-b', 'shoe-43-c']);

    // === PRODUCT #3 — Blender Pro 900 (AGD) ===
    const blender = await Product.create({
        name: 'Blender Pro 900',
        description: 'Mocny blender kielichowy do smoothie i koktajli',
        categoryId: catAgd.id,
        tax_rate: '23.00',
        is_active: true,
    } as any);

    await ProductSpecification.bulkCreate([
        { productId: blender.id, name: 'Moc',       value: '900 W' },
        { productId: blender.id, name: 'Pojemność', value: '1.5 L' },
        { productId: blender.id, name: 'Ostrza',    value: 'Stal nierdzewna' },
    ] as any[]);

    const blenderStd = await ProductVariant.create({
        productId: blender.id, name: 'Standard (czerwony)', price: '249.00', discount_price: null, stock: 20, is_active: true,
    } as any);
    const blenderPro = await ProductVariant.create({
        productId: blender.id, name: 'Premium (inox)', price: '329.00', discount_price: '299.00', stock: 12, is_active: true,
    } as any);

    await ProductVariantSpecification.bulkCreate([
        { productId: blender.id, variantId: blenderStd.id, name: 'Kolor', value: 'Czerwony' },
        { productId: blender.id, variantId: blenderPro.id, name: 'Kolor', value: 'Inox' },
    ] as any[]);

    await addImages(blender.id, blenderStd.id, ['blender-red-a', 'blender-red-b', 'blender-red-c']);
    await addImages(blender.id, blenderPro.id, ['blender-inox-a', 'blender-inox-b', 'blender-inox-c']);

    // === PRODUCT #4 — Odkurzacz Cyclone X (AGD) ===
    const vacuum = await Product.create({
        name: 'Odkurzacz Cyclone X',
        description: 'Bezworkowy odkurzacz cyklonowy z filtrem HEPA',
        categoryId: catAgd.id,
        tax_rate: '23.00',
        is_active: true,
    } as any);

    await ProductSpecification.bulkCreate([
        { productId: vacuum.id, name: 'Moc',    value: '1200 W' },
        { productId: vacuum.id, name: 'Filtr',  value: 'HEPA H13' },
        { productId: vacuum.id, name: 'Zasięg', value: '9 m' },
    ] as any[]);

    const vacuumBasic = await ProductVariant.create({
        productId: vacuum.id, name: 'Basic', price: '399.00', discount_price: null, stock: 30, is_active: true,
    } as any);
    const vacuumTurbo = await ProductVariant.create({
        productId: vacuum.id, name: 'Turbo', price: '499.00', discount_price: '449.00', stock: 18, is_active: true,
    } as any);

    await ProductVariantSpecification.bulkCreate([
        { productId: vacuum.id, variantId: vacuumBasic.id, name: 'Końcówki', value: 'Szczelinowa, podłogowa' },
        { productId: vacuum.id, variantId: vacuumTurbo.id, name: 'Końcówki', value: 'Szczelinowa, turbo' },
    ] as any[]);

    await addImages(vacuum.id, vacuumBasic.id, ['vacuum-basic-a', 'vacuum-basic-b', 'vacuum-basic-c']);
    await addImages(vacuum.id, vacuumTurbo.id, ['vacuum-turbo-a', 'vacuum-turbo-b', 'vacuum-turbo-c']);

    // === PRODUCT #5 — Algorytmy w praktyce (Książki) ===
    const bookAlgo = await Product.create({
        name: 'Algorytmy w praktyce',
        description: 'Przystępne wprowadzenie do struktur danych i algorytmów',
        categoryId: catBooks.id,
        tax_rate: '5.00',
        is_active: true,
    } as any);

    await ProductSpecification.bulkCreate([
        { productId: bookAlgo.id, name: 'Autor', value: 'J. Kowalski' },
        { productId: bookAlgo.id, name: 'ISBN',  value: '978-83-000000-0-0' },
        { productId: bookAlgo.id, name: 'Stron', value: '420' },
    ] as any[]);

    const bookHard = await ProductVariant.create({
        productId: bookAlgo.id, name: 'Twarda oprawa', price: '119.00', discount_price: '99.00', stock: 50, is_active: true,
    } as any);
    const bookSoft = await ProductVariant.create({
        productId: bookAlgo.id, name: 'Miękka oprawa', price: '89.00', discount_price: null, stock: 80, is_active: true,
    } as any);

    await ProductVariantSpecification.bulkCreate([
        { productId: bookAlgo.id, variantId: bookHard.id, name: 'Oprawa', value: 'Twarda' },
        { productId: bookAlgo.id, variantId: bookSoft.id, name: 'Oprawa', value: 'Miękka' },
    ] as any[]);

    await addImages(bookAlgo.id, bookHard.id, ['book-hard-a', 'book-hard-b', 'book-hard-c']);
    await addImages(bookAlgo.id, bookSoft.id, ['book-soft-a', 'book-soft-b', 'book-soft-c']);

    // === PRODUCT #6 — Lampka biurkowa LED Flex (AGD) ===
    const lamp = await Product.create({
        name: 'Lampka biurkowa LED Flex',
        description: 'Regulowana lampka LED z dwoma barwami światła',
        categoryId: catAgd.id,
        tax_rate: '23.00',
        is_active: true,
    } as any);

    await ProductSpecification.bulkCreate([
        { productId: lamp.id, name: 'Moc',       value: '8 W' },
        { productId: lamp.id, name: 'Barwa',     value: 'Ciepła/Zimna' },
        { productId: lamp.id, name: 'Zasilanie', value: 'USB-C' },
    ] as any[]);

    const lampWhite = await ProductVariant.create({
        productId: lamp.id, name: 'Biała', price: '129.00', discount_price: null, stock: 40, is_active: true,
    } as any);
    const lampBlack = await ProductVariant.create({
        productId: lamp.id, name: 'Czarna', price: '129.00', discount_price: '109.00', stock: 36, is_active: true,
    } as any);

    await ProductVariantSpecification.bulkCreate([
        { productId: lamp.id, variantId: lampWhite.id, name: 'Kolor', value: 'Biały' },
        { productId: lamp.id, variantId: lampBlack.id, name: 'Kolor', value: 'Czarny' },
    ] as any[]);

    await addImages(lamp.id, lampWhite.id, ['lamp-white-a', 'lamp-white-b', 'lamp-white-c']);
    await addImages(lamp.id, lampBlack.id, ['lamp-black-a', 'lamp-black-b', 'lamp-black-c']);

    console.log('Seed OK');
    process.exit(0);
}

seed().catch((e) => {
    console.error(e);
    process.exit(1);
});
