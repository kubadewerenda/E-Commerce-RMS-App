import {
Table,
Column,
Model,
DataType,
PrimaryKey,
AutoIncrement,
AllowNull,
DefaultScope,
ForeignKey,
BelongsTo,
Default,
Unique,
HasMany,
BeforeValidate,
} from 'sequelize-typescript'
import { v4 as uuidv4 } from 'uuid';
import Product from './product.model.js'
import ProductVariantSpecification from './productVariantSpecification.model.js'
import ProductImage from './productImage.model.js';

@DefaultScope(() => ({ order: [['name', 'DESC']] }))
@Table({ tableName: 'product_variants', timestamps: false })
export default class ProductVariant extends Model<ProductVariant>{
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number

    @ForeignKey(() => Product)
    @AllowNull
    @Column(DataType.INTEGER)
    productId!: number

    @BelongsTo(() => Product, {
        as: 'product',
        foreignKey: 'productId',
        onDelete: 'CASCADE'
    })
    product?: Product

    @AllowNull
    @Column(DataType.STRING(100))
    name!: string | null

    @AllowNull
    @Column(DataType.DECIMAL(10, 2))
    price!: string | null

    @AllowNull
    @Column(DataType.DECIMAL(10, 2))
    discount_price!: string

    @AllowNull
    @Default(0)
    @Column(DataType.INTEGER)
    stock!: number

    @AllowNull
    @Unique(true)
    @Column(DataType.STRING(100))
    sku!: string | null

    @AllowNull
    @Default(true)
    @Column(DataType.BOOLEAN)
    is_active!: boolean

    @HasMany(() => ProductVariantSpecification, {
        as: 'specifications',
        foreignKey: 'variantId',
        onDelete: 'CASCADE'
    })
    specifications?: ProductVariantSpecification[] | null

    @HasMany(() => ProductImage, {
        as: 'images', 
        foreignKey: 'productId', 
        onDelete: 'CASCADE' 
    })
    images?: ProductImage[] | null

    public static generateSku(): string {
        return `PROD-${uuidv4().replace(/-/g, '').slice(0, 8).toUpperCase()}`
    }

    @BeforeValidate
    static async ensureSku(instance: ProductVariant){
        if(instance.sku) return
        let candidate = ProductVariant.generateSku()
        while(true){
            const exists = await ProductVariant.count({ where: { sku: candidate } })
            if(!exists) break
            candidate = ProductVariant.generateSku()
        }
        instance.sku = candidate
    }
}