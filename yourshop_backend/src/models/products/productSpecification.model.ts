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
import Product from './product.model'

@DefaultScope(() => ({ order: [['name', 'ASC']] }))
@Table({ tableName: 'product_specifications', timestamps: true })
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

    toString() {
        return `${this.product?.name ?? 'Product'} | ${this.name} : ${this.value}`;
    }
}