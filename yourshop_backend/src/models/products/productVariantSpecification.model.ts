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
import ProductVariant from './productVariant.model'

@DefaultScope(() => ({ order: [['name', 'ASC']] }))
@Table({ tableName: 'product_variant_specifications', timestamps: false })
export default class ProductVariantSpecification extends Model<ProductVariantSpecification>{
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number

    @ForeignKey(() => ProductVariant)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    variantId!: number

    @BelongsTo(() => ProductVariant, { 
        as: 'product', 
        foreignKey: 'productId', 
        onDelete: 'CASCADE' 
    })
    variant?: ProductVariant

    @AllowNull(false)
    @Column(DataType.STRING(100))
    name!: string

    @AllowNull(false)
    @Column(DataType.STRING(255))
    value!: string
}