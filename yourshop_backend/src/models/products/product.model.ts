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
import { baseSlug, ensureUniqueSlug } from '../utils/slug.util.js'
import Category from '../category/category.model.js'
import ProductSpecification from './productSpecification.model.js'
import ProductVariant from './productVariant.model.js'

@DefaultScope(() => ({ order: [['created_at', 'DESC']] }))
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

    @BelongsTo(() => Category,{
        as: 'category', 
        foreignKey: 'categoryId', 
        onDelete: 'SET NULL' 
    })
    category?: Category | null

    @AllowNull(false)
    @Default('23.00')
    @Column(DataType.DECIMAL(4,2))
    tax_rate!: string

    @AllowNull(false)
    @Default(true)
    @Column(DataType.BOOLEAN)
    is_active!: boolean


    @HasMany(() => ProductSpecification, { 
        as: 'specifications', 
        foreignKey: 'productId', 
        onDelete: 'CASCADE' 
    })
    specifications?: ProductSpecification[] | null

    @HasMany(() => ProductVariant, { 
        as: 'variants', 
        foreignKey: 'productId', 
        onDelete: 'CASCADE' 
    })
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
}