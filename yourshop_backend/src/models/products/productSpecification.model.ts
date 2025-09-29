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
} from 'sequelize-typescript'
import Product from './product.model.js'

@DefaultScope(() => ({ order: [['name', 'DESC']] }))
@Table({ tableName: 'product_specifications', timestamps: false })
export default class ProductSpecification extends Model<ProductSpecification>{
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number

    @ForeignKey(() => Product)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    productId!: number

    @BelongsTo(() => Product, { as: 'product', foreignKey: 'productId', onDelete: 'CASCADE' })
    product?: Product

    @AllowNull(false)
    @Column(DataType.STRING(100))
    name!: string

    @AllowNull(false)
    @Column(DataType.STRING(255))
    value!: string
}