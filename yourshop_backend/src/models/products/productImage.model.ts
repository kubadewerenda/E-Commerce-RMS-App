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
BeforeValidate,
} from 'sequelize-typescript'
import ProductVariant from './product.model.js'

@DefaultScope(() => ({ order: [['id', 'DESC']] }))
@Table({ tableName: 'product_images', timestamps: false })
export default class ProductImage extends Model<ProductImage>{
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number

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

    @AllowNull
    @Column(DataType.STRING(512))
    image!: string

    @AllowNull(true)
    @Column(DataType.STRING(255))
    alt_text!: string

    @BeforeValidate
    static async ensureAlt(instance: ProductImage) {
        if(instance.alt_text) return
        if(!instance.variantId) {
            instance.alt_text = 'IMG-Variant'
            return
        }
        const variant = await ProductVariant.findByPk(instance.variantId, {
            attributes: ['name']
        })
        instance.alt_text = `IMG-${variant?.name}`;
    }
}