import {
Table,
Column,
Model,
DataType,
PrimaryKey,
AutoIncrement,
AllowNull,
Unique,
Default,
DefaultScope,
BelongsTo,
ForeignKey,
HasMany,
CreatedAt,
UpdatedAt,
BeforeValidate,
Scopes,
} from 'sequelize-typescript'
import { baseSlug, ensureUniqueSlug } from '../common/slug.util'
import Category from '../category/category.model'
import ProductSpecification from './productSpecification.model'
import ProductVariant from './productVariant.model'
import ProductImage from './productImage.model'

@DefaultScope(() => ({ order: [['name', 'ASC']] }))
@Scopes({
    withCategory: { include: [{ model: () => Category, as: 'category' }] },
    withImages: { include: [{ model: () => ProductImage, as: 'images' }] },
    withVariants: { include: [{ model: () => ProductVariant, as: 'variants' }] },
    withSpecifications: { include: [{ model: () => ProductSpecification, as: 'specifications' }] },
    withAll: {
        include: [
        { model: () => Category, as: 'category' },
        { model: () => ProductImage, as: 'images' },
        { model: () => ProductVariant, as: 'variants' },
        { model: () => ProductSpecification, as: 'specifications' },
        ],
    },
})
@Table({ tableName: 'products', timestamps: true })
export default class Product extends Model<Product>{
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number

    @AllowNull(false)
    @Column(DataType.STRING(255))
    name!: string

    @AllowNull(true)
    @Unique(true)
    @Column(DataType.STRING(255))
    slug!: string | null

    @AllowNull(false)
    @Column(DataType.TEXT)
    description!: string

    @ForeignKey(() => Category)
    @AllowNull(true)
    @Column(DataType.INTEGER)
    categoryId!: number | null

    @BelongsTo(() => Category, { as: 'category', foreignKey: 'categoryId', onDelete: 'SET NULL' })
    category?: Category | null

    @AllowNull(false)
    @Default('23.00')
    @Column(DataType.DECIMAL(4,2))
    tax_rate!: string

    @AllowNull(false)
    @Default(true)
    @Column(DataType.BOOLEAN)
    is_active!: boolean

    @HasMany(() => ProductImage, { as: 'images', foreignKey: 'productId', onDelete: 'CASCADE' })
    images?: ProductImage[] | null

    @HasMany(() => ProductSpecification, { as: 'specifications', foreignKey: 'productId', onDelete: 'CASCADE' })
    specifications?: ProductSpecification[] | null

    @HasMany(() => ProcudtVariant, { as: 'variants', foreignKey: 'productId', onDelete: 'CASCADE' })
    variants?: ProductVariant[] | null

    @CreatedAt
    @Column(DataType.DATE)
    created_at!: Date

    @UpdatedAt
    @Column(DataType.DATE)
    updated_at!: Date

    @BeforeValidate
    static async setSlug(instance: Product){
        if(!instance.name) return
        const desired = baseSlug(instance.name)
        if(!instance.slug || instance.slug !== desired){
            instance.slug = await ensureUniqueSlug(Product, desired, 'slug', instance.id ?? null)
        }
    }

    toString(){
        return this.name
    }
}