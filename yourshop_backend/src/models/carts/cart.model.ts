import {
    Table, 
    Model, 
    Column, 
    DataType, 
    PrimaryKey, 
    AutoIncrement,
    AllowNull, 
    Default, 
    Unique, 
    HasMany, 
    BeforeValidate,
    ForeignKey,
    BelongsTo,
    CreatedAt,
    UpdatedAt,
    DefaultScope
} from 'sequelize-typescript'
import CartItem from './cartItem.model.js'
import User from '../users/user.model.js'
import generateCartCode from '../utils/cartCode.util.js'

@DefaultScope(() => ({ order: [['created_at', 'DESC']] }))
@Table({ tableName: 'carts', timestamps: true })
export default class Cart extends Model<Cart>{
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number

    @Unique
    @AllowNull(true)
    @Column(DataType.STRING(20))
    cart_code!: string | null

    @ForeignKey(() => User)
    @AllowNull(true)
    @Column(DataType.INTEGER)
    userId!: number | null

    @BelongsTo(() => User, {
        as: 'user',
        foreignKey: 'userId',
        onDelete: 'SET NULL'
    })
    user?: User | null

    @AllowNull(false)
    @Default(false)
    @Column(DataType.BOOLEAN)
    paid!: boolean

    @HasMany(() => CartItem, {
        as: 'items',
        foreignKey: 'cartId',
        onDelete: 'CASCADE'
    })
    items?: CartItem[]

    @CreatedAt
    @Column(DataType.DATE)
    created_at!: Date

    @UpdatedAt
    @Column(DataType.DATE)
    updated_at!: Date

    @BeforeValidate
    static async ensureCartCode(instance: Cart){
        if(instance.cart_code) return
        while(true){
            const code = generateCartCode()
            const exists = await Cart.count({ where: { cart_code: code } })
            if(!exists) {
                instance.cart_code = code
                break
            }
        }
    }
}

