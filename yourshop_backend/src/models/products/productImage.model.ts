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
@Table({ tableName: 'product_images', timestamps: true })
export default class ProductImage extends Model<ProductImage>{
}