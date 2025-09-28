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
@Table({ tableName: 'product_variants', timestamps: true })
export default class ProductVariant extends Model<ProductVariant>{
}