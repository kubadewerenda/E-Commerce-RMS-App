import {
    Table, 
    Model, 
    Column, 
    DataType, 
    PrimaryKey, 
    AutoIncrement,
    AllowNull, 
    Default, 
    ForeignKey, 
    BelongsTo,
    DefaultScope,
    CreatedAt,
    UpdatedAt
} from 'sequelize-typescript'
import Cart from './cart.model.js'
import ProductVariant from '../products/productVariant.model.js'

@DefaultScope(() => ({ order: [['created_at', 'DESC']] }))
@Table({ tableName: 'cart_items', timestamps: true })
export default class CartItem extends Model<CartItem>{
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number

    @ForeignKey(() => Cart)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    cartId!: number

    @BelongsTo(() => Cart, {
        as: 'cart',
        foreignKey: 'cartId',
        onDelete: 'CASCADE'
    })
    cart?: Cart

    @ForeignKey(() => ProductVariant)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    variantId!: number

    @BelongsTo(() => ProductVariant, {
        as: 'variant',
        foreignKey: 'variantId',
        onDelete: 'CASCADE'
    })
    variant?: ProductVariant

    @AllowNull(false)
    @Default(1)
    @Column(DataType.INTEGER)
    quantity!: number

    @CreatedAt
    @Column(DataType.DATE)
    created_at!: Date

    @UpdatedAt
    @Column(DataType.DATE)
    updated_at!: Date
}